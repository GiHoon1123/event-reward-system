// src/gateway/gateway.service.ts
import { Injectable } from '@nestjs/common';
import { proxyRoutes } from 'config/proxy.config';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

@Injectable()
export class GatewayService {
  async forward(req: Request, res: Response, next?: NextFunction) {
    const matchedRoute = Object.keys(proxyRoutes).find((route) =>
      req.path.startsWith(route),
    );

    if (!matchedRoute) {
      res.status(502).send('Bad Gateway: No matching proxy route.');
      return;
    }

    const options: Options = proxyRoutes[matchedRoute];
    const proxy = createProxyMiddleware(options);

    proxy(req, res, next);
  }
}
