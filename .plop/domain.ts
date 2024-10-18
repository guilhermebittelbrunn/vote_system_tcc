import path from 'path';
import { NodePlopAPI } from 'plop';
import { getDirectories } from './utils/getDirectories';
import { getFullDomainProp, getTableInformation } from './utils/getTableInformation';

const removeBracketFromTemplate = (template: string): string => {
    return template.replace('--dbInfo--', '');
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
                name: 'includeDatabaseInfo',
                message: 'Include database information?',
                default: false,
            },
            {
                type: 'confirm',
                when(answers) {
                    return !answers.includeDatabaseInfo;
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
                    path: '../src/modules/{{module}}/domain/{{camelCase name}}.ts',
                    templateFile: answers?.shouldIncludeDateColumns
                        ? 'templates/domain/domainDateColumns.ts.hbs'
                        : 'templates/domain/domain.ts.hbs',
                    async transform(template: string) {
                        if (answers?.includeDatabaseInfo) {
                            let finalProps: string = "";

                            const tableName = plop.renderString(`{{snakeCase name}}`, answers);
                            const columns = await getTableInformation(tableName);

                            if (!columns || !columns.length) {
                                return removeBracketFromTemplate(template);
                            }

                            for (const column of columns) {
                                const propStr = getFullDomainProp(column, plop);

                                if (propStr) {
                                    finalProps += propStr
                                }
                            }

                            return template.replace("--dbInfo--", finalProps);
                        }

                        return removeBracketFromTemplate(template);
                    },
                    skipIfExists: true,
                },
            ];
        },
    });
}
