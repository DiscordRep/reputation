const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setThumbnail("https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png")
        .setTitle("DRep.me")
        .setURL('https://drep.me')
        .setDescription(`
We're is a online fraud prevention platform, designed to know who you're dealing with.

Invite the bot to your own server, and start building your reputation.
https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=134548545
**[Invite](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=134548545)**
> Click \`Invite\` or the link above to invite it.`)

        .setColor("#ffb300")
        .setFooter("Powered by drep.me", client.user.avatarURL())
        .setTimestamp()
    message.channel.send(embed)
}

module.exports.help = {
    name: "invite",
    aliases: ["add"],
    usage: "invite",
    description: "Invite command",
    perms: 0
};

module.exports.limits = {
    rateLimit: 5,
    cooldown: 5000
}