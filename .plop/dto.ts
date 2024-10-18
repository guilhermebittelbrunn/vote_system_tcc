import path from 'path';
import { NodePlopAPI } from 'plop';
import { getDirectories } from './utils/getDirectories';
import getDomainFile, { getDomainProps } from './utils/getDomainFile';

const removeBracketFromTemplate = (template: string): string => {
    return template.replace('--dbInfo--', '');
};

const dtoPropTemplate = `\t@Field({{nullable}})\n\t{{prop}}: {{type}}\n\n`;

export default function (plop: NodePlopAPI) {
    plop.setGenerator('domain', {
        description: 'Base domain files with dto and mappers',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Name',
            },
            {
                type: 'list',
                name: 'module',
                message: 'Module',
                choices: getDirectories(path.resolve(__dirname, '../src/modules')),
            },
            {
                type: 'confirm',
                name: 'includeDomainInfo',
                message: 'Include domain information?',
                default: false,
            },
            {
                type: 'confirm',
                when(answers) {
                    return answers.includeDomainInfo;
                },
                name: 'isInSubfolder',
                message: 'Domain entity is on a subfolder? (Ex: domain/product/product.ts)',
                default: false,
            },
            {
                type: 'confirm',
                when(answers) {
                    return !answers.includeDomainInfo;
                },
                name: 'shouldIncludeDateColumns',
                message: 'Include audit date columns?',
                default: false,
            },
        ],
        actions: answers => {
            return [
                {
                    type: 'add',
                    path: '../src/modules/{{module}}/dtos/{{camelCase name}}.ts',
                    templateFile: answers?.shouldIncludeDateColumns
                        ? 'templates/domain/dtoDateColumns.ts.hbs'
                        : 'templates/domain/dto.ts.hbs',
                    async transform(template: string) {
                        if (answers?.includeDomainInfo) {
                            const props = getDomainProps(answers.module, answers.name, answers.isInSubfolder);
                            let finalPropsStr = '';

                            for (const prop of props) {
                                if (['enabled', 'createdAt', 'updatedAt'].includes(prop.name)) {
                                    prop.isOptional = false;
                                }

                                if (prop.type === 'UniqueEntityID') {
                                    prop.type = 'string';
                                }

                                if (prop.isOptional) {
                                    prop.name += '?';
                                }

                                finalPropsStr += plop.renderString(dtoPropTemplate, {
                                    nullable: prop.isOptional ? `{ nullable: true }` : '',
                                    prop: prop.name,
                                    type: prop.type,
                                });
                            }

                            return template.replace('--dbInfo--', finalPropsStr);
                        }

                        return removeBracketFromTemplate(template);
                    },
                    skipIfExists: true,
                },
            ];
        },
    });
}
