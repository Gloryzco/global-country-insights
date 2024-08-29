import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityWithIndexedColumns1723136014377 implements MigrationInterface {
    name = 'EntityWithIndexedColumns1723136014377'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TABLE \`countries\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`commonName\` varchar(255) NULL,
                \`officialName\` varchar(255) NULL,
                \`nativeName\` json NULL,
                \`cca2\` varchar(2) NULL,
                \`cca3\` varchar(3) NULL,
                \`population\` int NULL,
                \`region\` varchar(255) NULL,
                \`subregion\` varchar(255) NULL,
                \`languages\` json NULL,
                \`currencies\` json NULL,
                \`capital\` text NULL,
                \`latlng\` text NULL,
                \`landlocked\` tinyint NULL,
                \`borderingCountries\` text NULL,
                \`area\` float NULL,
                \`flags\` json NULL,
                \`coatOfArms\` json NULL,
                INDEX \`IDX_cf8aee9baccc74d5fc24d74d2e\` (\`commonName\`),
                INDEX \`IDX_b0047a1f31c3aa718b4461ccce\` (\`cca3\`),
                INDEX \`IDX_17a61596c7b08193a060e21db7\` (\`population\`),
                INDEX \`IDX_a06b22cddc5603e130c194658a\` (\`region\`),
                INDEX \`IDX_4afabe7b4246d1e9b98d421f50\` (\`languages\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_4afabe7b4246d1e9b98d421f50\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_a06b22cddc5603e130c194658a\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_17a61596c7b08193a060e21db7\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b0047a1f31c3aa718b4461ccce\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_cf8aee9baccc74d5fc24d74d2e\` ON \`countries\`
        `);
        await queryRunner.query(`
            DROP TABLE \`countries\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
