import path from 'path';
import fs from 'fs';
import { NodePlopAPI } from 'plop';
import { getDirectories } from './utils/getDirectories';
import { getDomainProps } from './utils/getDomainFile';
import { getTableInformation, getTableName } from './utils/getTableInformation';

const removeBracketFromTemplate = (template: string): string => {
    return template.replace(/(--domainInfo--)|(--entityInfo--)|(--dtoInfo--)/g, '');
};

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
            if (!answers) {
                return [];
            }

            return [
                {
                    type: 'add',
                    path: '../src/modules/{{module}}/mappers/{{camelCase name}}Mapper.ts',
                    templateFile: answers.shouldIncludeDateColumns
                        ? 'templates/domain/mapperDateColumns.ts.hbs'
                        : 'templates/domain/mapper.ts.hbs',
                    async transform(template: string) {
                        if (!answers.includeDomainInfo) {
                            return removeBracketFromTemplate(template);
                        }

                        const domainProps = getDomainProps(answers.module, answers.name, answers.isInSubfolder);

                        let finalDomainPropsStr = '';
                        for (let prop of domainProps) {
                            finalDomainPropsStr += `\t\t${prop.name}: undefined,\n`;
                        }

                        const tableColumns = await getTableInformation(getTableName(answers.name, plop));
                        if (!tableColumns || !tableColumns.length) {
                            return removeBracketFromTemplate(template);
                        }

                        let finalTablePropsStr = '';
                        for (const column of tableColumns) {
                            if (column.name === 'id') {
                                continue;
                            }
                            finalTablePropsStr += `${column.name}: undefined,\n`;
                        }

                        template = template.replace('--domainInfo--', finalDomainPropsStr);
                        template = template.replace('--dtoInfo--', finalDomainPropsStr);
                        template = template.replace('--entityInfo--', finalTablePropsStr);

                        return template;
                    },
                },
            ];
        },
    });
}
