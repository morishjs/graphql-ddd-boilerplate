import { MigrationInterface, QueryRunner, Table } from 'typeorm-plus';

export class CreateUserTable1578541144455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          length: '100',
          isPrimary: false,
          isNullable: false,
        },
        {
          name: 'phone',
          type: 'varchar',
          length: '100',
          isPrimary: false,
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'email',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'allowMarketing',
          type: 'bool',
          isPrimary: false,
          isNullable: true,
          default: false,
        },
        {
          name: 'password',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        },
        {
          name: 'profileDetail',
          type: 'jsonb',
          isPrimary: false,
          isNullable: true,
        },
        {
          name: 'createdAt',
          type: 'timestamp with time zone',
          isPrimary: false,
          isNullable: true,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updatedAt',
          type: 'timestamp with time zone',
          isPrimary: false,
          isNullable: true,
          onUpdate: 'CURRENT_TIMESTAMP',
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    });
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users');
  }
}
