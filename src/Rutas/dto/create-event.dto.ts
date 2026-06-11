import { IsString, IsOptional, IsNumber, IsDateString, Min, IsBoolean } from 'class-validator'

export class CreateEventDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsDateString()
  initDate!: string

  @IsOptional()
  @IsDateString()
  endingDate?: string

  @IsString()
  location!: string

  @IsNumber()
  categoryFK!: number

  @IsNumber()
  @Min(0)
  ticketPrice!: number

  @IsOptional()
  @IsBoolean()
  open?: boolean
}
