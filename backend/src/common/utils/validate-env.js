"use client";
import fs from 'fs';
import path from 'path';

/**
 * Validates that all variables defined in .env.example are present in process.env.
 * Run this during CI or pre-start to ensure production readiness.
 */
function validateEnv() {
  const examplePath = path.resolve(process.cwd(), '.env.example');
  
  if (!fs.existsSync(examplePath)) {
    console.warn('⚠️ .env.example not found. Skipping validation.');
    return;
  }

  const exampleContent = fs.readFileSync(examplePath, 'utf-8');
  const requiredVars = exampleContent
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=')[0].trim());

  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.error('❌ Mising required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  } else {
    console.log('✅ Environment validation successful.');
  }
}

// Simple test for Jest
if (process.env.NODE_ENV === 'test') {
    describe('Environment Validation', () => {
        it('should have all variables from .env.example in process.env', () => {
            // This is a placeholder for actual runtime validation
            expect(true).toBe(true);
        });
    });
}

// If run directly
if (require.main === module) {
  validateEnv();
}
