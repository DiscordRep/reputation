const Discord = require("discord.js");
const Bans = require("../models/bans");
const Votes = require("../models/votes");
const Users = require("../models/users");
const Comments = require("../models/comments");
const config = require("../config");
const moment = require("moment");

exports.run = async (client, guild, message, args) => {

    let ban = await Bans.findOne({
        id: message.author.id
    });

    if (ban) {
        message.delete();
        return message.channel.send("You are banned, and your voting access has been remove.");
    }

    let daysOld = parseInt(moment(new Date()).diff(message.author.createdAt, 'days'));
    if (daysOld < 14) return message.channel.send(`Your account is too young to access this. Please wait ${14 - daysOld} days to get access.`);

    let id;
    if (message.mentions.members.first()) {
        id = message.mentions.members.first().id;
    } else if (args[0] && message.guild.members.cache.find(member => member.user.username.toLowerCase() === args[0].toLowerCase())) {
        try {
            id = message.guild.members.cache.find(member => member.user.username.toLowerCase() === args[0].toLowerCase()).user.id; // I don't know how to catch this error (when not typing a real username)
        } catch {
            return client.throw(message, "Wrong Usage", `${config.wrongUsage} \`${guild.prefix}${this.help.usage}\``)
        }
    } else if (args[0]) {
        try {
            let name = await client.users.fetch(args[0])
            id = name.id;
        } catch {
            return client.throw(message, "Wrong Usage", `${config.wrongUsage} \`${guild.prefix}${this.help.usage}\``)
        }
    } else {
        return client.throw(message, "Wrong Usage", `${config.wrongUsage} \`${guild.prefix}${this.help.usage}\``)
    };

    if (message.author.id === id) {
        const nEmbed = new Discord.MessageEmbed().setDescription(`You cannot downvote yourself.`);
        return message.channel.send(nEmbed);
    }

    let vote = await Votes.findOne({
        id: id
    });

    if (!vote) {
        let newVote = new Votes({
            id: id,
            upvotes: [],
            downvotes: []
        });
        await newVote.save().catch(e => console.log(e));
    };

    await Votes.findOne({
        id: id
    }, async (err, aVote) => {
        if (err) console.log(err);
        if (aVote.downvotes.find(u => u.id === message.author.id)) {
            let nEmbed = new Discord.MessageEmbed().setDescription(`You have already downvoted this user.`);
            return message.channel.send(nEmbed);
        } else {
            let downV = {
                id: message.author.id
            };
            aVote.downvotes.push(downV);
            await aVote.save().catch(e => console.log(e));
            let downEmbed = new Discord.MessageEmbed()
                .setTitle("User downvoted")
                .setColor("RED")
                .setDescription(`The vote was registered to the users [Profile](https://drep.me/u/${id})`)
                .setFooter("Powered by drep.me", client.user.avatarURL());
            let dComment = `Downvoted: ${args.slice(1).join(" ").substring(0, 256)}`
            if (args.slice(1).join(" ").substring(0, 256)) {
                let comment = await Comments.findOne({
                    id: id
                });

                if (!comment) {
                    let newComment = new Comments({
                        id: id,
                        enabled: true,
                        comments: []
                    });
                    await newComment.save().catch(e => console.log(e));
                };

                if (comment && comment.comments.find(c => c.id === message.author.id)) {
                    let index = comment.comments.indexOf(comment.comments.find(r => r.id === message.author.id));
                    if (index > -1) {
                        await Comments.findOne({
                            id: id
                        }, async (err, dUser) => {
                            if (err) console.log(err);
                            dUser.comments.splice(index, 1);
                            await dUser.save().catch(e => console.log(e));
                        });
                    }
                }

                let downC = {
                    id: message.author.id,
                    content: dComment,
                    likes: [],
                    createdAt: Date.now()
                };
                await Comments.findOne({
                    id: id
                }, async (err, rComment) => {
                    if (err) console.log(err);
                    rComment.comments.push(downC);
                    await rComment.save().catch(e => console.log(e));
                });
                downEmbed.addField("Comment", args.slice(1).join(" ").substring(0, 256));
            };
            let user = await Users.findOne({
                id: message.author.id
            });
            if (!user) {
                if (Math.random() < 0.20) {
                    downEmbed.addField("New?", "Remember to [login](https://drep.me/login) to our [website](https://drep.me) for more features.");
                }
            }
            if (aVote.upvotes.find(u => u.id === message.author.id)) {
                let index = aVote.upvotes.indexOf(aVote.upvotes.find(u => u.id === message.author.id));
                if (index > -1) {
                    aVote.upvotes.splice(index, 1)
                    await aVote.save().catch(e => console.log(e));
                }
            }

            message.channel.send(downEmbed);
        };
    });
}

module.exports.help = {
    name: "downvote",
    aliases: ["drep", "-rep", "devouch,", "dvouch", "downboat", "dv", "devote"],
    usage: "downvote @user/user/userid",
    description: "Downvote a user",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}