const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {

    const prefix = guild.prefix;

    if (args[0] == "help") {
        message.channel.send("You can just do " + prefix + "help for a list of commands.");
    } else if (args[0]) {
        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (command.help.category === "Hidden") return;
            var SHembed = new Discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(bicon)
                .setTitle(`**Command:** ${prefix}${command.help.name}`)
                .setDescription(`**❯ Category:** ${command.help.category || "No category"} **❯ Description:** ${command.help.description || "No description"}\n**❯ Usage:** ${prefix}${command.help.usage || "No usage"}\n**❯ Alisaes:** ${command.help.aliases || command.help.noalias}`)
            message.channel.send(SHembed);
        }
    } else {
        let Sembed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(`${client.user.username} | Help`, message.guild.iconURL)
            .setThumbnail(bicon)
            .setTimestamp()
            .setDescription("You can do " + prefix + "help <command>")
            .addField("❯ Reputation", `\`${prefix}profile\`, \`${prefix}upvote\`, \`${prefix}downvote\``)
            .addField("❯ Other", "``help``, ``invite``, ``ping``");
        message.channel.send(Sembed);
    }

};

module.exports.help = {
    name: "help",
    aliases: ["info", "commands", "cmds", "command", "h"],
    usage: "help",
    description: "Help command",
    perms: 0
};

module.exports.limits = {
    rateLimit: 2,
    cooldown: 5000
}