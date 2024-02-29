import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}

export class UpdateStatusTodoDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
