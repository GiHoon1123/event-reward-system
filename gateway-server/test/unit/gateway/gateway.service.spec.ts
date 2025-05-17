import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as proxyConfig from 'src/config/proxy.config';
import { GatewayService } from 'src/gateway/gateway.service';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => jest.fn()),
}));

describe('GatewayService', () => {
  let gatewayService: GatewayService;

  beforeEach(() => {
    gatewayService = new GatewayService();
  });

  it('매칭되는 경로가 없으면 502 에러를 반환해야 한다', async () => {
    jest.spyOn(proxyConfig, 'getProxyRoutes').mockReturnValue({});

    const req = { path: '/unknown' } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await gatewayService.forward(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.send).toHaveBeenCalledWith(
      'Bad Gateway: No matching proxy route.',
    );
  });

  it('매칭되는 경로가 있을 때 createProxyMiddleware가 호출돼야 한다', async () => {
    const proxyMock = jest.fn(); // 실제로 프록시 미들웨어를 흉내냄
    (createProxyMiddleware as jest.Mock).mockReturnValue(proxyMock);

    jest.spyOn(proxyConfig, 'getProxyRoutes').mockReturnValue({
      '/auth': { target: 'http://localhost:3000', changeOrigin: true },
    });

    const req = {
      path: '/auth/login',
      body: { email: 'test@example.com' },
      headers: { 'content-type': 'application/json' },
      user: { email: 'test@example.com', role: 'USER' },
    } as any;

    const res = {};
    const next = jest.fn();

    await gatewayService.forward(req, res as Response, next);

    expect(createProxyMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({
        target: 'http://localhost:3000',
        changeOrigin: true,
        onProxyReq: expect.any(Function),
      }),
    );

    expect(proxyMock).toHaveBeenCalledWith(req, res, next);
  });
});
