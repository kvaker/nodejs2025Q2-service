import { Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

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

  delete(id: string): boolean {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.artists.splice(index, 1);
    // TODO: update related albums/tracks/favorites
    return true;
  }
}
