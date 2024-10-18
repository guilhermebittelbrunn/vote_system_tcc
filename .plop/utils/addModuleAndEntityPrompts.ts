import { Inquirer, Answers } from 'inquirer';
import { PromptQuestion } from 'node-plop';
import path from 'path';
import { getDirectories, getFiles } from './getDirectories';

const getModuleDomains = (moduleName: string) => {
    const files = getFiles(
        path.resolve(__dirname, `../../src/shared/infra/database/TypeORM/entities/${moduleName}`),
    );

    return files.map(fileName => fileName.replace(/(\.ts)/g, ''));
};

/**
 * add two prompts to inquiter, Module & Entity
 * @param aditionalPrompts prompts that will be made after that 2 questions
 */
export default async function addModuleAndEntityPrompts(
    inquirer: Inquirer,
    aditionalPrompts?: Array<PromptQuestion>,
): Promise<Answers> {
    let allAnswers = {};

    const prompts: PromptQuestion[] = [
        {
            type: 'list',
            name: 'module',
            message: 'Module',
            choices: getDirectories(path.resolve(__dirname, '../../src/modules')),
        },
        {
            type: 'list',
            name: 'entity',
            message: 'Entity',
            choices: [],
        },
        ...(aditionalPrompts || []),
    ];

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];

        if (prompt.when) {
            if (typeof prompt.when === 'function') {
                prompt.when = await (prompt as any).when(allAnswers);
            }
        }

        const answer = await inquirer.prompt(prompt as any);

        if (typeof answer === 'object') {
            if (i === 0) {
                (prompts[1] as any).choices = getModuleDomains((answer as any).module);
            }

            allAnswers = { ...allAnswers, ...answer };
        }
    }

    return allAnswers;
}
