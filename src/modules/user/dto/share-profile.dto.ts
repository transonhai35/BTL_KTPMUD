import { Trim } from "@/decorators";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { ShareTypeEnum } from '../../../common/enums/share-type.enum';

export class ShareMailReponseDto {
@ApiProperty({
    example: 'user@example.com',
    description: 'User email for share',
  })
  @IsNotEmpty()
  @Trim()
  @IsEmail()
  viewerEmail: string;

  @ApiProperty({
    example: 'Tony123421',
    description: 'uuid string',
  })
  @IsString()
  viewerId: string;

  @ApiPropertyOptional({
    example: 'avatar url',
    description: 'avatar URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    example: 'Tony Stark',
    description: 'User name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class ShareProfileRequestDto {
  @ApiProperty({ enum: ShareTypeEnum })
  @IsEnum(ShareTypeEnum)
  type: ShareTypeEnum;
  
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email for share',
  })

  @ValidateIf((o) => o.type === ShareTypeEnum.EMAIL)
  @IsNotEmpty({ message: 'Email is required for share type EMAIL' })
  @IsEmail()
  email?: string;

  @ValidateIf((o) => o.type === ShareTypeEnum.CODE)
  @IsNotEmpty({ message: 'Code is required for share type CODE' })
  @IsString()
  code?: string;
}
    