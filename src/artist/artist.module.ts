import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { Artist } from './artist.entity';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
