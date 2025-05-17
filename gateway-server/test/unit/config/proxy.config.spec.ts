import { getProxyRoutes } from 'src/config/proxy.config';

describe('getProxyRoutes', () => {
  beforeAll(() => {
    process.env.AUTH_SERVER = 'http://auth.example.com';
    process.env.EVENT_SERVER = 'http://event.example.com';
  });

  it('올바른 경로 매핑 객체를 반환해야 한다', () => {
    const result = getProxyRoutes();

    expect(result).toEqual({
      '/auth': {
        target: 'http://auth.example.com',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://event.example.com',
        changeOrigin: true,
      },
      '/events': {
        target: 'http://event.example.com',
        changeOrigin: true,
      },
    });
  });
});
