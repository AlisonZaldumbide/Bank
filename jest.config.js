const esModules = ['@angular', '@ngrx', 'rxjs'];

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globals: {},
    transform: {
        '^.+\\.(ts|js|html)$': ['jest-preset-angular', {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$'
        }]
    },
    transformIgnorePatterns: [
        `/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'html'],
};
