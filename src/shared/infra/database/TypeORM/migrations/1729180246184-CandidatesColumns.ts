import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CandidatesColumns1729180246184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('candidate',[
            new TableColumn({
                name: 'description',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'quantity',
                type: 'int',
                default: 0,
            }),
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('candidate', 'description');
        await queryRunner.dropColumn('candidate', 'quantity');
    }

}
