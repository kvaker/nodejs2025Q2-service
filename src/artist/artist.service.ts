import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  getAll(): Artist[] {
    return this.artists;
  }

  getById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  create(dto: CreateArtistDto): Artist {
    const newArtist: Artist = { id: uuidv4(), ...dto };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, dto: UpdateArtistDto): Artist | undefined {
    const artist = this.getById(id);
    if (!artist) return undefined;
    Object.assign(artist, dto);
    return artist;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  delete(id: string): boolean {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.artists.splice(index, 1);

    this.albumService.removeArtistFromAlbums(id);
    this.trackService.removeArtistFromTracks(id);

    return true;
  }
}
