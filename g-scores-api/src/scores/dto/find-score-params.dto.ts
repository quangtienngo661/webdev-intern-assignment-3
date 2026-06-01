import { IsString, Matches } from 'class-validator';

export class FindScoreParamsDto {
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'Registration number must contain exactly 8 digits',
  })
  sbd!: string;
}
