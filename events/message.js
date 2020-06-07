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

exports.run = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return message.channel.send(`${config.emojis.error} | Cannot execute commands via DMs.`);

    let optOut = await Optouts.findOne({
      id: message.author.id
    })
    if(optOut) return
    
    let guild;
    guild = await Guilds.findOne({
        id: message.guild.id
    });
    if (!guild) {
        guild = new Guilds({
            id: message.guild.id,
            prefix: "=",
            memberLog: "none"
        });
        await guild.save().catch(e => console.log(e));
    };


    if (!client.activeUser.find(u => u.id === message.author.id)) {
        let mUser = await Messages.findOne({ id: message.author.id });
        if (!mUser) {
            mUser = new Messages({
                id: message.author.id,
                messages: 0,
                reputation: 0,
                lastmessage: Date.now()
            });
            await mUser.save().catch(e => console.log(e));
        };
        await client.activeUser.push(mUser);
    };
    mUser = await client.activeUser.find(u => u.id === message.author.id);
    mUser.lastmessage = Date.now();
    mUser.messages += 1;
    mUser.markModified("messages");

    if (message.mentions.members.first() && message.mentions.members.first().id == client.user.id) message.channel.send(`The prefix for this server is \`${guild.prefix}\`\n> For more info please use \`${guild.prefix}info\``)

    if (message.content.startsWith(guild.prefix)) {

        let messageArray = message.content.split(" ");
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);

        let commandfile = client.commands.get(cmd.slice(guild.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(guild.prefix.length)));
        if (!commandfile) return;
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        let aName = commandfile.help.name;

        if (commandfile.limits) {
            const current = client.limits.get(`${aName}-${message.author.id}`);

            if (!current) client.limits.set(`${aName}-${message.author.id}`, 1);
            else {
                if (current >= commandfile.limits.rateLimit) return;
                client.limits.set(`${aName}-${message.author.id}`, current + 1);
            }

            setTimeout(() => {
                client.limits.delete(`${aName}-${message.author.id}`);
            }, commandfile.limits.cooldown);
        }

        let aPerms = commandfile.help.perms;

        if (aPerms === 1) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user) return client.throw(message, "Missing Permission", `Required [Login](https://drep.me/login) to our [website](https://drep.me)`);
        } else if (aPerms === 2) {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`MANAGE_MESSAGES\``);
        } else if (aPerms === 3) {
            if (!message.member.hasPermission("ADMINISTRATOR")) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`ADMINISTRATOR\``);
        } else if (aPerms === 4) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user || user && !user.mod) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`DR Mod\``);
        } else if (aPerms === 5) {
            let user = await Users.findOne({ id: message.author.id });
            if (!user || user && !user.admin) return client.throw(message, "Missing Permission", `${config.missingperms} | Required \`DR Admin\``);
        }

        commandfile.run(client, guild, message, args);
        //client.channels.cache.get(config.channels.commandsLog).send(`${message.author.tag} \`[${message.author.id}]\` used **${cmd.slice(guild.prefix.length)}** in ${message.guild.name} \`[${message.guild.id}]\` \|\|${message.content}\|\|`)
    }
}
