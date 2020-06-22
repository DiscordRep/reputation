const Discord = require("discord.js");

exports.run = async (client, guild, message, args, drep, msg, dm) => {

    let voter = message.author.id;
    if (!args[0]) return msg("**[X]** | Please specify the user you would like to downvote.");
    let mname = message.mentions.members.first();
    let uname = message.guild.members.cache.find(member => member.user.username.toLowerCase() == args[0].toLowerCase());
    let tname = message.guild.members.cache.find(member => member.user.tag.toLowerCase() == args[0].toLowerCase());
    let uid = message.guild.members.cache.get(args[0]);
    let id = mname ? mname.id
        : uname ? uname.id
            : tname ? tname.id
                : uid ? args[0]
                    : null;
    let user = mname ? mname.id
        : uname ? uname
            : tname ? tname
                : uid ? uid
                    : null;
    if (!id) return msg("**[X]** | Could not find user.");

    let upvote = await drep.vote("down", voter, id);

    if (upvote.success) return msg("**[-]** | Your vote on **leny32** has been registered.");
    else if (upvote.status == 400) return msg("**[X]** | An error has occured.");
    else if (upvote.status == 403) return msg("**[X]** | Your account has been banned.");
    else if (upvote.status == 404) return msg("**[X]** | This user does not exist.");
    else if (upvote.status == 409) return msg("**[X]** | You have already upvoted this user.");
    else if (upvote.status == 429) return msg("**[X]** | We're currently ratelimited.");
    else return msg("**[X]** | An error has occured.");
};

module.exports.help = {
    name: "downvote",
    aliases: ["dv"],
    usage: "downvote @user",
    description: "Upvote a user",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}