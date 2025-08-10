import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncDb1754831434135 implements MigrationInterface {
  name = '01SyncDb1754831434135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`offline_schedule_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` DROP FOREIGN KEY \`course_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`semester_major_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`semester_major_ibfk_2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`major_course_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`major_course_ibfk_2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`major_course_ibfk_3\``,
    );
    await queryRunner.query(`DROP INDEX \`course_id\` ON \`offline_schedule\``);
    await queryRunner.query(`DROP INDEX \`semester_id\` ON \`course\``);
    await queryRunner.query(`DROP INDEX \`major_code\` ON \`semester_major\``);
    await queryRunner.query(`DROP INDEX \`course_id\` ON \`major_course\``);
    await queryRunner.query(`DROP INDEX \`semester_id\` ON \`major_course\``);
    await queryRunner.query(
      `ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`FK_6b09e842312a37a2ea71137cd93\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`course_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` ADD CONSTRAINT \`FK_3daacf1aa8e795638c83bd2ab27\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` ADD CONSTRAINT \`FK_c63d1136ede323aa8f0fbfba9f4\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` ADD CONSTRAINT \`FK_e7f342232e99f56c835e7c2a3b1\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_6b8ebdc303d8075b36be8c18bd8\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_e4b8132cad95659606d42d9e692\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`course_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_cb3c3239008a67f44d18be86d41\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_cb3c3239008a67f44d18be86d41\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_e4b8132cad95659606d42d9e692\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_6b8ebdc303d8075b36be8c18bd8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`FK_e7f342232e99f56c835e7c2a3b1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`FK_c63d1136ede323aa8f0fbfba9f4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_3daacf1aa8e795638c83bd2ab27\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`FK_6b09e842312a37a2ea71137cd93\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`semester_id\` ON \`major_course\` (\`semester_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`course_id\` ON \`major_course\` (\`course_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`major_code\` ON \`semester_major\` (\`major_code\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`semester_id\` ON \`course\` (\`semester_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`course_id\` ON \`offline_schedule\` (\`course_id\`, \`day\`, \`start_time\`, \`end_time\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`major_course_ibfk_3\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`major_course_ibfk_2\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`course_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`major_course\` ADD CONSTRAINT \`major_course_ibfk_1\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` ADD CONSTRAINT \`semester_major_ibfk_2\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semester_major\` ADD CONSTRAINT \`semester_major_ibfk_1\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` ADD CONSTRAINT \`course_ibfk_1\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`offline_schedule_ibfk_1\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`course_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
