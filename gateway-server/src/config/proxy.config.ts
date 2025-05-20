import { Options } from 'http-proxy-middleware';

export const getProxyRoutes = (): Record<string, Options> => ({
  '/auth': {
    target: process.env.AUTH_SERVER!,
    changeOrigin: true,
  },
  '/admin': {
    target: process.env.EVENT_SERVER!,
    changeOrigin: true,
  },
  '/events': {
    target: process.env.EVENT_SERVER!,
    changeOrigin: true,
  },
});
