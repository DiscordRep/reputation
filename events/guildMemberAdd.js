const Discord = require("discord.js");
const moment = require("moment");
const config = require("../config");
const Guilds = require("../models/gconfig");
const Bans = require("../models/bans");
const Warns = require("../models/warns");

exports.run = async (client, member) => {

    let guild = await Guilds.findOne({
        id: member.guild.id
    });

    if (!guild) {
        let newGuild = new Guilds({
            id: member.guild.id,
            prefix: "=",
            memberLog: "none"
        });
        await newGuild.save().catch(e => console.log(e));
    };

    if (guild && guild.memberLog !== "none") {
        let days = parseInt(moment(new Date()).diff(member.user.createdAt, "days"));
        let time = moment(member.user.createdAt).format("MMMM D, YYYY");

        let ban = await Bans.findOne({
            id: member.user.id
        });

        let warn = await Warns.findOne({
            id: member.user.id
        });

        let channel = client.guilds.cache.find(guild => guild.id === member.guild.id).channels.cache.get(guild.memberLog);

        let messageContent = "";
        let embed = new Discord.MessageEmbed()
            .setAuthor("Member Joined", member.user.avatarURL())
            .setFooter("Powered by drep.me", client.user.avatarURL());

        messageContent += `${member.user.tag} [\`${member.user.id}\`]\n\n`

        if (ban) {
            embed.setColor("RED")
            messageContent += `**${config.emojis.banned} | Account Banned on, read [here](https://drep.me/u/${member.user.id}/)**
Reason: ${ban.reason}\n\n`
        } else if (warn) {
            embed.setColor("ORANGE");
            messageContent += `**${config.emojis.warned} | Account Warned on, read [here](https://drep.me/u/${member.user.id}/)**
Reason: ${warn.reason}\n\n`
        } else {
            messageContent += `${config.emojis.success} | No active bans or warnings on, read [here](https://drep.me/u/${member.user.id}/)\n\n`
        }

        if (days < 28) {
            embed.setColor("ORANGE");
            messageContent += `**${config.emojis.error} | Account created: ${time}**
Under a month old (${days} days)\n\n`
        } else {
            messageContent += `${config.emojis.success} | Account Created: ${time}\n\n`
        }

        if (ban || warn) {
            messageContent += `${config.emojis.error} | This user's voting access is disabled for \`permanent\`.`
        } else if (days < 28) {
            messageContent += `${config.emojis.error} | This user's voting access is disabled for \`${28 - days} days\``
        } else {
            embed.setColor("GREEN")
        }
        embed.setDescription(messageContent);
        if (channel) channel.send(embed);
    }
};
