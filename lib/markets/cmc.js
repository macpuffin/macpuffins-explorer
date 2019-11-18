var request = require('request');

var base_url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?';
function get_summary(coin, exchange, cmc_api_key, cb) {
    var summary = {};
    request({ uri: base_url + 'symbol=PFN&convert=BTC', json: true, headers: {'X-CMC_PRO_API_KEY': cmc_api_key}, }, function (error, response, body) {
        if (error) {
            return cb(error, null);
        } else if (body.data.PFN) {
            summary['btc'] = body.data.PFN.quote.BTC.price.toFixed(8);
            request({ uri: base_url + 'symbol=PFN&convert=USD', json: true, headers: {'X-CMC_PRO_API_KEY': cmc_api_key}, }, function (error, response, body) {
		        if (error) {
		            return cb(error, null);
		        } else if (body.data.PFN) {
		            summary['usd'] = body.data.PFN.quote.USD.price.toFixed(2);
		            return cb(null, summary);
		        } else {
		            return cb(error, null);
		        }
		    });
        } else {
            return cb(error, null);
        }
    });
}

module.exports = {
    get_data: function (coin, exchange, cmc_api_key, cb) {
        var error = null;
        get_summary(coin, exchange, cmc_api_key, function (err, stats) {
            if (err) { error = err; }
            return cb(error, { buys: [], sells: [], chartdata: [], trades: [], stats: stats });
        });
    }
};

