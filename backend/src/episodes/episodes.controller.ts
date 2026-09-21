import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginatedCharactersDto } from './dto/character.dto';
import { QueryCharactersDto } from './dto/query-characters.dto';
import { EpisodesService } from './episodes.service';

@ApiTags('episodes')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'episodes', version: '1' })
@UseGuards(JwtAuthGuard)
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get(':number/characters')
  @ApiOperation({ summary: 'List the characters that appear in an episode' })
  @ApiParam({ name: 'number', type: Number, description: 'Episode number' })
  @ApiOkResponse({ type: PaginatedCharactersDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiNotFoundResponse({ description: 'Episode does not exist' })
  getCharacters(
    @Param('number', ParseIntPipe) number: number,
    @Query() query: QueryCharactersDto,
  ) {
    return this.episodesService.getCharacters(number, query);
  }
}
