import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let users: { findOne: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let jwtService: Pick<JwtService, 'signAsync'>;

  beforeEach(() => {
    users = {
      findOne: vi.fn(),
      save: vi.fn(),
      create: vi.fn((entity) => entity as User),
    };
    jwtService = {
      signAsync: vi.fn().mockResolvedValue('signed-token'),
    };
    service = new AuthService(
      users as unknown as Repository<User>,
      jwtService as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('hashes the password and persists a new user', async () => {
      (users.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (users.save as ReturnType<typeof vi.fn>).mockImplementation(
        async (user: Partial<User>) => ({ id: 'user-1', ...user }) as User,
      );

      const result = await service.register('person@example.com', 'password123');

      expect(result).toEqual({ id: 'user-1', email: 'person@example.com' });
      const savedArg = (users.save as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(savedArg.passwordHash).not.toBe('password123');
      expect(await bcrypt.compare('password123', savedArg.passwordHash)).toBe(true);
    });

    it('rejects duplicate emails', async () => {
      (users.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'existing',
      } as User);

      await expect(
        service.register('person@example.com', 'password123'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('returns a signed access token for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      (users.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'person@example.com',
        passwordHash,
      } as User);

      const result = await service.login('person@example.com', 'password123');

      expect(result).toEqual({ accessToken: 'signed-token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'person@example.com',
      });
    });

    it('rejects an unknown email', async () => {
      (users.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(
        service.login('nobody@example.com', 'password123'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      (users.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'user-1',
        email: 'person@example.com',
        passwordHash,
      } as User);

      await expect(
        service.login('person@example.com', 'wrong-password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
