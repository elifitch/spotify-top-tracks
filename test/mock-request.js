const Promise = require('bluebird');
const mockCSVs = require('mock-json/mock-csvs.json');

module.exports = function mockRequest(url) {
    return new Promise((resolve, reject) => {
        const splitUrl = url.split('/')
        const csvId = splitUrl[splitUrl.indexOf('regional') + 1];
        console.log(csvId)
        process.nextTick(() => resolve(mockCSVs[csvId]));
        // resolve(mockCSVs[csvId]);
    });
}