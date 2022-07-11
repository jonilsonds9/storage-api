import {Test, TestingModule} from '@nestjs/testing';
import {FilesController} from '../../src/files/files.controller';
import {FilesService} from '../../src/files/files.service';
import {FileDataInterceptor} from "../../src/files/file-data.interceptor";

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: { upload: jest.fn() }
      }]
    }).overrideInterceptor(FileDataInterceptor).useValue({ intercept: jest.fn() })
    .compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
