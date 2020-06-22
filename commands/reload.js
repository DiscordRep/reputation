const Users = require("../models/users");

exports.run = async (client, guild, message, args) => {
  let admin = await Users.findOne({ id: message.author.id })
  if (!admin) return message.channel.send("Missing permission!")
  if (!admin.admin) return message.channel.send("Missing permission!")
  if (!args[0]) return message.channel.send("Missing command name!")
  const commandName = args[0];
  if (!client.commands.has(commandName)) {
    return message.reply("Command not found.");
  }
  delete require.cache[require.resolve(`./${commandName}.js`)];
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  if (props.aliases) {
    props.aliases.forEach(alias => client.aliases.set(alias, commandName))
  }
  message.reply(`\`${commandName}\` has been reloaded.`);
}


module.exports.help = {
  name: "reload",
  aliases: [],
  usage: "reload cmd",
  description: "Reload any command",
  perms: 5
};

module.exports.limits = {
  rateLimit: 10,
  cooldown: 5000
}