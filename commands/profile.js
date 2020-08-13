const Discord = require("discord.js");
const moment = require("moment");
const config = require("../config");

exports.run = async (client, guild, message, args, drep, msg, dm) => {

    if (!args[0]) args[0] = message.author.id;
    let mname = message.mentions.members.first();
    let uname = message.guild.members.cache.find(member => member.user.username.toLowerCase() == args[0].toLowerCase());
    let tname = message.guild.members.cache.find(member => member.user.tag.toLowerCase() == args[0].toLowerCase());
    let uid = message.guild.members.cache.get(args[0]);
    let fid = client.users.fetch(args[0]);
    let id = mname ? mname.id
        : uname ? uname.id
            : tname ? tname.id
                : uid ? args[0]
                    : fid ? args[0]
                        : message.author.id;
    let member = mname ? mname
        : uname ? uname
            : tname ? tname
                : uid ? uid
                    : fid ? fid
                        : message.author;

    let rep = await drep.rep(id);
    let infractions = await drep.infractions(id);
    let type, mod, reason, date;
    if (infractions) type = infractions.constructor.name, mod = infractions.moderator, reason = infractions.reason, date = infractions.date;
    let xp = rep.xp, rank = rep.rank, staff = rep.rank, reputation = rep.reputation, upvotes = rep.upvotes, downvotes = rep.downvotes;

    let messageContent = "";

    messageContent += `${config.emojis.user} | ${member} [${member.id}]
             ↳ Go to Profile\n\n`;

    let repColor = "GREEN"; 

    if (type == "Warn") {
        repColor = "ORANGE";
        messageContent += `${config.emojis.warned} **WARNED** for ${reason}`;
    }
    if (type == "Ban") {
        repColor = "RED";
        messageContent += `${config.emojis.banned} **BANNED** for ${reason}\n`;
    }

    let repIcon = reputation > 0 ? config.emojis.upvote : config.emojis.downvote;
    repColor = repColor == "GREEN" && reputation < 0 ? repColor = "ORANGE" : "GREEN";

    let profileEmbed = new Discord.MessageEmbed()
        .setAuthor(`${member.user.tag}`, member.user.avatarURL({ format: "png", dynamic: true }))
        .setColor(repColor)
        .setDescription(messageContent)
        .addField("Reputation", `${reputation}${repIcon}
        [ ${upvotes} | ${downvotes} ]`, true)
        .addField("Created", `${moment(member.user.createdAt).format("DD/MM/YYYY")}
        [ ${moment(new Date()).diff(member.user.createdAt, "days")} days ]`, true)
        .addField("Activity", `${xp} messages`)
        .setFooter("Powered by discordrep.com")
    msg(profileEmbed);
}

module.exports.help = {
    name: "profile",
    aliases: ["p", "rep", "r", "check", "userinfo", "ui"],
    usage: "invite",
    description: "Invite the bot to your server",
    perms: 0
};

module.exports.limits = {
    rateLimit: 5,
    cooldown: 5000
}