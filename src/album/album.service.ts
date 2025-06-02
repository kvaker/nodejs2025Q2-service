import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(dto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...dto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album | undefined {
    const album = this.findOne(id);
    if (!album) return undefined;
    Object.assign(album, dto);
    return album;
  }

  delete(id: string): boolean {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.albums.splice(index, 1);

    this.trackService.removeAlbumFromTracks(id);

    return true;
  }

  removeArtistFromAlbums(artistId: string): void {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }

  nullifyArtist(artistId: string) {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  clearAll() {
    this.albums = [];
  }
}
