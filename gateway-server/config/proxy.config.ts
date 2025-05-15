// src/config/proxy.config.ts

import { Options } from 'http-proxy-middleware';

export const proxyRoutes: Record<string, Options> = {
  '/auth': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: { '^/auth': '/auth' }, // prefix 유지
  },
  '/events': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/events': '/events' },
  },
  '/user-event': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/user-event': '/user-event' },
  },
};
