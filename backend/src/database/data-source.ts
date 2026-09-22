import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { EpisodeCache } from '../episodes/entities/episode-cache.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'rickandmorty',
  password: process.env.DATABASE_PASSWORD ?? 'rickandmorty',
  database: process.env.DATABASE_NAME ?? 'rickandmorty',
  entities: [User, EpisodeCache],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
