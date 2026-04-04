import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { authLimiter } from '../../src/common/middleware/rate-limit.middleware.js';

describe('Rate Limiting Middleware', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        
        // Mock route for testing auth rate limit
        app.post('/test-auth', authLimiter, (req, res) => {
            res.status(200).json({ success: true });
        });
    });

    it('should allow requests within the limit', async () => {
        const response = await request(app).post('/test-auth').send({});
        expect(response.status).toBe(200);
    });

    it('should return 429 when rate limit is exceeded', async () => {
        // The limit for auth is 5 requests. We've already done 1 in the previous test.
        // We do 4 more to reach the limit, then the 6th should fail.
        // Note: supertest/express sessions can be tricky with rate-limit, 
        // but since they use the same "IP" (localhost), it should trigger.
        
        for (let i = 0; i < 4; i++) {
            await request(app).post('/test-auth').send({});
        }

        const response = await request(app).post('/test-auth').send({});
        
        expect(response.status).toBe(429);
        expect(response.body).toEqual({ error: 'Too many login attempts. Please try again in 15 minutes.' });
    });
});
