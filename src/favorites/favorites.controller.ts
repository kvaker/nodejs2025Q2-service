import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { IsUUID } from 'class-validator';

class IdParam {
  @IsUUID()
  id: string;
}

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('track/:id')
  async addTrack(@Param() params: IdParam) {
    await this.favoritesService.add('tracks', params.id);
    return { message: 'Track added to favorites' };
  }

  @Post('album/:id')
  async addAlbum(@Param() params: IdParam) {
    await this.favoritesService.add('albums', params.id);
    return { message: 'Album added to favorites' };
  }

  @Post('artist/:id')
  async addArtist(@Param() params: IdParam) {
    await this.favoritesService.add('artists', params.id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param() params: IdParam) {
    this.favoritesService.remove('tracks', params.id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param() params: IdParam) {
    this.favoritesService.remove('albums', params.id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param() params: IdParam) {
    this.favoritesService.remove('artists', params.id);
  }
}
