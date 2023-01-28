// Create a Discord Bot using OpenAI API that interacts on the Discord Server

import express from "express";
// import pkg from "cors";
// const { cors } = pkg;

// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
// app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Exo",
  })
});

// const hljs = require('highlight.js');
// const lang = process.argv[3];


// Prepare to connect to the Discord API
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Prepare to connect to the OpenAI API
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// client.on('ready', () => {
//   console.log('Logged in as '+ client.user.tag)
//   client.user.setActivity('Serving '+ client.guilds.cache.size +' servers');

//   client.guilds.cache.forEach((val, inx) => {
//       console.log('Server:', val.name)
//       console.log('ServerID: ', inx)

//       console.log('# List all users out from the server')
//       val.members.cache.forEach((val, inx) => {
//           console.log('UserID: ', inx)
//           console.log('Username: ', val.user.username)
//       })

//       console.log('# List all channels out from the server')
//       val.channels.cache.forEach((val, inx) => {
//           console.log('ChannelID:', inx)
//           console.log('Channel Name:', val.name)
//           console.log('Channel Type:', val.type)
//       })

//       client.channels.cache.get(process.env.CHANNEL2_ID).send('@Owner the bot is online and ready to help! :)')
//   })
// })


// Check for when a message has been received on discord
client.on("messageCreate", async function (message) {
  try {
    // dont respond to yourself or other bots
    if (message.author.bot) return;


    // Check if the bot is in right channel
    const id1 = process.env.CHANNEL_ID;
    const id2 = process.env.CHANNEL2_ID;
    if (message.channel.id !== id1 && message.channel.id !== id2) return;
    const gptResponse = await openai.createCompletion({
      // model: "davinci",
      model: "text-davinci-003",
      // model: "code-davinci-002",
      prompt: `ChatGPT: Hello how are you?\n\
                ${message.author.username}: ${message.content}\n\
                ChatGPT:`,
      temperature: 0.7,
      max_tokens: 2000,
      // format: 'markdown',
      stop: ["ChatGPT", "Flexi:"],
    });

    const datax = `${gptResponse.data.choices[0].text}`;


    // To get the code with highlight syntax - only works if you show this in frontend
    // var code = datax;
    // var code = hljs.highlight(datax, {language: "javaScript", ignoreIllegals: true }).value;
    // console.log(code);

    // To get the discord channel id
    // const myMessage = `${message.channel.id}`;

    message.reply("```"+datax+"```");
    return;
  } catch (err) {
    console.log(err);
  }
});

// Log the bot into Discord
// console.log(process.env.DISCORD_TOKEN);
console.log("its done now");
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");

app.listen(5000, () => {
  console.log("server is running on port http://localhost:5000");
});
