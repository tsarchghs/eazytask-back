module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom:["api/*","loaders/*","middlewares/*","models/*","*.js"]
};