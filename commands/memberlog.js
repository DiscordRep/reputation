const Discord = require("discord.js");
const config = require("../config")
const Guilds = require("../models/gconfig");


exports.run = async (bot, guild, message, args) => {

    if (!message.member.permissions.has("ADMINISTRATOR")) return bot.throw(message, "Missing Permission", config.missingperms)

    if (!args[0]) return bot.throw(message, "Wrong Usage", `${config.wrongUsage} \`${guild.prefix}${this.help.usage}\``)

    let id;
    if (message.mentions.channels.first()) {
        id = message.mentions.channels.first().id;
    } else if (args[0] && message.guild.channels.cache.find(channel => channel.name === args[0].toLowerCase())) {
            id = message.guild.channels.cache.find(channel => channel.name === args[0].toLowerCase()).id;
    } else if (args[0] && await message.channels.cache.get(args[0])) {
        id = args[0];
    } else {
        return client.throw(message, "Wrong Usage", `${config.wrongUsage} \`${guild.prefix}${this.help.usage}\``)
    };

    if (id === guild.memberLog) return message.channel.send(`Member log is already set to \`${guild.memberLog}\``);

    await Guilds.findOne({
        id: message.guild.id
    }, async (err, guild) => {
        if (err) console.log(err);
        guild.memberLog = id;
        await guild.save().catch(e => console.log(e));
    });
    message.channel.send(`Successfuly set the member log for this server to \`${id}\``);
}

module.exports.help = {
    name: "memberlog",
    aliases: ["joinlog", "memberjoin"],
    usage: "memberlog channel",
    description: "Set the memberlog channel",
    perms: 3
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}