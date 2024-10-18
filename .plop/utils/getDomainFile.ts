import path from 'path';
import fs from 'fs';

const getDomainFile = (module: string, entity: string, isInSubfolder: boolean): string => {
    let file: Buffer;

    if (isInSubfolder) {
        file = fs.readFileSync(
            path.resolve(__dirname, `../../src/modules/${module}/domain/${entity}/${entity}.ts`),
        );
    } else {
        file = fs.readFileSync(path.resolve(__dirname, `../../src/modules/${module}/domain/${entity}.ts`));
    }

    return file.toString();
};

interface DomainPropertyProps {
    name: string;
    type: string;
    isOptional: boolean;
}

export const getDomainProps = (
    module: string,
    entity: string,
    isInSubfolder: boolean,
): Array<DomainPropertyProps> => {
    const fileData = getDomainFile(module, entity, isInSubfolder);

    const lines = fileData.split('\n').filter(l => l.trim());

    let foundProps = false;
    let finalProps: Array<DomainPropertyProps> = [];

    for (let line of lines) {
        if (line.match(/(interface)+\s+I+\w+\w+(Props)/g)) {
            foundProps = true;
            continue;
        }
        if (foundProps && line.match(/}/g)) {
            foundProps = false;
            continue;
        }

        if (foundProps) {
            let [prop, type] = line.replace(/[^A-Z?:<>]/gi, '').split(':');
            let isNullable = false;

            if (prop.endsWith('?')) {
                isNullable = true;
                prop = prop.substring(0, prop.length - 1);
            }

            finalProps.push({
                name: prop,
                isOptional: isNullable,
                type,
            });
        }
    }

    return finalProps;
};

export default getDomainFile;
