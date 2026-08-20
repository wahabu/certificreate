// Puppeteer loads its repository configuration as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { join } = require("node:path");

module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
