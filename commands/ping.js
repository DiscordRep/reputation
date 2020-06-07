const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds.toFixed(2)} seconds`;

    let msgping1 = new Date();
    let clientping = new Date() - message.createdAt;
    let pingembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addField('API Ping ', Math.floor(client.ws.ping) + ' ms', true)
        .addField('Bot Ping ', Math.floor(clientping) + ' ms', true)
        .addField('RAM Usage', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB', true)
        .addField("Uptime", `${uptime}`)
        .setFooter("Powered by drep.me", client.user.avatarURL())
        .setTimestamp();
    return message.channel.send(pingembed);
};

module.exports.help = {
    name: "ping",
    aliases: ["botping"],
    usage: "ping",
    description: "Check the bot's ping and uptime",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}