import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CandidateDeletedAtColumn1728705520591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('candidate',
            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('candidate', 'deleted_at');
    }

}
