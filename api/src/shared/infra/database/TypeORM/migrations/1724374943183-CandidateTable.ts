import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CandidateTable1724374943183 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(
            new Table({
                name: 'candidates',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'party',
                        type: 'varchar',
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
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'candidates',
            new TableForeignKey({
                columnNames: ['election_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'elections',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
          const table = await queryRunner.getTable('candidates');
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('election_id') !== -1);
        await queryRunner.dropForeignKey('candidates', foreignKey!);
        await queryRunner.dropTable('candidates');
    }

}
