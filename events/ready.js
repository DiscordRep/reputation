const config = require('../config')

exports.run = async(client) => {
    
    const DBL = require("dblapi.js");

    console.log("Ready");

    //const dbl = new DBL(config.dblToken, client)
    
    //dbl.postStats(client.guilds.cache.size);
  
    client.user.setActivity(`${config.domain} | ${config.prefix}info` , {
        type: "PLAYING"
    });
    
};
