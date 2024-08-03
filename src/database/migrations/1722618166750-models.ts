import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1722618166750 implements MigrationInterface {
    name = 'Models1722618166750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`countries\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`cca3\` varchar(3) NOT NULL,
                \`nameCommon\` varchar(255) NOT NULL,
                \`nameOfficial\` varchar(255) NOT NULL,
                \`nativeName\` json NOT NULL,
                \`tld\` text NOT NULL,
                \`cca2\` varchar(2) NOT NULL,
                \`ccn3\` varchar(3) NOT NULL,
                \`independent\` tinyint NOT NULL,
                \`status\` varchar(255) NOT NULL,
                \`unMember\` tinyint NOT NULL,
                \`currencies\` json NOT NULL,
                \`idd\` json NOT NULL,
                \`capital\` text NOT NULL,
                \`altSpellings\` text NOT NULL,
                \`region\` varchar(255) NOT NULL,
                \`languages\` json NOT NULL,
                \`translations\` json NOT NULL,
                \`latlng\` point NOT NULL,
                \`landlocked\` tinyint NOT NULL,
                \`area\` float NOT NULL,
                \`demonyms\` json NOT NULL,
                \`flag\` varchar(255) NOT NULL,
                \`maps\` json NOT NULL,
                \`population\` int NOT NULL,
                \`car\` json NOT NULL,
                \`timezones\` text NOT NULL,
                \`continents\` text NOT NULL,
                \`flags\` json NOT NULL,
                \`coatOfArms\` json NULL,
                \`startOfWeek\` varchar(255) NOT NULL,
                \`capitalInfo\` json NOT NULL,
                UNIQUE INDEX \`IDX_b0047a1f31c3aa718b4461ccce\` (\`cca3\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`statistics\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`totalCountries\` int NOT NULL,
                \`mostWidelySpokenLanguage\` varchar(255) NOT NULL,
                \`largestCountryByAreaId\` int NULL,
                \`smallestCountryByPopulationId\` int NULL,
                UNIQUE INDEX \`REL_8e1fd8ff2b30f49c5e03ea27de\` (\`largestCountryByAreaId\`),
                UNIQUE INDEX \`REL_57ff185a4e42ea1965e1b07a47\` (\`smallestCountryByPopulationId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`refreshToken\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`regions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`totalPopulation\` int NOT NULL,
                UNIQUE INDEX \`IDX_1eb9a8899a7db89f6ba473fd84\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`languages\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`totalSpeakers\` int NOT NULL,
                UNIQUE INDEX \`IDX_9c0e155475f0aa782e4a617896\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`languages_countries_countries\` (
                \`languagesId\` int NOT NULL,
                \`countriesId\` int NOT NULL,
                INDEX \`IDX_cf6160b54eedadd48ed029136a\` (\`languagesId\`),
                INDEX \`IDX_b0655669d8d6d74f6b2819c635\` (\`countriesId\`),
                PRIMARY KEY (\`languagesId\`, \`countriesId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`statistics\`
            ADD CONSTRAINT \`FK_8e1fd8ff2b30f49c5e03ea27de8\` FOREIGN KEY (\`largestCountryByAreaId\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`statistics\`
            ADD CONSTRAINT \`FK_57ff185a4e42ea1965e1b07a472\` FOREIGN KEY (\`smallestCountryByPopulationId\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`languages_countries_countries\`
            ADD CONSTRAINT \`FK_cf6160b54eedadd48ed029136a2\` FOREIGN KEY (\`languagesId\`) REFERENCES \`languages\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`languages_countries_countries\`
            ADD CONSTRAINT \`FK_b0655669d8d6d74f6b2819c635f\` FOREIGN KEY (\`countriesId\`) REFERENCES \`countries\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`languages_countries_countries\` DROP FOREIGN KEY \`FK_b0655669d8d6d74f6b2819c635f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`languages_countries_countries\` DROP FOREIGN KEY \`FK_cf6160b54eedadd48ed029136a2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`statistics\` DROP FOREIGN KEY \`FK_57ff185a4e42ea1965e1b07a472\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`statistics\` DROP FOREIGN KEY \`FK_8e1fd8ff2b30f49c5e03ea27de8\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b0655669d8d6d74f6b2819c635\` ON \`languages_countries_countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_cf6160b54eedadd48ed029136a\` ON \`languages_countries_countries\`
        `);
        await queryRunner.query(`
            DROP TABLE \`languages_countries_countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9c0e155475f0aa782e4a617896\` ON \`languages\`
        `);
        await queryRunner.query(`
            DROP TABLE \`languages\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_1eb9a8899a7db89f6ba473fd84\` ON \`regions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`regions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_57ff185a4e42ea1965e1b07a47\` ON \`statistics\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_8e1fd8ff2b30f49c5e03ea27de\` ON \`statistics\`
        `);
        await queryRunner.query(`
            DROP TABLE \`statistics\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b0047a1f31c3aa718b4461ccce\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP TABLE \`countries\`
        `);
    }

}
