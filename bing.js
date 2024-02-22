const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bing",
    aliases: ["dalle", "dalle3"],
    version: "2.0",
    author: "RUBISH",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Latest DALL·E 3 image generator",
    },
    guide: {
      en: "{pn} 'prompt' ",
    },
    category: "Bing",
  }, 
  onStart: async function ({ message, event, api, args }) {
    const q = args.join(" ");
        const permission = global.GoatBot.config.vipUser;
    if (!permission.includes(event.senderID)) {
      api.sendMessage(q, event.threadID, event.messageID);
      return;
    }
    try {
      if (args.length === 0) {
        await message.reply("⚠ | Please provide a prompt.");
        return;
      }

      const prompt = args.join(" ");
      const encodedPrompt = encodeURIComponent(prompt);
      const apiKey = "rubish69";
      const cookies = [
"175aRTI7KvsWUgC-cb4pH1xf7ixFYrDEMZIfoHueFSTWuM8vwE_itgzU8MUJ366oK_Gz5AZusssw4mcmLMeSoNTgW2DC3c6st-4JKHsB3ARWW97UHnC0WOTks-ApGAZSPL8ARJEccjCfd0D-qIJrpsFp3KVuCibzKPFVXa6e97_X7jYAXbXrZD7NjxhwNXN8QItbV4Fsqv7ObKz25cP_-WQ",
"1PulOLvRJoADicSgg6AHLibQ-maYth48Etid-oklg-g18Dh3aQGTu_aDUwHj7HpXFAoEBq_mPF9Xr7QC1Y5Zj5txHmRvk3dmirdmPnTjdZI-7ep5ASDWJqEgCoG09_dv1Ghg8Zg9xFzyZ6KL-uZEadO4sxPEDV-YXc6m6jbO82eYTB4WfV30rCoOkzTKxzCb3L7_xbYQa0HqOmGEbylKRcw"
];

      const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];

      const apiURL = `https://dall-e-3-rubish.onrender.com/api/gen-img-url?prompt=${encodedPrompt}&cookie=${randomCookie}&apiKey=${apiKey}`;

      const startTime = Date.now();
      const processingMessage = await message.reply(`
⏳ | Processing your imagination

❏ Prompt: ${prompt}

❏ Please wait a few seconds...`);

      const response = await axios.get(apiURL);

      const endTime = Date.now();
      const processingTimeInSeconds = ((endTime - startTime) / 1000).toFixed(2);

      const data = response.data;
      if (!data.imageLinks || data.imageLinks.length === 0) {
        if (data.errorMessage === "Invalid API key") {
          await message.reply("⚠ | Invalid API key. Please check your API key and try again.");
        } else {
          await message.reply(`
⭕ | No images found for the

❏ prompt: ${prompt}.

❏ Please try again.`);
        }
        return;
      }

      const attachment = await Promise.all(data.imageLinks.map(async (imgURL) => {
        const imgStream = await getStreamFromURL(imgURL);
        return imgStream;
      }));

      await message.reply({
        body: `
✅ | Here are the images for..

❏ Prompt: "${prompt}"

❏ Processing Time: ${processingTimeInSeconds}s`,
        attachment: attachment,
      });

      message.unsend((await processingMessage).messageID);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 401) {
        await message.reply("⚠ | Unauthorized your API key \\Contact with Rubish for a new apikey");
      } else if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errorMessage === "Pending") {
          await message.reply("⚠ | This prompt has been blocked by Bing. Please try again with another prompt.");
        } else if (typeof responseData === 'object') {
          const errorMessages = Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join('\');
          await message.reply(`⚠ | Server error details:\\${errorMessages}`);
        } else if (error.response.status === 404) {
          await message.reply("⚠ | The DALL·E 3 API endpoint was not found. Please check the API URL.");
        } else {
          await message.reply(`⚠ | Rubish dalle -3 server busy now\\Please try again later`);
        }
      } else {
        await message.reply("⚠ | An unexpected error occurred. Please try again later.");
      }
    }
  }
};
