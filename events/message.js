const Users = require("../models/users");
const Guilds = require("../models/gconfig");
const Messages = require("../models/messages");
const Dblvotes = require("../models/dblvotes");
const Optouts = require("../models/optouts");
const config = require('../config')
const Discord = require("discord.js");
const Bans = require("../models/bans");
const Warns = require("../models/warns");
const Votes = require("../models/votes");

const { DRepClient } = require('@drep/api');
const drep = new DRepClient('D-REP.EMVO3EKZFPQT3D..B9NU193DUH51Q41B0.RN.RV3CBL9RZ7TZX86X2UTDI');

exports.run = async (client, message) => {

    /*
        GLOBAL FUNCTION
    */

    function msg(content) { return message.channel.send(content); }
    function dm(content) { return message.author.send(content); }

    /*
        RESTRICTIONS
    */

    let optOut = await Optouts.findOne({ id: message.author.id });
    if (optOut) return;

    if (message.author.bot) return;
    if (message.channel.type == "dm") return message.channel.send(`${config.emojis.error} | Cannot execute commands via DMs.`);

    /*
        GUILD SETTINGS
    */

    let guild = await Guilds.findOne({ id: message.guild.id });
    if (!guild) {
        guild = new Guilds({ id: message.guild.id, prefix: "!", memberLog: "none" });
        await guild.save().catch(e => console.log(e));
    };

    /*
        MESSAGES/XP COUNTER
    */

    if (!client.activeUser.find(u => u.id === message.author.id)) {
        let mUser = await Messages.findOne({ id: message.author.id });
        if (!mUser) {
            mUser = new Messages({ id: message.author.id, messages: 0, reputation: 0, lastmessage: Date.now() });
            await mUser.save().catch(e => console.log(e));
        };
        await client.activeUser.push(mUser);
    };
    mUser = await client.activeUser.find(u => u.id === message.author.id);
    mUser.lastmessage = Date.now();
    mUser.messages += 1;
    mUser.markModified("messages");

    /*
    COMMANDS & MENTION HANDLING
    */

    if (message.mentions.members.first() && message.mentions.members.first().id == client.user.id) message.channel.send(`The prefix for this server is \`${guild.prefix}\`\n> For more info please use \`${guild.prefix}info\``)
    if (message.content.startsWith(guild.prefix)) {
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);
        let commandfile = client.commands.get(cmd.slice(guild.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(guild.prefix.length)));
        if (!commandfile) return;

        let aName = commandfile.help.name;

        /*
            COMMAND RATELIMITS
        */

        if (commandfile.limits) {
            const current = client.limits.get(`${aName}-${message.author.id}`);

            if (!current) client.limits.set(`${aName}-${message.author.id}`, 1);
            else {
                if (current >= commandfile.limits.rateLimit) return message.channel.send("You're being ratelimited.");
                client.limits.set(`${aName}-${message.author.id}`, current + 1);
            }

            setTimeout(() => {
                client.limits.delete(`${aName}-${message.author.id}`);
            }, commandfile.limits.cooldown);
        }

        /*
            VOTING LIMITS
        */

        let server = message.guild.id;
        let channel = message.channel.id;

        if (aName == "upvote" || aName == "downvote") {
            /*
                CHANNEL LIMITS
            */
            let timer;
            let current = client.restrictions.get(`${server}-${channel}`);
            if (!current) {
                await client.restrictions.set(`${server}-${channel}`, 1);
                current = client.restrictions.get(`${server}-${channel}`);
            }

            timer = setTimeout(() => {
                client.restrictions.delete(`${server}-${channel}`);
            }, current * 1000);
            if (current) {
                if (timer) clearTimeout(timer);
                if (current >= 4 && current < 30) {
                    client.restrictions.set(`${server}-${channel}`, current * 2);
                    return message.channel.send(`Your channel has been ratelimited to voting for ${current} seconds.`);
                } else if (current > 30) {
                    client.restrictions.set(`${server}-${channel}`, 60);
                    const invite = await message.channel.createInvite({ maxAge: 0, reason: "This server has been flagged by the reputation service" }).catch(err => { });
                    client.channels.cache.get(config.channels.announcements).send(new Discord.MessageEmbed().setColor("RED").setDescription(`**${message.author.tag}** \`[${message.author.id}]\` has flagged **[${message.guild.name}](https://discord.gg/${invite.code})** \`[${message.guild.id}]\`.\n\nhttps://discord.gg/${invite.code}`))
                    return message.channel.send(`🛑 | Your account has been flagged. The server has been reported to DiscordRep Administration.`);
                } else {
                    client.restrictions.set(`${server}-${channel}`, current + 2);
                }
            }
        }

        /*
            PERMISSION MANAGER
        */

        let aPerms = commandfile.help.perms;

        if (aPerms == 1) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user) return client.throw(message, "Missing Permission", `Required to [Login](https://discordrep.com/login) to access.`);
        } else if (aPerms == 2) {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`MANAGE_MESSAGES\``);
        } else if (aPerms == 3) {
            if (!message.member.hasPermission("ADMINISTRATOR")) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`ADMINISTRATOR\``);
        } else if (aPerms == 4) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user || user && !user.mod) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`Bot Mod\``);
        } else if (aPerms == 5) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user || user && !user.admin) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`Bot Admin\``);
        }

        /*
            COMMAND EXECUTOR
        */

        commandfile.run(client, guild, message, args, drep, msg, dm);
        //client.channels.cache.get(config.channels.commandsLog).send(`${message.author.tag} \`[${message.author.id}]\` used **${cmd.slice(guild.prefix.length)}** in ${message.guild.name} \`[${message.guild.id}]\` \|\|${message.content}\|\|`)
    }
}
