const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {

};

module.exports.help = {
    name: "upvote",
    aliases: ["uv"],
    usage: "upvote @user",
    description: "Upvote a user",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}