const Discord = require("discord.js");
const Votes = require("../models/votes");

exports.run = async (client, guild, message, args) => {

  if (!args[0]) {
    let vote;
    vote = await Votes.findOne({
      id: message.author.id
    });

    if (!vote) {
      vote = {
        upvotes: [],
        downvotes: []
      };
    }
    let mostVoted = await Votes.find({
      "upvotes.2": {
        $exists: true
      }
    });


    await mostVoted.sort((a, b) =>
      a.upvotes.length - a.downvotes.length <
        b.upvotes.length - b.downvotes.length
        ? 1
        : -1
    )

    let dGuild = client.guilds.cache.get(message.guild.id);

    let serverBest = await mostVoted.filter(u => dGuild.members.cache.get(u.id) && !dGuild.members.cache.get(u.id).user.bot)


    let serverPos = serverBest.indexOf(serverBest.find(v => v.id == message.author.id)) + 1;

    serverBest = serverBest.slice(0, 3);
    for (let j = 0; j < serverBest.length; j++) {
      let user0 = await client.users.fetch(serverBest[j].id, true);
      serverBest[j].tag = user0.tag;
    }

    let messageContent2 = "";

    serverBest.forEach((voted, index) => {
      if (voted.tag == message.author.tag) {
        messageContent2 += `**${serverPos}. ${message.author.tag}**: ${voted.upvotes
          .length - voted.downvotes.length}\n`;
      } else {
        messageContent2 += `**${index + 1}.** ${voted.tag}: ${voted.upvotes.length - voted.downvotes.length}\n`;
      }
    });
    if (serverBest.length < 3) {
      messageContent2 += `Missing data, not enough votes stored.\n`;
    }
    if (serverPos > serverBest.length) {
      messageContent2 += `**${serverPos}. ${message.author.tag}**: ${vote.upvotes
        .length - vote.downvotes.length}`;
    }


    let position =
      mostVoted.indexOf(mostVoted.find(v => v.id == message.author.id)) + 1;
    mostVoted = mostVoted.slice(0, 3);
    for (let j = 0; j < mostVoted.length; j++) {
      let user0 = await client.users.fetch(mostVoted[j].id, true);
      mostVoted[j].tag = user0.tag;
      mostVoted[j].username = user0.username;
    }
    let messageContent = "";
    mostVoted.forEach(voted => {
      if (voted.tag == message.author.tag) {
        messageContent += `**${position}. ${message.author.tag}**: ${voted.upvotes
          .length - voted.downvotes.length}\n`;
      } else {
        messageContent += `**${mostVoted.indexOf(
          mostVoted.find(v => v.id == voted.id)
        ) + 1}.** ${voted.username}: ${voted.upvotes.length -
        voted.downvotes.length}\n`;
      }
    });
    if (position > mostVoted.length) {
      messageContent += `**${position}. ${message.author.tag}**: ${vote.upvotes
        .length - vote.downvotes.length}`;
    }

    if (messageContent === "") {
      messageContent = "No values";
    }

    let embed = new Discord.MessageEmbed()
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png"
      )
      .setTitle(`Votes | Top 3`)
      .setURL("https://drep.me/members")
      .addField("Top Server", messageContent2)
      .addField("Top Global", messageContent)
      .addField("Top 10?", `\`${guild.prefix}top server\`\n\`${guild.prefix}top global\``)
      .setColor("#ffb300")
      .setFooter("Powered by drep.me", client.user.avatarURL())
      .setTimestamp();
    message.channel.send(embed);

  } else if (args[0] == "global") {
    let vote;
    vote = await Votes.findOne({
      id: message.author.id
    });

    if (!vote) {
      vote = {
        upvotes: [],
        downvotes: []
      };
    }
    let mostVoted = await Votes.find({
      "upvotes.2": {
        $exists: true
      }
    });


    await mostVoted.sort((a, b) =>
      a.upvotes.length - a.downvotes.length <
        b.upvotes.length - b.downvotes.length
        ? 1
        : -1
    );
    let position = mostVoted.indexOf(mostVoted.find(v => v.id == message.author.id)) + 1;
    mostVoted = mostVoted.slice(0, 10);
    for (let j = 0; j < mostVoted.length; j++) {
      let user0 = await client.users.fetch(mostVoted[j].id, true);
      mostVoted[j].tag = user0.tag;
      mostVoted[j].username = user0.username;
    }
    let messageContent = "";
    mostVoted.forEach(voted => {
      if (voted.tag == message.author.tag) {
        messageContent += `**${position}. ${message.author.tag}**: ${voted.upvotes.length - voted.downvotes.length}\n`;
      } else {
        messageContent += `**${mostVoted.indexOf(mostVoted.find(v => v.id == voted.id)) + 1}.** ${voted.username}: ${voted.upvotes.length - voted.downvotes.length}\n`;
      }
    });
    if (position) {
      if (position > mostVoted.length) {
        messageContent += `**${position}. ${message.author.tag}**: ${vote.upvotes.length - vote.downvotes.length}`;
      }
    }

    if (messageContent === "") {
      messageContent = "No values."
    }

    let embed = new Discord.MessageEmbed()
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/629705358146928654/713435929204883576/DREP_Logo.png"
      )
      .setTitle(`Votes | Top 10`)
      .setURL("https://drep.me/members")
      .addField("Top Global", messageContent)
      .addField("Top Server?", `\`${guild.prefix}top server\``)
      .setColor("#ffb300")
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setTimestamp();
    message.channel.send(embed);
  } else if (args[0] == "server") {
    let vote;
    vote = await Votes.findOne({
      id: message.author.id
    });

    if (!vote) {
      vote = {
        upvotes: [],
        downvotes: []
      };
    }
    let mostVoted = await Votes.find({
      "upvotes.2": {
        $exists: true
      }
    });


    await mostVoted.sort((a, b) =>
      a.upvotes.length - a.downvotes.length <
        b.upvotes.length - b.downvotes.length
        ? 1
        : -1
    );
    let dGuild = client.guilds.cache.get(message.guild.id);

    let serverBest = await mostVoted.filter(u => dGuild.members.cache.get(u.id) && !dGuild.members.cache.get(u.id).user.bot)


    let serverPos = serverBest.indexOf(serverBest.find(v => v.id == message.author.id)) + 1;

    serverBest = serverBest.slice(0, 10);
    for (let j = 0; j < serverBest.length; j++) {
      let user0 = await client.users.fetch(serverBest[j].id, true);
      serverBest[j].tag = user0.tag;
    }

    let messageContent2 = "";

    serverBest.forEach((voted, index) => {
      if (voted.tag == message.author.tag) {
        messageContent2 += `**${serverPos}. ${message.author.tag}**: ${voted.upvotes
          .length - voted.downvotes.length}\n`;
      } else {
        messageContent2 += `**${index + 1}.** ${voted.tag}: ${voted.upvotes.length - voted.downvotes.length}\n`;
      }
    });
    if (serverBest.length < 3) {
      messageContent2 += `Missing data, not enough votes stored.\n`;
    }
    if (serverPos > serverBest.length) {
      messageContent2 += `**${serverPos}. ${message.author.tag}**: ${vote.upvotes
        .length - vote.downvotes.length}`;
    }

    let embed = new Discord.MessageEmbed()
      .setThumbnail(message.guild.iconURL)
      .setTitle(`Votes | Top 10`)
      .setURL("https://drep.me/leaderboard/votes")
      .addField("Top Server", messageContent2)
      .addField("Top global?", `\`${guild.prefix}top global\``)
      .setColor("#ffb300")
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setTimestamp();
    message.channel.send(embed);
  }
};

module.exports.help = {
  name: "top",
  aliases: ["leaderboard", "topvotes", "lb"],
  usage: "top global/server",
  description: "Check the leaderboard of votes",
  perms: 0
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 10000
}