import { authorizeRoles } from '../../src/lib/authorize.js'; // adapte le chemin si besoin
import { Response, NextFunction } from 'express';

describe('authorizeRoles middleware', () => {
  let req: any;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 403 if no user is present in the request', () => {
    const middleware = authorizeRoles('admin');
    middleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient rights' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user role is not authorized', () => {
    req.user = { role: 'user' };
    const middleware = authorizeRoles('admin');
    middleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient rights' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user role is authorized', () => {
    req.user = { role: 'admin' };
    const middleware = authorizeRoles('admin', 'superadmin');
    middleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
