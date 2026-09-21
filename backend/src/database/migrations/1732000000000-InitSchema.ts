import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1732000000000 implements MigrationInterface {
  name = 'InitSchema1732000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "episode_cache" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "episodeNumber" integer NOT NULL,
        "characters" jsonb NOT NULL,
        "fetchedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_episode_cache_episodeNumber" UNIQUE ("episodeNumber"),
        CONSTRAINT "PK_episode_cache_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "episode_cache"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
