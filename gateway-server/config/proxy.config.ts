import { Options } from 'http-proxy-middleware';

const authTarget = process.env.AUTH_SERVER!;
const eventTarget = process.env.EVENT_SERVER!;

export const proxyRoutes: Record<string, Options> = {
  '/auth': {
    target: authTarget,
    changeOrigin: true,
  },
  '/admin': {
    target: authTarget,
    changeOrigin: true,
  },
  '/events': {
    target: eventTarget,
    changeOrigin: true,
  },
};
