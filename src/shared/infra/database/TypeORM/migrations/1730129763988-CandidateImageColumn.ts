import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CandidateImageColumn1730129763988 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('candidate', new TableColumn({
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
