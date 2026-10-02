import {
 IsOptional,
 IsString,
 IsUrl,
 MaxLength,
} from 'class-validator';

export class CreateProfileDto {
 @IsOptional()
 @IsString()
 phone?: string;

 @IsOptional()
 @IsString()
 city?: string;

 @IsOptional()
 @IsString()
 country?: string;

 @IsOptional()
 @IsString()
 @MaxLength(500)
 bio?: string;

 @IsOptional()
 @IsUrl()
 avatarUrl?: string;
}