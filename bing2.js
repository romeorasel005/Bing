const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bing2",
    aliases: ["dalle2"],
    version: "2,0",
    author: "RUBISH",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Latest DALL·E 3 image generator",
    },
    guide: {
      en: "{pn} 'prompt' ",
    },
    category: "AI",
  },
  onStart: async function ({ message, args }) {
    try {
      if (args.length === 0) {
        await message.reply("⚠️ | Please provide a prompt.");
        return;
      }

      const prompt = args.join(" ");
      const encodedPrompt = encodeURIComponent(prompt);
      const apiKey = "rubish69";
      const cookies = ["1fwwZzh5fE1rvKDSlL2OZTrw76Ue0-YkJoKWlbXGQHcPZ_fjZqbUzYLfl8zLkVeum5wDLybwmLUvbXpPOm4WH556yokkhXbf0jzJ8qg73Jpk0f0z_YtB-f3LZcjTqRI1qT8WPGtk52VXjfU4BMPEdvJZDA96j-_Iu_Hyr9I6uwzgF8foHtVUmW6zK2WNhCV-DKicxXnW64xM572Js2Jt46Q",
"1G_7NBpKA8rAWRu7yayAXoW1eKkUQZaY1tq9g3fKybdM9quL-BtccBICJ-KSIU5Gvcr-upS_5RlN0cWzclmDVGbzwKX4w9tAQOBM94xl_YfVg-M9gk4lK3fNzuELWefNmfh3FeezMQyGIX9rI-gUSTek1Bj0_yBXMICInOQTkJYVUHbAfaauXJGwR52mCU8LNMGdXp60uxNjrteiSzi20MBxsLJ-psJTVeonY_gnhJT8",


]; 

      const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];

      const apiURL = `https://dall-e-3-rubish.onrender.com/api/gen-img-url?prompt=${encodedPrompt}&cookie=${randomCookie}&apiKey=${apiKey}`;

      const startTime = Date.now();
      const processingMessage = await message.reply(`
⏳ | Processing your imagination

Prompt: ${prompt}

Please wait a few seconds...`);

      const response = await axios.get(apiURL);

      const endTime = Date.now();
      const processingTimeInSeconds = ((endTime - startTime) / 1000).toFixed(2);

      const data = response.data;
      if (!data.imageLinks || data.imageLinks.length === 0) {
        if (data.errorMessage === "Invalid API key") {
          await message.reply("⚠️ | Invalid API key. Please check your API key and try again.");
        } else {
          await message.reply(`
⭕ | No images found for the 

prompt: ${prompt}. 

Please try again.`);
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

Prompt: "${prompt}" 

Processing Time: ${processingTimeInSeconds}s`,
        attachment: attachment,
      });

      message.unsend((await processingMessage).messageID);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 401) {
        await message.reply("⚠️ | Unauthorized your API key \n\nContact with Rubish for a new apikey");
      } else if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errorMessage === "Pending") {
          await message.reply("⚠️ | This prompt has been blocked by Bing. Please try again with another prompt.");
        } else if (typeof responseData === 'object') {
          const errorMessages = Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join('\n');
          await message.reply(`⚠️ | Server error details:\n\n${errorMessages}`);
        } else if (error.response.status === 404) {
          await message.reply("⚠️ | The DALL·E 3 API endpoint was not found. Please check the API URL.");
        } else {
          await message.reply(`⚠️ | Rubish dalle -3 server busy now\n\nPlease try again later`);
        }
      } else {
        await message.reply("⚠️ | An unexpected error occurred. Please try again later.");
      }
    }
  }
};
