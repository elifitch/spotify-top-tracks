# spotify-top-tracks
Get Spotify's top songs by country from https://SpotifyCharts.com.  This module requests dozens of CSVs, bundles them together, and converts them to JSON so they're easier to work with.

## Installation
Install with NPM
`npm install spotify-top-tracks`
or Yarn
`yarn add spotify-top-tracks`

## Usage
```js
spotifyTopTracks({}).then(chartData => {
    fs.writeFileSync(`${__dirname}/output/spotify-top-tracks.json`, JSON.stringify(chartData))
});
```
The shape of the data will look something like the following:
```js
{
    countryName: [
        {
            position: 1,
            trackName: 'Human Music',
            artist: 'Earth Radio',
            streams: 1580,
            url: 'https://open.spotify.com/track/some-long-string'
        },
        {...}
    ]
}
```

## Options
The main argument you'll be concerned with in general use is `locales`.  If left blank, the module will by default get top track statistics from every available country.  Alternatively you can pass in only the locales (countries) you want.  A full listing of all available locales can be found in `default-locales.js`.  You'll need to include the id of the locale you want data for. Optionally you can define whether you want daily or weekly data, but be aware that some smaller locales do not have daily data.
```js

const onlyGlobalAndNicaragua = [
    {
        id: "global",
        daily: false
    },
    {
        id: "ni"
    }
];

spotifyTopTracks({
    // extended explanation above
    locales: onlyGlobalAndNicaragua,
    // only return the top 5 tracks
    limit: 5,
    // A function that returns a URL to download the daily top tracks from a certain country
    dailyUrl: (id) => `https://spotifycharts.com/regional/${id}/daily/latest/download`, 
    // A function that returns a URL to download the weekly top tracks from a certain country
    weeklyUrl: (id) => `https://spotifycharts.com/regional/${id}/weekly/latest/download`, 
    // A request library; Convenient to swap out for mocked requests in testing
    request: requestPromise
})
```