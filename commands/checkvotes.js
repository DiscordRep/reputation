const Users = require("../models/users");
const Votes = require("../models/votes");

exports.run = async (client, guild, message, args) => {
  let dUser = await Users.findOne({ id: message.author.id });
  if (!dUser || !dUser.drepPlus || !dUser.drepPlus.active) return message.channel.send("You don't have DR Plus, it can be purchased here: <https://drep.me/pricing>!");

  let votes = await Votes.findOne({
    id: message.author.id
  });

  let content = `UPVOTES:
`;
  votes.upvotes.forEach(v => {
    content += `${v.id}
`;
  });
  content += `
DOWNVOTES:
`;
  votes.downvotes.forEach(v => {
    content += `${v.id}
`;
  });
  try {
    message.author.send("Download :", {
      files: [{ attachment: Buffer.from(content), name: "votes.txt" }]
    });
    message.channel.send("Check your DMs to see who have upvoted/downvoted you.");
  } catch {
    message.channel.send("We were not able to send you a DM.");
  }
};

module.exports.help = {
  name: "checkvotes",
  aliases: ["cvote", "cvotes", "checkvote,", "votecheck", "checkv", "cv"],
  usage: "checkvote",
  description: "Check your votes",
  perms: 0
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 5000
}
