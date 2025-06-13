import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';
import { Album } from './album.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
