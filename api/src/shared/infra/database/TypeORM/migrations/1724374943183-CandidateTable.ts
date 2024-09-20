import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CandidateTable1724374943183 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(
            new Table({
                name: 'candidate',
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
            'candidate',
            new TableForeignKey({
                columnNames: ['election_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'election',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
          const table = await queryRunner.getTable('candidate');
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf('election_id') !== -1);
        await queryRunner.dropForeignKey('candidate', foreignKey!);
        await queryRunner.dropTable('candidate');
    }

}
