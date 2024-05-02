import { IsString } from 'class-validator';

export class ConfirmAuthDto {
  @IsString()
  token: string;
}
