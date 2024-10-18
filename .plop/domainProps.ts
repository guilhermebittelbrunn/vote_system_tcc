import { NodePlopAPI } from 'node-plop';
import addModuleAndEntityPrompts from './utils/addModuleAndEntityPrompts';
import { getTableInformation, getFullDomainProp } from './utils/getTableInformation';

export default function (plop: NodePlopAPI) {
    plop.setGenerator('domainProps', {
        description: 'Add props to already created domain entity file using db table information',
        async prompts(inquirer) {
            return addModuleAndEntityPrompts(inquirer);
        },
        actions() {
            return [
                {
                    type: 'modify',
                    path: '../src/modules/{{module}}/domain/{{camelCase entity}}.ts',
                    templateFile: '../src/modules/{{module}}/domain/{{camelCase entity}}.ts',
                    async transform(template: string, data: any): Promise<string> {
                        const dataRgx = /({{data}})|({{ data }})|({{data }})|({{ data}})/g;
                        let finalColumns = '';

                        if (!template.match(dataRgx)) {
                            throw new Error(
                                'You must add a {{data}} line where you want props to be put on your entity file',
                            );
                        }

                        const tableName = plop.renderString(`{{snakeCase entity}}`, data);

                        const columns = await getTableInformation(tableName);

                        for (const column of columns) {
                            const propInfo = getFullDomainProp(column, plop);

                            if (!propInfo) {
                                continue
                            }

                            finalColumns += propInfo
                        }

                        template = template.replace(dataRgx, finalColumns);

                        return template;
                    },
                },
            ];
        },
    });
}
