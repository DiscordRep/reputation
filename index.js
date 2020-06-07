const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");

const config = require("./config");
const dblVotes = require("./models/dblvotes");
const Users = require("./models/users");
const DblVotes = require("./models/dblvotes");

const app = express();
const port = 3020;
const client = new Discord.Client({ disableEveryone: true });
mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.login(config.token);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.perms = new Discord.Collection();
client.limits = new Discord.Collection();
client.events = new Discord.Collection();

client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof evaled !== "string") text = require("util").inspect(text, { depth: 0 });

    text = text.replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, "Unauthorized action");

    return text;
};


client.throw = async (message, errorType, errorMessage) => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`${config.emojis.error} ${errorType}`)
        .setDescription(errorMessage)
        .setColor("RED")
        .setTimestamp();
    message.channel.send(embed);
};

client.activeUser = [];

client.save = async () => {
    await client.activeUser.forEach(async (mUser) => {

        let dblvote = dblVotes.findOne({
            id: mUser.id
        });

        let user = Users.findOne({
            id: mUser.id
        });

        let messages = mUser.messages;
        if (user && user.drepPlus && user.drepPlus.active) {
            messages *= 2;
        }
        if (dblvote && dblvote.lastVote + 43200000 > Date.now()) {
            messages *= 2;
        }
        mUser.messages = messages;

        if (mUser.messages >= 99766) {
          mUser.reputation = 22; //Grand Champion
        }
        else if (mUser.messages >= 84461) {
          mUser.reputation = 21 //Champion 3
        }
        else if (mUser.messages >= 75469) {
          mUser.reputation = 20 //Champion 2
        }
        else if (mUser.messages >= 68424) {
          mUser.reputation = 19 //Champion 1
        }
        else if (mUser.messages >= 59007) {
          mUser.reputation = 18 //Diamond 3
        }
        else if (mUser.messages >= 54649) {
          mUser.reputation = 17 //Diamond 2
        }
        else if (mUser.messages >= 48406) {
          mUser.reputation = 16 //Diamond 1
        }
        else if (mUser.messages >= 42442) {
          mUser.reputation = 15 //Titan 3
        }
        else if (mUser.messages >= 38271) {
          mUser.reputation = 14 //Titan 2
        }
        else if (mUser.messages >= 34529) {
          mUser.reputation = 13 //Titan 1
        }
        else if (mUser.messages >= 29128) {
          mUser.reputation = 12 //Platinum 3
        }
        else if (mUser.messages >= 25073) {
          mUser.reputation = 11 //Platinum 2
        }
        else if (mUser.messages >= 21794) {
          mUser.reputation = 10 //Platinum 1
        }
        else if (mUser.messages >= 17948) {
          mUser.reputation = 9 //Gold 3
        }
        else if (mUser.messages >= 15592) {
          mUser.reputation = 8 //Gold 2
        }
        else if (mUser.messages >= 12421) {
          mUser.reputation = 7 //Gold 1
        }
        else if (mUser.message >= 9619) {
          mUser.reputation = 6 //Silver 3
        }
        else if (mUser.message >= 8029) {
          mUser.reputation = 5 //Silver 2
        }
        else if (mUser.messages >= 4118) {
          mUser.reputation = 4 //Silver 1
        }
        else if (mUser.message >= 2588) {
          mUser.reputation = 3 //Bronze 3
        }
        else if (mUser.message >= 1660) {
          mUser.reputation = 2 //Bronze 2
        }
        else if (mUser.messages >= 1045) {
          mUser.reputation = 1 //Bronze 1
        }

        await mUser.save().catch(e => console.log(e));
    });
    client.activeUser = [];
}

setInterval(() => {
    client.save()
}, 300000)

fs.readdir(__dirname + "/commands/", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        if (props.help.aliases) {
            props.help.aliases.forEach(alias => client.aliases.set(alias, commandName));
        };
    });
});

fs.readdir(__dirname + '/events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, ...args));
    });
});

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("It's working.");
});


//Upvoting on DiscordBots.org
app.use('/hook', async (req, res) => {
    //if (req.headers.authorization != config.webhookAuth) return res.send({code: "invalid auth"});
    console.log(1)
    var user_id = req.body.user;
    var bot = req.body.bot;
    let vote = await DblVotes.findOne({ id: user_id });
    if (vote) {
        await DblVotes.findOne({ id: user_id }, async (err, avote) => {

            avote.lastVote = Date.now();
            avote.totalVotes += 1;
            await avote.save().catch(e => console.log(e));
        });
    } else {
        let newvote = new DblVotes({
            id: user_id,
            lastVote: Date.now(),
            totalVotes: 1
        });
        await newvote.save().catch(e => console.log(e));
    }
    console.log(req.body)
    let user = await client.users.fetch(user_id);
    try {
        if (!vote) {
            return user.send("Thanks for voting to Reputation Bot, as a reward, you will receive " + config.emojis.success + " **'VERIFIED'** badge on your profile for 24 hours, and 2X XP boost for 12 hours.")
        }
    } catch (e) {
        console.log(e);
    }
    res.status(200).send("ok");
});


app.listen(port, () => console.log(`Webhook listening on port ${port}!`))

module.exports = client
