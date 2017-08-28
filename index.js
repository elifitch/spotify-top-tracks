const csv = require('csvtojson');
const request = require('request-promise');
const camelcase = require('camelcase');
const Promise = require('bluebird');

module.exports = function spotifyCharts(specificLocales) {
    let locales = specificLocales || [
        {
            id: "global",
            name: "Global",
            daily: true
        },
        {
            id: "us",
            name: "United States",
            daily: true
        },
        {
            id: "gb",
            name: "United Kingdom",
            daily: true
        },
        {
            id: "ad",
            name: "Andorra",
            daily: false
        },
        {
            id: "ar",
            name: "Argentina",
            daily: true
        },
        {
            id: "at",
            name: "Austria",
            daily: true
        },
        {
            id: "au",
            name: "Australia",
            daily: true
        },
        {
            id: "be",
            name: "Belgium",
            daily: true
        },
        {
            id: "bg",
            name: "Bulgaria",
            daily: false
        },
        {
            id: "bo",
            name: "Bolivia",
            daily: true
        },
        {
            id: "br",
            name: "Brazil",
            daily: true
        },
        {
            id: "ca",
            name: "Canada",
            daily: true
        },
        {
            id: "ch",
            name: "Switzerland",
            daily: true
        },
        {
            id: "cl",
            name: "Chile",
            daily: true
        },
        {
            id: "co",
            name: "Colombia",
            daily: true
        },
        {
            id: "cr",
            name: "Costa Rica",
            daily: true
        },
        {
            id: "cy",
            name: "Cyprus",
            daily: false
        },
        {
            id: "cz",
            name: "Czech Republic",
            daily: true
        },
        {
            id: "de",
            name: "Germany",
            daily: true
        },
        {
            id: "dk",
            name: "Denmark",
            daily: true
        },
        {
            id: "do",
            name: "Dominican Republic",
            daily: true
        },
        {
            id: "ec",
            name: "Ecuador",
            daily: true
        },
        {
            id: "ee",
            name: "Estonia",
            daily: true
        },
        {
            id: "es",
            name: "Spain",
            daily: true
        },
        {
            id: "fi",
            name: "Finland",
            daily: true
        },
        {
            id: "fr",
            name: "France",
            daily: true
        },
        {
            id: "gr",
            name: "Greece",
            daily: true
        },
        {
            id: "gt",
            name: "Guatemala",
            daily: true
        },
        {
            id: "hk",
            name: "Hong Kong",
            daily: true
        },
        {
            id: "hn",
            name: "Honduras",
            daily: true
        },
        {
            id: "hu",
            name: "Hungary",
            daily: true
        },
        {
            id: "id",
            name: "Indonesia",
            daily: true
        },
        {
            id: "ie",
            name: "Ireland",
            daily: true
        },
        {
            id: "is",
            name: "Iceland",
            daily: true
        },
        {
            id: "it",
            name: "Italy",
            daily: true
        },
        {
            id: "jp",
            name: "Japan",
            daily: true
        },
        {
            id: "lt",
            name: "Lithuania",
            daily: true
        },
        {
            id: "lu",
            name: "Luxembourg",
            daily: false
        },
        {
            id: "lv",
            name: "Latvia",
            daily: true
        },
        // {
        //     id: "mc",
        //     name: "Monaco",
        //     daily: false
        // },
        {
            id: "mt",
            name: "Malta",
            daily: false
        },
        {
            id: "mx",
            name: "Mexico",
            daily: true
        },
        {
            id: "my",
            name: "Malaysia",
            daily: true
        },
        {
            id: "ni",
            name: "Nicaragua",
            daily: false
        },
        {
            id: "nl",
            name: "Netherlands",
            daily: true
        },
        {
            id: "no",
            name: "Norway",
            daily: true
        },
        {
            id: "nz",
            name: "New Zealand",
            daily: true
        },
        {
            id: "pa",
            name: "Panama",
            daily: true
        },
        {
            id: "pe",
            name: "Peru",
            daily: true
        },
        {
            id: "ph",
            name: "Philippines",
            daily: true
        },
        {
            id: "pl",
            name: "Poland",
            daily: true
        },
        {
            id: "pt",
            name: "Portugal",
            daily: true
        },
        {
            id: "py",
            name: "Paraguay",
            daily: true
        },
        {
            id: "se",
            name: "Sweden",
            daily: true
        },
        {
            id: "sg",
            name: "Singapore",
            daily: true
        },
        {
            id: "sk",
            name: "Slovakia",
            daily: true
        },
        {
            id: "sv",
            name: "El Salvador",
            daily: true
        },
        {
            id: "th",
            name: "Thailand",
            daily: false
        },
        {
            id: "tr",
            name: "Turkey",
            daily: true
        },
        {
            id: "tw",
            name: "Taiwan",
            daily: true
        },
        {
            id: "uy",
            name: "Uruguay",
            daily: true
        }
    ];

    function renameHeaders(csv) {
        const splitCsv = csv.split('\n');
        splitCsv[0] = splitCsv[0].split(',').map(key => {
            return camelcase(key.replace(/"/g, ''))
        }).join(',');
        return splitCsv.map(line => `${line}\n`).join('');
    }
    
    function processResponse(res) {
        return new Promise((resolve, reject) => {
            csv().fromString(renameHeaders(res)).on('end_parsed', data => {
                resolve(data);
            }).on('done', err => {
                if(err) {
                    throw(err);
                }
            })
        });
    }
    
    return Promise.all(locales.map(locale => {
        let requestUrl = '';
        if (locale.daily) {
            requestUrl = `https://spotifycharts.com/regional/${locale.id}/daily/latest/download`;
        } else {
            requestUrl = `https://spotifycharts.com/regional/${locale.id}/weekly/latest/download`;
        }
        return request(requestUrl).then(processResponse).then(data => {
            // catching problems if HTML sneaks through
            if (!data[0]['<!doctypeHtml>']) {
                return {
                    id: locale.id,
                    chart: data
                }
            }
        });
    })).then(allData => {
        return allData.filter(data => data ? data : null).reduce((allChartData, localeData) => {
            allChartData[localeData.id] = localeData.chart;
            return allChartData;
        }, {});
    });
}

