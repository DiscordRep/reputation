const dotenv = require('dotenv');

dotenv.config();

let config = {
  token: process.env.BOTTOKEN,
  mongodb: process.env.MONGODB,
  webhookAuth: process.env.WEBHOOAUTH,
  dblToken: process.env.DBLTOKEN,
  domain: process.env.DOMAIN,
  dreptoken: process.env.DRTOKEN,

  admins: ["595366004423524353", "538855659714641960"],
  prefix: process.env.PREFIX,
  missingperms: "Unauthorized action",
  wrongUsage: "Wrong usage, correct usage: ",

  react: {
    upvote: "627662811467874314",
    downvote: "627662782556274688"
  },

  emojis: {
    success: "<a:success:627662847375310858>",
    error: "<:error:627885008564125726>",
    banned: "<:banned:627885008807264297>",
    warned: "<:warned:627885008639623168>",
    user: "<:user:627885008358604828>",
    upvote: "<:up:<a:drUp:666665408211714069>",
    downvote: "<a:drDown:666665497709903872>",
    xp: "<a:xp:627672260764893184>",
    noreputation: "<:Coal:627673938817843279>",
    bronze: "<:bronze:627663314234638346>",
    silver: "<:silver:627663314234769428>",
    gold: "<:gold:627663052682297355>",
    platinum: "<:platinum:717463574439657482>",
    titan: "<:titan:717463933845504094>",
    diamond: "<:diamond:627663314352078858>",
    champion: "<:champion:694982326144204911>",
    grandchampion: "<:grandchampion:717464167711244371>",
    administrator: "<:admin:663005629287366656>",
    drplus: "<:DRPlus:702096093915250739>",
    mod: "🛂",
    bot: "🤖",
    partner: "🤝",
    donator: "💰",
    verified: "✅"
  },

  image: {
    admin: "https://cdn.discordapp.com/emojis/663005629287366656.png?v=1",
    mod: "https://cdn.discordapp.com/emojis/712677858903851058.png?v=1",
    bot: "https://cdn.discordapp.com/emojis/712678675283181598.png?v=1",
    partner: "https://cdn.discordapp.com/emojis/712678883131916288.png?v=1",
    donator: "https://cdn.discordapp.com/emojis/712679021812383818.png?v=1",
    verified: "https://cdn.discordapp.com/emojis/603661289671098368.png?v=1",
    drepPlus: "https://cdn.discordapp.com/emojis/702096093915250739.png?v=1",
    user: "https://cdn.discordapp.com/emojis/712687821592461464.png?v=1"
  },

  channels: {
    commandsLog: "627890310013386758",
    announcements: "653239826602131469"
  }


}
module.exports = config
