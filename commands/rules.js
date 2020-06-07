const Discord = require("discord.js");

exports.run = async (client, guild, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setThumbnail("https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png")
        .setTitle("Reputation Rules")
        .setDescription(`
**§ 1.1** Reputation for reputation: Reset votes (+ Warn) (+ Ban)

**§ 1.2** Giving feedback using alt account: Reset vote (+ Ban)

**§ 1.3** Giving feedback which is not truthful, relevant or informative: Removed vote (+ Warn)

   **§ 1.3.1** Making claims within the review which you cannot proof with evidence: Removed vote (+ Warn)
   
   **§ 1.3.2** Including a members usage of the reputation system within own review: Removed vote (+ Warn)
   
**§ 1.4** Accusing members of scamming without linking to a scam report on the member, which you have started: Removed vote

**§ 1.5** Hinting, suggesting or requesting feedback to be added onto someone besides yourself: Reset vote (+ Ban)

    **§ 1.5.1** Hinting, suggesting or requesting feedback to be added onto yourself: Gives permit for others to downvote you

**§ 1.6** Using feedback as a currency, reward, condition, incentive, blackmail, threat or deterrent: Reset (+ Ban)

**§ 1.7** Advertisement in comment. Removed feedback (+ Warn)

**§ 1.8** Advertisement in bio. Edit bio (+ Warn)

**§ 1.9** Breaking any rules, in bio: Edit bio (+ Warn)

You also agree to following [TOS](https://drep.me/tos)
`)
        .setColor("#ffb300")
        .setFooter("Powered by drep.me", client.user.avatarURL())
        .setTimestamp()
    message.channel.send(embed)
}

module.exports.help = {
    name: "rules",
    aliases: ["rule"],
    usage: "rules",
    description: "Check reputation rules",
    perms: 0
};

module.exports.limits = {
    rateLimit: 5,
    cooldown: 5000
}