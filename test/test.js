const spotifyCharts = require('../index');
jest.mock('./mock-request');

test('Successfully convert chart CSVs to json', () => {
    spotifyCharts({}).then(data => {
        // console.log(data);
    })
});