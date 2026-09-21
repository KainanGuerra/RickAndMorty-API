import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength } from 'class-validator';

const STRONG_PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 8,
    pattern: STRONG_PASSWORD_PATTERN.source,
    description:
      'At least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.',
  })
  @MinLength(8)
  @Matches(STRONG_PASSWORD_PATTERN, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  password: string;
}
