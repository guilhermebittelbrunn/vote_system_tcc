import path from 'path';
import fs from 'fs';
import { NodePlopAPI } from 'plop';
import { getDirectories } from './utils/getDirectories';
import {
    getTableInformation,
    getColumnTSType,
    getColumnDecorator,
    getColumnDecoratorInfo,
} from './utils/getTableInformation';

export const writeFile = (desiredPath: string, data: string) =>
    fs.writeFileSync(relativePath(desiredPath), data, { encoding: 'utf-8' });

const relativePath = (desiredPath: string) => path.resolve(__dirname, desiredPath);

const readFile = (desiredPath: string) => fs.readFileSync(relativePath(desiredPath)).toString();

const clearTemplate = (str: string): string => str.replace(/(&amp;#x27;)|(&#x27;)/g, "'");

const writeWithTemplate = (plop: NodePlopAPI, templatePath: string, desiredPath: string, data: any): string => {
    if (fs.existsSync(relativePath(desiredPath))) {
        return `[SKIPED] ${desiredPath}`;
    }

    const templateContent = readFile(templatePath);
    const templateLoaded = plop.renderString(templateContent, data);

    writeFile(desiredPath, clearTemplate(templateLoaded));

    return `[CREATED] ${desiredPath}`;
};

const dbDecoratorTemplate = `
    @{{pascalCase decorator}}({{decoratorInfo}})
    {{column}}{{nullable}}: {{type}};
`;

const interfacePropTemplate = `\t{{column}}{{nullable}}: {{type}};\n`;

const tableNameTemp = `{{snakeCase name}}`;

export default function (plop: NodePlopAPI) {
    const defaultSuccessfulMessage = 'Entity created';

    plop.setGenerator('ORMEntity', {
        description: 'Create a db entity with general and TypeORM boilerplate',
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
                choices: getDirectories(relativePath('../src/modules')),
            },
            {
                type: 'confirm',
                name: 'useDatabaseInformation',
                message: 'Include database information?',
                default: true,
            },
            {
                type: 'confirm',
                name: 'shouldIncludeDateColumns',
                message: 'Include audit date columns?',
                when(answers) {
                    return !answers.useDatabaseInformation;
                },
                default: false,
            },
        ],
        actions(answers) {
            return [
                // Entity handling
                async function (ans) {
                    const answers = ans as any;

                    const targetFilePath = plop.renderString(
                        '../src/shared/infra/database/TypeORM/entities/{{module}}/{{camelCase name}}.ts',
                        answers,
                    );

                    if (answers.useDatabaseInformation) {
                        const tableName = plop.renderString(tableNameTemp, answers);

                        const columns = await getTableInformation(tableName);
                        let finalData = '';

                        for (const column of columns) {
                            if (column.name !== 'id') {
                                finalData += plop.renderString(dbDecoratorTemplate, {
                                    column: column.name,
                                    nullable: column.isNullable ? '?' : '',
                                    type: getColumnTSType(column),
                                    decorator: getColumnDecorator(column),
                                    decoratorInfo: getColumnDecoratorInfo(column),
                                });
                            }
                        }

                        answers.data = finalData;

                        return writeWithTemplate(plop, 'templates/db/Entity.ts.hbs', targetFilePath, answers);
                    }

                    answers.data = '';

                    const templatePath = answers?.shouldIncludeDateColumns
                        ? 'templates/db/EntityDateColumns.ts.hbs'
                        : 'templates/db/Entity.ts.hbs';

                    writeWithTemplate(plop, templatePath, targetFilePath, answers);

                    return defaultSuccessfulMessage;
                },
            ];
        },
    });
}
