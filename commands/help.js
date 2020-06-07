const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {

    const prefix = guild.prefix;
    //client.shard.fetchClientValues('guilds.cache.size').then(results => {
    let embed = new Discord.MessageEmbed()
        .setThumbnail("https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png")
        .setTitle("DRep.me")
        .setURL('https://drep.me')
        .setColor("#ffb300")
        .setFooter("Powered by drep.me", client.user.avatarURL())
        .setTimestamp()
        .setDescription(`
We're is a online fraud prevention platform, designed to prevent scams.

**To see a list of commands, please react below.**
> Click ⬇️ to see all commands.

**[Website](https://drep.me)**
> Everything is in connection with our website.

**[Discord](https://discord.gg/7tKYB63)**
> Join our Discord for help with anything

**Guild Size**
> ${client.guilds.cache.size} servers.`);

    //> ${results.reduce((prev, guildCount) => prev + guildCount, 0)} servers.`);

    const helpEmbed = new Discord.MessageEmbed()
        .setThumbnail("https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png")
        .setTitle("DRep.me")
        .setURL('https://drep.me')
        .setColor("#ffb300")
        .setFooter("Powered by drep.me", client.user.avatarURL())
        .setTimestamp()
        .setDescription(`
**${prefix}upvote @user/userid (comment)**
↳ Give reputation to your beloved ones.

**${prefix}downvote @user/userid (comment)**
↳ Give bad reputation to the stupid ones.

**${prefix}profile @user/userid**
↳ Search up anyones reputation.

**${prefix}report @user/userid (reason)**
↳ Report users for violating rules.

**${prefix}top**
↳ Check the voting leaderboard.

**${prefix}setbio**
↳ Edit your bio description.

**${prefix}prefix**
↳ Edit the servers prefix.

**${prefix}memberlog**
↳ Edit the memberlog channel.

**${prefix}rules**
↳ Reputation rules.

**${prefix}invite**
↳ Invite bot to your server.`);

    message.channel.send(embed).then(msg => {
        msg.react("⬇️").then(r => {
            const vFilter = (reaction, user) => reaction.emoji.name === "⬇️" && user.bot === false && user.id === message.author.id;
            const v = msg.createReactionCollector(vFilter, { time: 60000 });
            v.on("collect", r => {
                msg.edit(helpEmbed).then(() => {
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
                        r.remove(message.guild.me);
                        r.remove(message.author);
                    };
                });
            });
        });
    });
};

module.exports.help = {
    name: "help",
    aliases: ["info", "commands", "cmds", "command"],
    usage: "help",
    description: "Help command",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}