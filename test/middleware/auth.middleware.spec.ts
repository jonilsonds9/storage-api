import { AuthMiddleware } from '../../src/middleware/auth.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware()).toBeUndefined();
  });
});
