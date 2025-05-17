import { CommonResponse } from 'src/common/dto/common-response.dto';

describe('CommonResponse', () => {
  it('statusCode만 있는 생성자를 잘 초기화해야 한다', () => {
    const res = new CommonResponse(200);

    expect(res.statusCode).toBe(200);
    expect(res.message).toBeUndefined();
    expect(res.data).toBeUndefined();
  });

  it('statusCode와 message를 잘 초기화해야 한다', () => {
    const res = new CommonResponse(201, 'Created');

    expect(res.statusCode).toBe(201);
    expect(res.message).toBe('Created');
    expect(res.data).toBeUndefined();
  });

  it('statusCode, message, data를 모두 잘 초기화해야 한다', () => {
    const result = { email: 'test@example.com' };
    const res = new CommonResponse(200, '성공', result);

    expect(res.statusCode).toBe(200);
    expect(res.message).toBe('성공');
    expect(res.data).toEqual(result);
  });
});
