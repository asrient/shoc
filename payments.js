const https = require('https');
const common = require('./common.js');
const paytm = require('./paytm/checksum.js');


function getDetails(orderId, cb) {
    var paytmParams = {};
    paytmParams["MID"] = process.env.MID;
    paytmParams["ORDERID"] = orderId;

    paytm.genchecksum(paytmParams, process.env.MERCHANT_KEY, (err, hash) => {
        paytmParams["CHECKSUMHASH"] = hash;

        var post_data = JSON.stringify(paytmParams);

        var options = {
            hostname: process.env.GATEWAY_BASE_URL,
            port: 443,
            path: '/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        // Set up the request
        var response = "";
        var post_req = https.request(options, (post_res) => {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', () => {
                var json = JSON.parse(response);
                cb(json);
            });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    });
}

module.exports = { getDetails }