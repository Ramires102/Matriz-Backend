import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean, Min } from 'class-validator'

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  initDate?: string

  @IsOptional()
  @IsDateString()
  endingDate?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsBoolean()
  open?: boolean

  @IsOptional()
  @IsNumber()
  categoryFK?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  ticketPrice?: number
}
