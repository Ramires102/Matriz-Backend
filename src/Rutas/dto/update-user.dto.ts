import { IsString, IsOptional, IsEmail } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  user?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsString()
  dni?: string

  @IsOptional()
  @IsString()
  cuit?: string

  @IsOptional()
  @IsString()
  address?: string
}
