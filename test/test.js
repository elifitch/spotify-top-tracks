const spotifyCharts = require('../index');
const mockRequest = require('./mock-request');
const mockOutput = require('./mock-json/mock-output.json');
// jest.mock('./mock-request');

test('Successfully convert chart CSVs to json', () => {
    // return spotifyCharts({request: mockRequest}).then(data => {
    //     expect(data).toEqual();
    // })

    return expect(spotifyCharts({request: mockRequest})).resolves.toEqual({foo: 'bar'});
});