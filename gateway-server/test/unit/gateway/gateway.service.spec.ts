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
    const proxyMock = jest.fn();
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

  it('onProxyReq가 user 헤더를 설정하고 body를 전달해야 한다', () => {
    const onProxyReqFn = (createProxyMiddleware as jest.Mock).mock.calls[0][0]
      .onProxyReq;

    const req = {
      user: { email: 'user@example.com', role: 'ADMIN' },
      body: { key: 'value' },
      headers: { 'content-type': 'application/json' },
    } as any;

    const proxyReq = {
      setHeader: jest.fn(),
      write: jest.fn(),
    };

    onProxyReqFn(proxyReq, req);

    expect(proxyReq.setHeader).toHaveBeenCalledWith(
      'x-user-email',
      'user@example.com',
    );
    expect(proxyReq.setHeader).toHaveBeenCalledWith('x-user-role', 'ADMIN');
    expect(proxyReq.setHeader).toHaveBeenCalledWith(
      'Content-Length',
      Buffer.byteLength(JSON.stringify(req.body)),
    );
    expect(proxyReq.write).toHaveBeenCalledWith(JSON.stringify(req.body));
  });

  it('onProxyReq는 body가 없으면 write를 호출하지 않아야 한다', () => {
    const onProxyReqFn = (createProxyMiddleware as jest.Mock).mock.calls[0][0]
      .onProxyReq;

    const req = {
      user: { email: 'user@example.com', role: 'ADMIN' },
      body: undefined,
      headers: { 'content-type': 'application/json' },
    } as any;

    const proxyReq = {
      setHeader: jest.fn(),
      write: jest.fn(),
    };

    onProxyReqFn(proxyReq, req);

    expect(proxyReq.setHeader).toHaveBeenCalledWith(
      'x-user-email',
      'user@example.com',
    );
    expect(proxyReq.setHeader).toHaveBeenCalledWith('x-user-role', 'ADMIN');
    expect(proxyReq.write).not.toHaveBeenCalled();
  });

  it('onProxyReq는 content-type이 application/json이 아니면 write를 호출하지 않아야 한다', () => {
    const onProxyReqFn = (createProxyMiddleware as jest.Mock).mock.calls[0][0]
      .onProxyReq;

    const req = {
      user: { email: 'user@example.com', role: 'ADMIN' },
      body: { key: 'value' },
      headers: { 'content-type': 'text/plain' },
    } as any;

    const proxyReq = {
      setHeader: jest.fn(),
      write: jest.fn(),
    };

    onProxyReqFn(proxyReq, req);

    expect(proxyReq.setHeader).toHaveBeenCalledWith(
      'x-user-email',
      'user@example.com',
    );
    expect(proxyReq.setHeader).toHaveBeenCalledWith('x-user-role', 'ADMIN');
    expect(proxyReq.write).not.toHaveBeenCalled();
  });
});
