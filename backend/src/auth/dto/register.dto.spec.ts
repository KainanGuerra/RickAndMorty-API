import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { RegisterDto } from './register.dto';

async function errorsFor(password: string) {
  const dto = plainToInstance(RegisterDto, {
    email: 'person@example.com',
    password,
  });
  return validate(dto);
}

describe('RegisterDto password strength', () => {
  it.each([
    ['short1!A', false], // 8 chars, meets every rule — should pass
    ['alllowercase1!', true], // no uppercase
    ['ALLUPPERCASE1!', true], // no lowercase
    ['NoDigitsHere!', true], // no digit
    ['NoSpecialChar1', true], // no special character
    ['Short1!', true], // under 8 characters
  ])('%s -> rejected: %s', async (password, shouldReject) => {
    const errors = await errorsFor(password);
    expect(errors.length > 0).toBe(shouldReject);
  });

  it('accepts a password meeting every requirement', async () => {
    const errors = await errorsFor('Correct-Horse9');
    expect(errors).toHaveLength(0);
  });
});
