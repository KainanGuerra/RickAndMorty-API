import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface CachedCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

@Entity('episode_cache')
export class EpisodeCache {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  episodeNumber!: number;

  @Column({ type: 'jsonb' })
  characters!: CachedCharacter[];

  @UpdateDateColumn()
  fetchedAt!: Date;
}
