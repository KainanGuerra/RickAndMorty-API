import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryCharactersDto } from './dto/query-characters.dto';
import { EpisodesService } from './episodes.service';

@Controller({ path: 'episodes', version: '1' })
@UseGuards(JwtAuthGuard)
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get(':number/characters')
  getCharacters(
    @Param('number', ParseIntPipe) number: number,
    @Query() query: QueryCharactersDto,
  ) {
    return this.episodesService.getCharacters(number, query);
  }
}
