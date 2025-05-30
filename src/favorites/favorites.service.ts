import {
  Injectable,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  private favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  getAll() {
    return this.favorites;
  }

  async add(entity: 'artists' | 'albums' | 'tracks', id: string) {
    const exists = await this.validateEntityExists(entity, id);

    if (!exists) {
      throw new UnprocessableEntityException(
        `${entity.slice(0, -1)} with id ${id} does not exist`,
      );
    }

    if (!this.favorites[entity].includes(id)) {
      this.favorites[entity].push(id);
    }
  }

  remove(entity: 'artists' | 'albums' | 'tracks', id: string) {
    this.favorites[entity] = this.favorites[entity].filter(
      (itemId) => itemId !== id,
    );
  }

  removeArtistFromFavorites(id: string) {
    this.remove('artists', id);
  }

  removeAlbumFromFavorites(id: string) {
    this.remove('albums', id);
  }

  removeTrackFromFavorites(id: string) {
    this.remove('tracks', id);
  }

  isFavorite(entity: 'artists' | 'albums' | 'tracks', id: string): boolean {
    return this.favorites[entity].includes(id);
  }

  private async validateEntityExists(
    entity: 'artists' | 'albums' | 'tracks',
    id: string,
  ): Promise<boolean> {
    try {
      switch (entity) {
        case 'artists':
          await this.artistService.findOne(id);
          break;
        case 'albums':
          await this.albumService.findOne(id);
          break;
        case 'tracks':
          await this.trackService.findOne(id);
          break;
      }
      return true;
    } catch {
      return false;
    }
  }
}
