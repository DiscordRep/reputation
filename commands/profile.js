const Discord = require("discord.js");
const config = require("../config");
const Votes = require("../models/votes");
const Users = require("../models/users");
const Bans = require("../models/bans");
const Warns = require("../models/warns");
const Messages = require("../models/messages");
const Optouts = require("../models/optouts");
const moment = require("moment");
const { Canvas } = require('canvas-constructor');
const { CanvasRenderService } = require("chartjs-node-canvas");
exports.run = async (client, guild, message, args) => {

    let id;
    if (message.mentions.members.first()) {
        id = message.mentions.members.first().id;
    } else if (args[0] && message.guild.members.cache.find(member => member.user.username.toLowerCase() == args[0].toLowerCase())) {
        try {
            id = message.guild.members.cache.find(member => member.user.username.toLowerCase() === args[0].toLowerCase()).user.id;
        } catch {
            id = message.author.id;
        }
    } else if (args[0] && message.guild.members.cache.find(member => member.user.tag.toLowerCase() == args[0].toLowerCase())) {
        try {
            id = message.guild.member.cachce.find(mmember => member.user.tag.toLowerCase() == args[0].toLowerCase()).user.id;
        } catch {
            id = message.author.id;
        }
    } else if (args[0]) {
        try {
            let name = await client.users.fetch(args[0]);
            id = name.id;
        } catch {
            id = message.author.id;
        }
    } else {
        id = message.author.id;
    };

    let member = await client.users.fetch(id);

    let optout = await Optouts.findOne({ id: member.id });

    let optEmbed = new Discord.MessageEmbed()
        .setTitle("Be careful!")
        .setColor("RED")
        .setDescription(`${config.emojis.banned} | This user has requested their data to be deleted from our platform, and opted-out from reputation search.\n\n**WE CANNOT VERIFY THEIR REPUTATION**.`)
        .setFooter("Powered by drep.me", `https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png`)

    if (optout) return message.channel.send(optEmbed);

    let user = await Users.findOne({ id: member.id });
    let vote = await Votes.findOne({ id: member.id });
    let messages = await Messages.findOne({ id: member.id });
    let ban = await Bans.findOne({ id: member.id });
    let warn = await Warns.findOne({ id: member.id });

    if (!vote) {
        vote = new Votes({
            id: id,
            upvotes: [],
            downvotes: []
        });
        await vote.save().catch(e => console.log(e));
    };

    if (!user) user = {
        admin: false,
        mod: false,
        partner: false,
        drepPlus: {
            active: false
        },
        donator: 0,
        bio: "No bio"
    }
    if (!messages) messages = {
        reputation: 0,
        messages: 0
    }

    let upORdown = vote.upvotes.length - vote.downvotes.length <= 0 ? `${config.emojis.downvote}` : `${config.emojis.upvote}`
    let profileLink;
    if (user && user.vanity && user.vanity !== "") { profileLink = `https://dsc.wtf/${user.vanity}` } else { profileLink = `https://drep.me/u/${member.id}` }

    let topTitle = user.admin ? "DR Admin" : user.mod ? "DR Mod" : user.drepPlus && user.drepPlus.active ? "DR Plus" : user.partner ? "Partner" : user.donator > 0 ? "Donator" : member.bot ? "Bot" : "User";
    let topPic = user.admin ? `${config.image.admin}` : user.mod ? `${config.image.mod}` : user.drepPlus && user.drepPlus.active ? `${config.image.drepPlus}` : user.partner ? `${config.image.partner}` : user.donator > 0 ? `${config.image.donator}` : member.bot ? `${config.image.bot}` : `${config.image.user}`
    let rep = messages.reputation;
    if (rep==1||rep==4||rep==7||rep==10||rep==13||rep==16||rep==19) ext = " I";
    else if (rep==2||rep==5||rep==8||rep==11||rep==14||rep==17||rep==20) ext = " II";
    else if (rep==3||rep==6||rep==9||rep==12||rep==15||rep==18||rep==21) ext = " III";
    else ext = "";

    let rank = rep <= 0? `${config.emojis.noreputation} No special repuation`
    : rep <= 3 ? `${config.emojis.bronze} Bronze`
    : rep <= 6 ? `${config.emojis.silver} Silver`
    : rep <= 9 ? `${config.emojis.gold} Gold`
    : rep <= 12 ? `${config.emojis.platinum} Platinum`
    : rep <= 15 ? `${config.emojis.titan} Titan`
    : rep <= 18 ? `${config.emojis.diamond} Diamond`
    : rep <= 21 ? `${config.emojis.champion} Champion`
    : rep <= 22 ? `${config.emojis.grandchampion} Grand Champion`
    : `${config.emojis.noreputation} No special reputation`;
    rank += ext;
    let time = moment(member.createdAt).format("DD.MM.YYYY");
    let color = ban ? "RED" : warn ? "ORANGE" : ["admin", "mod", "staff"].includes(member.tag.toLowerCase()) ? "ORANGE" : user.drepPlus && user.drepPlus.active && user.drepPlus.embedColor ? user.drepPlus.embedColor : "GREEN";

    let messageContent = `${config.emojis.user} | ${member.tag} [${member.id}]\n`
    messageContent += `         ↳ **[Go to Profile](${profileLink})**\n\n`
    if (ban) {
        if (ban.reason.length > 30) ban.reason += `...`;
        messageContent += `${config.emojis.banned} **BANNED** for \`${ban.reason.substring(0, 30)}`
    } else if (warn) {
        if (warn.reason.length > 30) warn.reason += `...`;
        messageContent += `${config.emojis.warned} **WARNED** for \`${warn.reason.substring(0, 30)}`
    } else if (["admin", "mod", "staff"].includes(member.tag.toLowerCase())) {
        messageContent += `${config.emojis.warned} **NOTICE** - this user is not a [Staff](https://drep.me/members).`
    } else {
        messageContent += `${config.emojis.success} No bans, warnings or notices.`
    }
    messageContent += `\n\n`;

    if (!member.bot && (!user.drepPlus || !user.drepPlus.active)) messageContent += `**[Upgrade ${config.emojis.drplus}](https://drep.me/pricing)**`

    let attachment = null

    if (!member.bot) {
        let configuration = {
            type: 'doughnut',
            data: {
                labels: ['upvotes', 'Downvotes', 'Neutral'],
                datasets: [{
                    data: [vote.upvotes.length, vote.downvotes.length, vote.upvotes.length + vote.downvotes.length != 0 ? 0 : 1],
                    backgroundColor: ['rgba(17,168,171, 0.2)', 'rgba(230,76,101, 0.4)', 'rgba(184,184,184, 0.2)'],
                    borderColor: ['rgba(17,168,171, 1)', 'rgba(230,76,101,1)', 'rgba(184,184,184, 0)'],
                }],
            },
            options: { legend: { display: false }, elements: { center: { text: `${(vote.upvotes.length - vote.downvotes.length) >= 0 ? '+' : ''}${vote.upvotes.length - vote.downvotes.length} rep`, color: '#9099b7' } } }
        }

        const canvasRenderService = new CanvasRenderService(
            150,
            150,
            ChartJS => {
                ChartJS.plugins.register({ beforeDraw: function (e) { if (e.config.options.elements.center) { var t = e.ctx, r = e.config.options.elements.center, i = r.fontStyle || "impact", n = r.text, a = r.color || "#000", o = (r.sidePadding || 20) / 100 * (2 * e.innerRadius); t.font = "6px " + i; var l = t.measureText(n).width, c = (2 * e.innerRadius - o) / l, f = Math.floor(30 * c), s = 0.40 * e.innerRadius, h = Math.min(f, s); t.textAlign = "center", t.textBaseline = "middle"; var d = (e.chartArea.left + e.chartArea.right) / 2, x = (e.chartArea.top + e.chartArea.bottom) / 2; t.font = h + "px " + i, t.fillStyle = a, t.fillText(n, d, x) } } });
            }
        );

        const chart = await canvasRenderService.renderToBuffer(configuration);

        let ctx = new Canvas(200, 200)
            .addImage(chart, 25, 25, 150, 150)
        attachment = new Discord.MessageAttachment(ctx.toBuffer(), 'image.png');
    }

    let embed = new Discord.MessageEmbed()
        .setAuthor(`${topTitle} | ${member.username}`, topPic)
        .setThumbnail(member.avatarURL({ format: "png", dynamic: true }))
        .setColor(color)
        .setDescription(messageContent)
        .setFooter("Powered by drep.me", `https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png`)
    if (!member.bot) embed.addField("Reputation", `**${vote.upvotes.length - vote.downvotes.length}** ${upORdown}\n{ ${vote.upvotes.length} : ${vote.downvotes.length} }`, true)
    embed.addField("Created", `${time}\n( ${parseInt(moment(new Date()).diff(member.createdAt, 'days'))} days ago )`, true)
    if (!member.bot) embed.addField("Activity", `${rank}\n[ ${config.emojis.xp} ${messages.messages.toLocaleString().replace(/,/g, " ")} XP ]`, true)
    if (member.bot) embed.addField("Bot", "*No reputation data for bots.*", true)
    if (!member.bot) embed.addField("Bio", user.bio)
    if (!member.bot) embed.setImage('attachment://image.png')

    let msgContent = {
        embed
    }
    if (!member.bot) msgContent.files = [attachment]

    message.channel.send(msgContent).then(m => {
        m.react(config.react.upvote).then(() => {
            m.react(config.react.downvote).then(() => {
                const filter = (reaction, fUser) => [config.react.upvote, config.react.downvote].includes(reaction.emoji.id) && !fUser.bot && fUser.id !== member.id;
                const collector = m.createReactionCollector(filter);
                collector.on('collect', async (reaction, rUser) => {
                    const isBanned = await Bans.findOne({ id: rUser.id });
                    if (isBanned) return message.channel.send(`${rUser}, you have no voting priviledges.`);
                    let optedout = await Optouts.findOne({ id: rUser.id });
                    if (optedout) return message.channel.send(`${rUser}, you have no voting priviledges.`);

                    const ageInDays = require("moment")(new Date()).diff(rUser.createdAt, "days");
                    if (ageInDays < 28) return message.channel.send.send(`${rUser} your discord account must be 28 days or older to vote.`);

                    var votesForUser = await Votes.findOne({ id: member.id });
                    if (!votesForUser) {
                        await (new Votes({
                            id: rUser.id,
                            upvotes: [],
                            downvotes: []
                        }).save());
                        votesForUser = await Votes.findOne({ id: member.id });
                    }

                    const downvoteIndex = votesForUser.downvotes.findIndex(item => item.id === rUser.id);
                    const upvoteIndex = votesForUser.upvotes.findIndex(item => item.id === rUser.id);

                    let which = reaction.emoji.id == config.react.upvote ? "upvoted" : "downvoted";
                    let whichColor = reaction.emoji.id == config.react.upvote ? "GREEN" : "RED";

                    if (upvoteIndex > -1 || downvoteIndex > -1) {
                        return message.channel.send(`${rUser} you've already voted on ${member.username}. Use commands instead.`).then(m => {
                            m.delete({ timeout: 5000 });
                        });
                    }

                    if (reaction.emoji.id === config.react.upvote) {
                        votesForUser.upvotes.push({ id: rUser.id });
                        await votesForUser.save().catch(() => { });

                    } else if (reaction.emoji.id === config.react.downvote) {
                        votesForUser.downvotes.push({ id: rUser.id });
                        await votesForUser.save().catch(() => { });
                    }

                    let voteEmbed = new Discord.MessageEmbed()
                        .setTitle(`${rUser.username} ${which} ${member.username}`)
                        .setColor(whichColor)
                        .setDescription(`The vote was registered to the users [Profile](${profileLink})`)
                        .setFooter("Powered by drep.me", "https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png?size=51");
                    message.channel.send(voteEmbed);
                });
            });
        });
    });
}

module.exports.help = {
    name: "profile",
    aliases: ["userinfo", "check", "c", "whois", "lookup", "rank", "rep", "repcheck", "reputation", "vouches", "r", "p", "l", "w", "u"],
    usage: "profile @user/user/userid",
    description: "Check anyone's profile",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}
