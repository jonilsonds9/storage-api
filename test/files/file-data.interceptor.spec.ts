import {FileDataInterceptor} from '../../src/files/file-data.interceptor';
import {Test, TestingModule} from "@nestjs/testing";

describe('FileDataInterceptor', () => {
    let fileDataInterceptor: FileDataInterceptor;
    const mockFilesRepository = () => ({});

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: FileDataInterceptor,
                useValue: { findOne: jest.fn() },
            }],
        }).compile();

        fileDataInterceptor = module.get<FileDataInterceptor>(FileDataInterceptor);
    });

    it('should be defined', () => {
        expect(fileDataInterceptor).toBeDefined();
    });
});
