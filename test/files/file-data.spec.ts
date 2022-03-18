import { FileData } from '../../src/files/file-data';

describe('FileData', () => {
  it('should be defined', () => {
    expect(new FileData('images', 'image-test.png')).toBeDefined();
  });
});
