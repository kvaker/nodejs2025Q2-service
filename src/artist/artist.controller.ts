import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = this.artistService.getById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: UpdateArtistDto,
  ) {
    const updated = this.artistService.update(id, dto);
    if (!updated) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const success = this.artistService.delete(id);
    if (!success) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }
}
