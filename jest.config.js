module.exports = async () => ({
    modulePathIgnorePatterns: ["node_modules/"],
    testEnvironment: "jsdom",
    modulePaths: ["<rootDir>"],
});
