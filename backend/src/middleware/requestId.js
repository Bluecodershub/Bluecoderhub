import crypto from 'node:crypto';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export function requestId(req, res, next) {
  const incoming = req.headers['x-request-id'];
  req.id = typeof incoming === 'string' && REQUEST_ID_PATTERN.test(incoming)
    ? incoming
    : crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
}

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }));
  });

  next();
}
