import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class VoteTable1724376263739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'votes',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'block_hash',
                        type: 'varchar',
                        length: '256',
                    },
                    {
                        name: 'election_id',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKeys('votes', [
            new TableForeignKey({
                columnNames: ['election_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'elections',
                onDelete: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('votes');
        const foreignKeys = table!.foreignKeys.filter(fk => ['election_id'].includes(fk.columnNames[0]));
        await queryRunner.dropForeignKeys('votes', foreignKeys);
        await queryRunner.dropTable('votes');
    }
}
