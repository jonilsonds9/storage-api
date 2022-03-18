import { StorageConfig } from '../../src/config/storage';

describe('FilesConfig', () => {
  it('should be defined', () => {
    expect(new StorageConfig()).toBeDefined();
  });
});
