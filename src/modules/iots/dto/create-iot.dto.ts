import { IsString, IsNotEmpty } from 'class-validator';

export class IotData {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;
}

export class CreateIotDto {
  data: IotData[];
}
