import { Actions, NodePlopAPI, PromptQuestion } from 'node-plop';
import { Answers } from 'inquirer';
import { getDirectories, getFiles } from './utils/getDirectories';
import path from 'path';
import addModuleAndEntityPrompts from './utils/addModuleAndEntityPrompts';

const getModuleDomains = (moduleName: string) => {
    const files = getFiles(
        path.resolve(__dirname, `../src/shared/infra/database/TypeORM/entities/${moduleName}`),
    );

    return files.map(fileName => fileName.replace(/(.ts)/g, ''));
};

export default function (plob: NodePlopAPI) {
    plob.setGenerator('useCase', {
        description: 'Create Base useCase files',
        async prompts(inquirer): Promise<Answers> {
            return addModuleAndEntityPrompts(inquirer, [
                {
                    type: 'input',
                    message: 'Name',
                    name: 'name',
                },
                {
                    type: 'confirm',
                    name: 'isAnemic',
                    message: 'Is an anemic use case?',
                    default: false,
                },
                {
                    type: 'list',
                    when(answers) {
                        return !answers.isAnemic;
                    },
                    name: 'controllerType',
                    message: 'Controller type (Resolver or Controller)',
                    choices: ['GraphQL', 'REST', 'none'],
                    default: 'REST',
                },
                {
                    type: 'list',
                    when(answers) {
                        return answers.isAnemic;
                    },
                    name: 'controllerType',
                    message: 'Controller type (Resolver or Controller)',
                    choices: ['GraphQL', 'REST'],
                    default: 'REST',
                },
                {
                    type: 'confirm',
                    name: 'shouldIncludeDTO',
                    message: 'Include request DTO?',
                    default: false,
                },
            ]);
        },
        actions(answers) {
            if (!answers) {
                return [];
            }

            const actions: Actions = [];

            if (answers.isAnemic) {
                switch (answers.controllerType) {
                    case 'REST':
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/index.ts',
                            templateFile: 'templates/useCase/anemicIndexWithController.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Controller.ts',
                            templateFile: 'templates/useCase/anemicController.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Controller.test.ts',
                            templateFile: 'templates/useCase/useCaseController.test.ts.hbs',
                            skipIfExists: true,
                        });
                        break;
                    case 'GraphQL':
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/index.ts',
                            templateFile: 'templates/useCase/anemicIndexWithResolver.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Resolver.ts',
                            templateFile: 'templates/useCase/anemicResolver.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Resolver.test.ts',
                            templateFile: 'templates/useCase/useCaseResolver.test.ts.hbs',
                            skipIfExists: true,
                        });
                        break;

                    default:
                        break;
                }
            } else {
                actions.push(
                    {
                        type: 'add',
                        path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}.ts',
                        templateFile: 'templates/useCase/useCase.ts.hbs',
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}.spec.ts',
                        templateFile: 'templates/useCase/useCase.spec.ts.hbs',
                        skipIfExists: true,
                    },
                );

                switch (answers.controllerType) {
                    case 'REST':
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/index.ts',
                            templateFile: 'templates/useCase/indexWithController.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Controller.ts',
                            templateFile: 'templates/useCase/useCaseController.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Controller.test.ts',
                            templateFile: 'templates/useCase/useCaseController.test.ts.hbs',
                            skipIfExists: true,
                        });
                        break;
                    case 'GraphQL':
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/index.ts',
                            templateFile: 'templates/useCase/indexWithResolver.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Resolver.ts',
                            templateFile: 'templates/useCase/useCaseResolver.ts.hbs',
                            skipIfExists: true,
                        });
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}Resolver.test.ts',
                            templateFile: 'templates/useCase/useCaseResolver.test.ts.hbs',
                            skipIfExists: true,
                        });
                        break;
                    case 'none':
                        actions.push({
                            type: 'add',
                            path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/index.ts',
                            templateFile: 'templates/useCase/index.ts.hbs',
                            skipIfExists: true,
                        });
                        break;
                    default:
                        break;
                }
            }

            if (answers.shouldIncludeDTO) {
                actions.push({
                    type: 'add',
                    path: '../src/modules/{{module}}/useCases/{{domain}}/{{camelCase entity}}/{{camelCase name}}/{{camelCase name}}DTO.ts',
                    templateFile: 'templates/useCase/useCaseDTO.ts.hbs',
                    skipIfExists: true,
                });
            }

            return actions;
        },
    });
}
