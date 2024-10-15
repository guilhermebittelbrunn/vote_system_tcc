import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class VoteStatusColumn1726805056852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('vote', new TableColumn({
            name: 'status',
            type: 'varchar',
            length: '20',
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('vote', 'status');
    }

}
