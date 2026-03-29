import fs from 'fs';
import path from 'path';
import logger from '../../src/common/utils/logger.js';

describe('Production Logger Utility', () => {
    const logDir = 'logs';

    beforeAll(() => {
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
    });

    it('should have correct log levels defined', () => {
        expect(logger.levels).toEqual({
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            debug: 4,
        });
    });

    it('should log to Winston info level', () => {
        const spy = jest.spyOn(logger, 'log');
        logger.info('Test log message');
        // Winston info() calls log() internally
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('should create log files and persist data', async () => {
        const testError = 'Critical test error ' + Date.now();
        logger.error(testError);
        
        // Winston file transport is async, wait a bit
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const combinedLog = fs.readFileSync(path.join(logDir, 'combined.log'), 'utf8');
        const errorLog = fs.readFileSync(path.join(logDir, 'error.log'), 'utf8');
        
        expect(combinedLog).toContain(testError);
        expect(errorLog).toContain(testError);
    });
});
