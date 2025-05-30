import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { IsUUID } from 'class-validator';

class IdParam {
  @IsUUID()
  id: string;
}

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('track/:id')
  async addTrack(@Param() params: IdParam) {
    const track = await this.trackService.findOne(params.id);
    if (!track) throw new UnprocessableEntityException('Track does not exist');
    this.favoritesService.add('tracks', params.id);
    return { message: 'Track added to favorites' };
  }

  @Post('album/:id')
  async addAlbum(@Param() params: IdParam) {
    const album = await this.albumService.findOne(params.id);
    if (!album) throw new UnprocessableEntityException('Album does not exist');
    this.favoritesService.add('albums', params.id);
    return { message: 'Album added to favorites' };
  }

  @Post('artist/:id')
  async addArtist(@Param() params: IdParam) {
    const artist = await this.artistService.findOne(params.id);
    if (!artist)
      throw new UnprocessableEntityException('Artist does not exist');
    this.favoritesService.add('artists', params.id);
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
