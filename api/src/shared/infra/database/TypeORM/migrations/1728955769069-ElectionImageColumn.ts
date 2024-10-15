import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ElectionImageColumn1728955769069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('election', new TableColumn({
            name: 'image',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('election', 'image');
    }

}
