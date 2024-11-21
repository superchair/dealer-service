import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1731973806166 implements MigrationInterface {
    name = 'Init1731973806166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dealer_service"."dealers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_4d0d8be9eac6e1822ad16d21194" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dealer_service"."dealers"`);
    }

}
