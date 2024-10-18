import { NodePlopAPI } from 'plop';
import { PromptQuestion } from 'node-plop';
import { Answers } from 'inquirer';
import path from 'path';
import { getDirectories, getFiles } from './utils/getDirectories';
import addModuleAndEntityPrompts from './utils/addModuleAndEntityPrompts';

const getterTemplate = `
    get {{key}}(): {{type}} {
        return this.props.{{key}};
    }
`;

type IColumAndTypes = Record<
    string,
    {
        type: string;
        isOptional: boolean;
    }
>;

const getColumnsAndTypes = (str: string): IColumAndTypes => {
    const columnsAndTypes: IColumAndTypes = {};
    let foundedProps = false;
    let endedProps = false;

    const lines = str.split('\n').filter(str => str.trim());

    lines.forEach(line => {
        if (line.match(/(interface)\s+I+\w+(Props)/g)) {
            foundedProps = true;
        } else if (foundedProps && line.match(/}/g)) {
            endedProps = true;
            foundedProps = false;
        } else if (foundedProps && !endedProps) {
            let keyValue = line.split('?: ');
            let isOptional = true;

            if (keyValue.length === 1) {
                isOptional = false;
                keyValue = line.split(': ');
            }

            const [key, value] = keyValue;

            columnsAndTypes[key.trim()] = {
                type: value.trim().replace(/;/g, ''),
                isOptional,
            };
        }
    });

    return columnsAndTypes;
};

export default function (plop: NodePlopAPI) {
    plop.setGenerator('domainGetters', {
        description: 'Add getters to domain entity',
        async prompts(inquirer): Promise<Answers> {
            return addModuleAndEntityPrompts(inquirer);
        },
        actions(aswers) {
            return [
                {
                    type: 'modify',
                    path: '../src/modules/{{module}}/domain/{{camelCase entity}}.ts',
                    templateFile: '../src/modules/{{module}}/domain/{{camelCase entity}}.ts',
                    transform(template: string) {
                        const columns = getColumnsAndTypes(template);
                        const dataRgx = /({{data}})|({{ data }})|({{data }})|({{ data}})/g;
                        let finalGettersString = '';

                        for (const key in columns) {
                            const props = columns[key];

                            finalGettersString += plop.renderString(getterTemplate, {
                                key,
                                type: props.isOptional ? `${props.type} | undefined` : props.type,
                            });
                        }

                        if (!template.match(dataRgx)) {
                            throw new Error(
                                'You must add a {{data}} line where you want getters to be put on your entity file',
                            );
                        }

                        template = template.replace(dataRgx, finalGettersString);

                        return template;
                    },
                },
            ];
        },
    });
}
