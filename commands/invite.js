const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL())
        .setTitle(client.user.username)
        .setColor("#ffb300")
        .setFooter("Powered by discordrep.com", client.user.avatarURL())
        .setTimestamp()
        .setDescription(`
**[Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=134548545)**

https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=134548545
> Click \`Invite\` or the link above to invite it.`);
    message.channel.send(embed)
}

module.exports.help = {
    name: "invite",
    aliases: ["add"],
    usage: "invite",
    description: "Invite the bot to your server",
    perms: 0
};

module.exports.limits = {
    rateLimit: 5,
    cooldown: 5000
}