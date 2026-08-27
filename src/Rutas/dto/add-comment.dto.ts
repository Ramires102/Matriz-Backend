import { IsString, IsNotEmpty } from 'class-validator'

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  type!: string

  @IsString()
  @IsNotEmpty()
  content!: string
}
