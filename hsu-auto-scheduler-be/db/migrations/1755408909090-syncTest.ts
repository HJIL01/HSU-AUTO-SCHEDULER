import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncTest1755408909090 implements MigrationInterface {
    name = 'SyncTest1755408909090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`class_section\` DROP FOREIGN KEY \`class_section_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`offline_schedule_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`offline_schedule_ibfk_2\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`course_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`semester_major_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`semester_major_ibfk_2\``);
        await queryRunner.query(`ALTER TABLE \`major_course\` DROP FOREIGN KEY \`major_course_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`major_course\` DROP FOREIGN KEY \`major_course_ibfk_2\``);
        await queryRunner.query(`DROP INDEX \`semester_id\` ON \`class_section\``);
        await queryRunner.query(`DROP INDEX \`class_section_id\` ON \`offline_schedule\``);
        await queryRunner.query(`DROP INDEX \`semester_id\` ON \`offline_schedule\``);
        await queryRunner.query(`DROP INDEX \`major_code\` ON \`semester_major\``);
        await queryRunner.query(`DROP INDEX \`semester_id\` ON \`major_course\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b7259817f6d70ed9c70ab85230\` ON \`class_section\` (\`semester_id\`, \`course_code\`, \`class_section\`, \`professor_names\`)`);
        await queryRunner.query(`ALTER TABLE \`class_section\` ADD CONSTRAINT \`FK_c1c1ae92542a7827af4de2a5dd6\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`FK_50af7acc518a047c154cf4c0a95\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`FK_aa6daa835e80f7bd1e4ba880936\` FOREIGN KEY (\`class_section_id\`) REFERENCES \`class_section\`(\`class_section_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_3daacf1aa8e795638c83bd2ab27\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`semester_major\` ADD CONSTRAINT \`FK_c63d1136ede323aa8f0fbfba9f4\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`semester_major\` ADD CONSTRAINT \`FK_e7f342232e99f56c835e7c2a3b1\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_cb3c3239008a67f44d18be86d41\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_6b8ebdc303d8075b36be8c18bd8\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`major_course\` ADD CONSTRAINT \`FK_5cddcf491c6d4f590bb978cddc3\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_5cddcf491c6d4f590bb978cddc3\``);
        await queryRunner.query(`ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_6b8ebdc303d8075b36be8c18bd8\``);
        await queryRunner.query(`ALTER TABLE \`major_course\` DROP FOREIGN KEY \`FK_cb3c3239008a67f44d18be86d41\``);
        await queryRunner.query(`ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`FK_e7f342232e99f56c835e7c2a3b1\``);
        await queryRunner.query(`ALTER TABLE \`semester_major\` DROP FOREIGN KEY \`FK_c63d1136ede323aa8f0fbfba9f4\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_3daacf1aa8e795638c83bd2ab27\``);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`FK_aa6daa835e80f7bd1e4ba880936\``);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` DROP FOREIGN KEY \`FK_50af7acc518a047c154cf4c0a95\``);
        await queryRunner.query(`ALTER TABLE \`class_section\` DROP FOREIGN KEY \`FK_c1c1ae92542a7827af4de2a5dd6\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7259817f6d70ed9c70ab85230\` ON \`class_section\``);
        await queryRunner.query(`CREATE INDEX \`semester_id\` ON \`major_course\` (\`semester_id\`, \`course_code\`)`);
        await queryRunner.query(`CREATE INDEX \`major_code\` ON \`semester_major\` (\`major_code\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`semester_id\` ON \`offline_schedule\` (\`semester_id\`, \`course_code\`, \`class_section_id\`, \`day\`, \`start_time\`, \`end_time\`)`);
        await queryRunner.query(`CREATE INDEX \`class_section_id\` ON \`offline_schedule\` (\`class_section_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`semester_id\` ON \`class_section\` (\`semester_id\`, \`course_code\`, \`class_section\`, \`professor_names\`)`);
        await queryRunner.query(`ALTER TABLE \`major_course\` ADD CONSTRAINT \`major_course_ibfk_2\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`major_course\` ADD CONSTRAINT \`major_course_ibfk_1\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`semester_major\` ADD CONSTRAINT \`semester_major_ibfk_2\` FOREIGN KEY (\`major_code\`) REFERENCES \`major\`(\`major_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`semester_major\` ADD CONSTRAINT \`semester_major_ibfk_1\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`course_ibfk_1\` FOREIGN KEY (\`semester_id\`) REFERENCES \`semester\`(\`semester_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`offline_schedule_ibfk_2\` FOREIGN KEY (\`class_section_id\`) REFERENCES \`class_section\`(\`class_section_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offline_schedule\` ADD CONSTRAINT \`offline_schedule_ibfk_1\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_section\` ADD CONSTRAINT \`class_section_ibfk_1\` FOREIGN KEY (\`semester_id\`, \`course_code\`) REFERENCES \`course\`(\`semester_id\`,\`course_code\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
