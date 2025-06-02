import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  year?: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
