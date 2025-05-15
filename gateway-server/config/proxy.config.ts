// src/config/proxy.config.ts

import { Options } from 'http-proxy-middleware';

export const proxyRoutes: Record<string, Options> = {
  '/auth': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/tokens': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/users': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/events': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/progress': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/rewards': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  '/user-event': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
};
