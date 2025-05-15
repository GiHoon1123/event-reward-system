import { Injectable } from '@nestjs/common';
import { proxyRoutes } from 'config/proxy.config';
import { NextFunction, Request, Response } from 'express';

import {
  createProxyMiddleware,
  Options as HttpProxyOptions,
} from 'http-proxy-middleware';

@Injectable()
export class GatewayService {
  async forward(req: Request, res: Response, next?: NextFunction) {
    // 1. 매칭되는 프록시 경로 찾기
    const matchedRoute = Object.keys(proxyRoutes).find((prefix) =>
      req.path.startsWith(prefix),
    );

    if (!matchedRoute) {
      res.status(502).send('Bad Gateway: No matching proxy route.');
      return;
    }

    const options: HttpProxyOptions & {
      onProxyReq?: (proxyReq: any, req: Request, res: Response) => void;
    } = {
      ...proxyRoutes[matchedRoute],

      // 2. 요청 시작 시 사용자 정보 헤더로 전달
      onProxyReq: (proxyReq, req) => {
        const user = (req as any).user; // JwtStrategy.validate()에서 넣은 값

        if (user) {
          proxyReq.setHeader('x-user-email', user.email);
          proxyReq.setHeader('x-user-role', user.role);
          console.log(`[Gateway] 헤더 삽입: ${user.email} / ${user.role}`);
        }

        // 3. body가 있을 경우 수동 전달
        if (
          req.body &&
          Object.keys(req.body).length > 0 &&
          req.headers['content-type']?.includes('application/json')
        ) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    };

    // 5. 실제 프록시 실행
    const proxy = createProxyMiddleware(options);
    proxy(req, res, next);
  }
}
