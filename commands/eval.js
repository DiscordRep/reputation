const Discord = require("discord.js");
const Users = require("../models/users");
const Bans = require("../models/bans");
const Warns = require("../models/warns");
const Messages = require("../models/messages");
const Votes = require("../models/votes");
const Comments = require("../models/comments");
const Guilds = require("../models/gconfig");
const config = require("../config");
const moment = require("moment");


exports.run = async (client, guild, message, args) => {
  let admin = await Users.findOne({ id: message.author.id })
  if (!admin) return message.channel.send("Missing permission!")
  if (!admin.admin) return message.channel.send("Missing permission!")
  if (!args[0]) return message.channel.send("Missing arguments!")
  const code = args.join(" ");
  const start = startTimer();
  try {
    const evaluat = async (c) => eval("(async () => {" + c + "})()");
    const evaled = await evaluat(code);
    const clean = await client.clean(client, evaled);

    const MAX_CHARS = 3 + 2 + clean.length + 3;
    if (MAX_CHARS > 1500) {
      return message.channel.send("Output :", { files: [{ attachment: Buffer.from(clean), name: "eval.txt" }] });
    }
    if (endTimer(start) > 1) {
      message.channel.send(`Input:\`\`\`js\n${code}\n\`\`\`\nOutput:\`\`\`js\n${clean}\n\`\`\`\n⏱ ${endTimer(start)} ms`);
    } else {
      message.channel.send(`Input:\`\`\`js\n${code}\n\`\`\`\nOutput:\`\`\`js\n${clean}\n\`\`\`\n⏱ ${endTimer(start) * 1000} μs`);
    }
  } catch (err) {
    if (endTimer(start) > 1) {
      message.channel.send(`Input:\`\`\`js\n${code}\n\`\`\`\nOutput:\`\`\`xl\n${err}\n\`\`\`\n⏱ ${endTimer(start)} ms`);
    } else {
      message.channel.send(`Input:\`\`\`js\n${code}\n\`\`\`\nOutput:\`\`\`xl\n${err}\n\`\`\`\n⏱ ${endTimer(start) * 1000} μs`);
    }
  }



}

function startTimer() {
  const time = process.hrtime();
  return time;
}

function endTimer(time) {
  function roundTo(decimalPlaces, numberToRound) {
    return +(Math.round(numberToRound + `e+${decimalPlaces}`) + `e-${decimalPlaces}`);
  }
  const diff = process.hrtime(time);
  const NS_PER_SEC = 1e9;
  const result = (diff[0] * NS_PER_SEC + diff[1]); // Result in Nanoseconds
  const elapsed = result * 0.0000010;
  return roundTo(6, elapsed).toFixed(6); // Result in milliseconds
}

module.exports.help = {
  name: "eval",
  aliases: ["ev"],
  usage: "eval evaluation",
  description: "Do evaluations",
  perms: 5
};

module.exports.limits = {
  rateLimit: 10,
  cooldown: 5000
}
