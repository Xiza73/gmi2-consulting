import { defineMiddleware, sequence } from 'astro:middleware';

const securityHeaders = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
});

const timing = defineMiddleware(async (_context, next) => {
  const start = performance.now();
  const response = await next();
  response.headers.set('Server-Timing', `total;dur=${(performance.now() - start).toFixed(2)}`);
  return response;
});

export const onRequest = sequence(securityHeaders, timing);
