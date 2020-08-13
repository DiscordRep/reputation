const Discord = require("discord.js");

exports.run = async (client, guild, message, args, drep, msg, dm) => {

    let voter = message.author.id;
    if (!args[0]) return msg("**[X]** | Please specify the user you would like to upvote.");
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
                        : null;
    let member = mname ? mname
        : uname ? uname
            : tname ? tname
                : uid ? uid
                    : fid ? fid
                        : null;
    if (!id) return msg("**[X]** | Could not find user.");

    let upvote = await drep.vote("up", voter, id);
    if (upvote.success) return msg(`**[+]** | Your vote on **${member.user.username}** has been registered.`);
    else return msg(`**[X]** | Sorry, you ${upvote.message}.`);
};

module.exports.help = {
    name: "upvote",
    aliases: ["uv", "uprep", "upv"],
    usage: "upvote @user",
    description: "Upvote a user",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}