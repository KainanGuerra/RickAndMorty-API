import { describe, expect, it } from 'vitest';
import { checkPassword, isPasswordStrong } from './password';

describe('checkPassword', () => {
  it('flags every unmet requirement independently', () => {
    expect(checkPassword('short')).toEqual({
      minLength: false,
      hasUppercase: false,
      hasLowercase: true,
      hasDigit: false,
      hasSpecialChar: false,
    });
  });

  it('passes every requirement for a strong password', () => {
    expect(checkPassword('Correct-Horse9')).toEqual({
      minLength: true,
      hasUppercase: true,
      hasLowercase: true,
      hasDigit: true,
      hasSpecialChar: true,
    });
  });
});

describe('isPasswordStrong', () => {
  it.each([
    ['weakpassword', false], // no uppercase, no digit, no special char
    ['ALLUPPERCASE1!', false], // no lowercase
    ['NoDigitsHere!', false], // no digit
    ['NoSpecialChar1', false], // no special character
    ['Short1!', false], // under 8 characters
    ['Correct-Horse9', true],
  ])('%s -> strong: %s', (password, expected) => {
    expect(isPasswordStrong(password)).toBe(expected);
  });
});
