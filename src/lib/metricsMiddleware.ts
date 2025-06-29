import { Request, Response, NextFunction } from 'express';
import { httpRequestCounter } from '../config/metrics.js';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.once('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString(),
    });
  });

  next();
}
