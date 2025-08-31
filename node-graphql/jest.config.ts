import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true
};

export default config;