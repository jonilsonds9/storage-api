import { StorageConfig } from '../../src/config/storage';

describe('StorageConfig', () => {
  it('should be defined', () => {
    expect(new StorageConfig()).toBeDefined();
  });
});
