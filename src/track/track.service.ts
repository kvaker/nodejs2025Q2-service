import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  getAll(): Track[] {
    return this.tracks;
  }

  getById(id: string): Track {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const track = this.tracks.find((t) => t.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: uuid(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const track = this.tracks.find((t) => t.id === id);
    if (!track) throw new NotFoundException('Track not found');
    Object.assign(track, dto);
    return track;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  delete(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Track not found');
    this.tracks.splice(index, 1);
  }

  removeAlbumFromTracks(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }

  removeArtistFromTracks(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  nullifyAlbumId(albumId: string): void {
    this.tracks.forEach((t) => {
      if (t.albumId === albumId) {
        t.albumId = null;
      }
    });
  }

  nullifyArtistId(artistId: string): void {
    this.tracks.forEach((t) => {
      if (t.artistId === artistId) {
        t.artistId = null;
      }
    });
  }
}
