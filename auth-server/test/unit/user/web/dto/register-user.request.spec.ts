import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterUserRequestDto } from 'src/user/web/dto/register-user.request';

describe('RegisterUserRequestDto 유효성 검사', () => {
  it('올바른 이메일과 비밀번호가 주어졌을 때 유효성 검사를 통과해야 한다', async () => {
    const dto = plainToInstance(RegisterUserRequestDto, {
      email: 'user@example.com',
      password: 'securePassword123!',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('이메일 형식이 잘못되었을 때 유효성 검사에 실패해야 한다', async () => {
    const dto = plainToInstance(RegisterUserRequestDto, {
      email: 'invalid-email',
      password: 'securePassword123!',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('비밀번호가 너무 짧을 경우 유효성 검사에 실패해야 한다', async () => {
    const dto = plainToInstance(RegisterUserRequestDto, {
      email: 'user@example.com',
      password: 'short',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('비밀번호가 누락된 경우 유효성 검사에 실패해야 한다', async () => {
    const dto = plainToInstance(RegisterUserRequestDto, {
      email: 'user@example.com',
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('이메일이 누락된 경우 유효성 검사에 실패해야 한다', async () => {
    const dto = plainToInstance(RegisterUserRequestDto, {
      password: 'securePassword123!',
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });
});
