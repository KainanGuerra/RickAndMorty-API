import { ApiProperty } from '@nestjs/swagger';

export class CharacterDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  species: string;

  @ApiProperty()
  image: string;
}

export class PaginatedCharactersDto {
  @ApiProperty()
  episodeNumber: number;

  @ApiProperty({ description: 'Total characters after filtering, before pagination' })
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({ type: [CharacterDto] })
  data: CharacterDto[];
}
