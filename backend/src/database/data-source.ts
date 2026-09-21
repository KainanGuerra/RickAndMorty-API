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
  username: process.env.DATABASE_USER ?? 'zrp',
  password: process.env.DATABASE_PASSWORD ?? 'zrp',
  database: process.env.DATABASE_NAME ?? 'zrp',
  entities: [User, EpisodeCache],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
