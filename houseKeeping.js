const common = require('./common.js');
//remove all the expired users records

function clear(){
common.users.deleteMany({expires_on:{$lte: common.time()}},function(){})
}

setInterval(clear,30*60*1000);
clear();