import { createConnection, getConnection } from 'typeorm';
import { NodePlopAPI } from 'node-plop';
import connection from '../../src/shared/infra/database/TypeORM/connection';
import dbConnectionOptions from './dbConnectionOptions';

export interface ColumnResponse {
    name: string;
    isNullable: boolean;
    type: string;
    length: number | null;
    default: string | null;
    precision: number | null;
    scale: number | null;
}

export async function getTableInformation(tableName: string): Promise<Array<ColumnResponse>> {
    await createConnection(dbConnectionOptions);

    const informations = await getConnection().query(
        `select
            column_name,
            is_nullable,
            data_type,
            character_maximum_length,
            column_default,
            numeric_precision,
            numeric_scale
        from information_schema.columns
            where table_name = '${tableName}'
            and table_catalog = 'comanda10_dev'`,
    );

    await connection.close();

    return informations.map((information: any) => ({
        name: information.column_name,
        isNullable: information.is_nullable === 'NO' ? false : true,
        type: information.data_type,
        length: information.character_maximum_length,
        default: information.column_default,
        precision: information.numeric_precision,
        scale: information.numeric_scale,
    }));
}

export const getTableName = (rawName: string, plop: NodePlopAPI): string => {
    return plop.renderString(`{{snakeCase name}}`, {
        name: rawName,
    });
};

export const isAuditColumn = (column: ColumnResponse) => {
    return ['created_at', 'updated_at', 'deleted_at'].includes(column.name);
};

export const getColumnTSType = (column: ColumnResponse): string => {
    if (column.type.match(/(uuid)|(character)/g)) {
        return 'string';
    }

    if (column.type.match(/(boolean)/g)) {
        return 'boolean';
    }

    if (column.type.match(/(timestamp)|(time)/g)) {
        return 'Date';
    }

    if (column.type.match(/(numeric)|(integer)/g)) {
        return 'number';
    }

    if (column.type.match(/(json)/g)) {
        return 'Record<string, any>';
    }

    throw new Error(`Unable to find column type for column: ${column.name} (${column.type})`);
};

export const getColumnDecorator = (column: ColumnResponse): string => {
    if (column.type.match(/(uuid)/g)) {
        if (column.name === 'id') {
            return `PrimaryColumn`;
        }
    }

    if (column.type.match(/(timestamp)/g)) {
        if (column.name === 'created_at') {
            return `CreateDateColumn`;
        }
        if (column.name === 'updated_at') {
            return `UpdateDateColumn`;
        }
        if (column.name === 'deleted_at') {
            return `DeleteDateColumn`;
        }
    }

    return `Column`;
};

const getCommonDecoratorInfo = (column: ColumnResponse): string => {
    const common: string[] = [];

    if (isAuditColumn(column)) {
        return '';
    }

    if (column.default) {
        let defaultValue: string | boolean | number = column.default;

        if (column.type === 'boolean') {
            defaultValue = column.default === 'false' ? false : true;
        } else if (column.type.match(/(numeric)|(integer)/)) {
            defaultValue = Number(column.default);
        } else {
            defaultValue = `'${column.default}'`;
        }

        common.push(`default: ${defaultValue}`);
    }

    if (column.length) {
        common.push(`length: ${column.length}`);
    }

    // integer has a precision by default in postgres and we don't want that
    if (column.precision && !column.type.match(/integer/g)) {
        common.push(`precision: ${column.precision}`);
    }

    if (column.scale) {
        common.push(`scale: ${column.scale}`);
    }

    if (column.isNullable) {
        common.push('nullable: true');
    }

    return common.length ? `{ ${common.join(', ')} }` : '';
};

const getDecoratorType = (column: ColumnResponse) => {
    if (isAuditColumn(column)) {
        return '';
    }

    if (column.type.match(/(uuid)/g)) {
        return 'uuid';
    }

    if (column.type.match(/(numeric)/g)) {
        return 'decimal';
    }

    if (column.type.match(/(integer)/g)) {
        return 'int';
    }

    if (column.type.match(/(json)/g)) {
        return 'json';
    }

    return '';
};

export const getColumnDecoratorInfo = (column: ColumnResponse): string => {
    const type = getDecoratorType(column);
    const info = getCommonDecoratorInfo(column);

    if (type && info) {
        return `'${type}', ${info}`;
    }

    if (type) {
        return `'${type}'`;
    }

    if (info) {
        return info;
    }

    return '';
};

export const getFullDomainProp = (column: ColumnResponse, plop: NodePlopAPI): string | undefined => {
    const propTemplate = `\t{{camelCase column}}{{optional}}: {{type}};\n`;

    if (column.name === 'id') {
        return;
    }

    let type = getColumnTSType(column);

    if (column.name.match(/(id)/g)) {
        type = 'UniqueEntityID';
    }

    return plop.renderString(propTemplate, {
        column: column.name,
        optional: column.isNullable || isAuditColumn(column) || column.name === 'enabled' ? '?' : '',
        type,
    });
};
