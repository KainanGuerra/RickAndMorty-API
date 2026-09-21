import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT to send as `Authorization: Bearer <token>`' })
  accessToken: string;
}
