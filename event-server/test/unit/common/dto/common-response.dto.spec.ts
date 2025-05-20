import { CommonResponse } from 'src/common/dto/common-response.dto';

describe('CommonResponse', () => {
  it('statusCode만 전달했을 때, 나머지 필드는 undefined로 설정된다', () => {
    const res = new CommonResponse(200);

    expect(res.statusCode).toBe(200);
    expect(res.message).toBeUndefined();
    expect(res.data).toBeUndefined();
  });

  it('statusCode와 message를 전달하면 message만 설정되고 data는 undefined다', () => {
    const res = new CommonResponse(201, '생성 완료');

    expect(res.statusCode).toBe(201);
    expect(res.message).toBe('생성 완료');
    expect(res.data).toBeUndefined();
  });

  it('statusCode, message, data를 모두 전달하면 모두 정상 설정된다', () => {
    const data = { id: 1, name: '테스트' };
    const res = new CommonResponse(200, '요청 성공', data);

    expect(res.statusCode).toBe(200);
    expect(res.message).toBe('요청 성공');
    expect(res.data).toEqual(data);
  });

  it('data가 undefined로 전달되어도 오류 없이 처리된다', () => {
    const res = new CommonResponse(200, '성공', undefined);

    expect(res.statusCode).toBe(200);
    expect(res.message).toBe('성공');
    expect(res.data).toBeUndefined();
  });
});
