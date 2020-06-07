const Discord = require("discord.js");
const config = require("../config")
const Guilds = require("../models/gconfig");


exports.run = async (bot, gConfig, message, args) => {

    if (!message.member.permissions.has("ADMINISTRATOR")) return bot.throw(message, "Missing Permission", config.missingperms)

    if (!args[0]) return bot.throw(message, "Wrong Usage", `${config.wrongUsage} \`${gConfig.prefix}${this.help.usage}\``)

    if (args[0] === gConfig.prefix) return message.channel.send(`Prefix is already set to \`${gConfig.prefix}\``);
    if (args[0].length > 5) return message.channel.send("Prefix can be maximum 5 characters");

    await Guilds.findOne({
        id: message.guild.id
    }, async (err, guild) => {
        if (err) console.log(err);
        guild.prefix = args[0]
        await guild.save().catch(e => console.log(e))
    });

    message.channel.send(`Successfuly set the prefix for this server to \`${args[0]}\``);
}

module.exports.help = {
    name: "prefix",
    aliases: ["setprefix", "sprefix", "gprefix", "dprefix"],
    usage: "prefix ?",
    description: "Change the bots prefix in the guild",
    perms: 3
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}