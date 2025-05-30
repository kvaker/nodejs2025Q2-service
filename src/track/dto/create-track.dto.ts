import { IsString, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @IsUUID()
  @IsOptional()
  albumId?: string | null;

  @IsInt()
  @Min(0)
  duration: number;
}
