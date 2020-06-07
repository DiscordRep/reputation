const Users = require("../models/users");
const config = require("../config")
const Discord = require("discord.js");

exports.run = async (bot, gConfig, message, args) => {

    let user = await Users.findOne({
        id: message.author.id
    })

    const signinEmbed = new Discord.MessageEmbed()
        .setTitle("Required Action")
        .setURL("https://drep.me")
        .setDescription("You must login once to our [Website](https://drep.me) to set your bio.");
    if (!user) return message.channel.send(signinEmbed);
    if (!args[0]) return bot.throw(message, "Wrong Usage", `${config.wrongUsage} \`${gConfig.prefix}${this.help.usage}\``);
    if (user) {
        let oldBio = user.bio
        Users.findOne({
            id: message.author.id
        }, async (err, userdb) => {
            if (err) console.log(err);
            userdb.bio = args.join(" ").substring(0, 250);
            await userdb.save().catch(e => console.log(e));
            message.channel.send(`Your bio has been set to: \`${userdb.bio}\``);
            if (oldBio == "No bio") {
                let embed = new Discord.MessageEmbed()
                    .setImage(`https://minecraftskinstealer.com/achievement/19/Achievement+Get%21/No+longer+unknown`)
                    .setColor("RANDOM")
                message.channel.send(embed);
            };
        });
    };
};

module.exports.help = {
    name: "setbio",
    aliases: ["bio", "sbio"],
    usage: "setbio bio",
    description: "Change your bio",
    perms: 1
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}