import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/common/exception/global/http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockHost: ArgumentsHost;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockSwitchToHttp = jest.fn().mockReturnValue({
      getResponse: () => mockResponse,
    });

    mockHost = {
      switchToHttp: mockSwitchToHttp,
    } as unknown as ArgumentsHost;
  });

  it('문자열 메시지를 포함한 예외를 처리할 수 있어야 한다', () => {
    const exception = new HttpException('에러 발생', 400);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: '에러 발생',
    });
  });

  it('객체 형태의 메시지를 포함한 예외를 처리할 수 있어야 한다', () => {
    const exception = new HttpException(
      { message: '잘못된 요청입니다.', error: 'Bad Request' },
      400,
    );

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: '잘못된 요청입니다.',
    });
  });
});
