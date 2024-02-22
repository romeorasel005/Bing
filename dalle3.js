const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "dalle3",
    aliases: ["dalle"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    shortDescription: "Generate images by Dalle3",
    longDescription: "Generate images by Dalle3",
    category: "download",
    guide: {
      en: "{pn} prompt"
    }
  },

  onStart: async function ({ api, message, args }) {
    try {
      const p = args.join(" ");
  
      const w = await message.reply("Please wait...");

      // const cookieString = await fs.readFile('dallekey.json', 'utf-8');
      // const cookie = JSON.parse(cookieString);

      const data2 = {
        prompt: p,
        cookie: 
"1PulOLvRJoADicSgg6AHLibQ-maYth48Etid-oklg-g18Dh3aQGTu_aDUwHj7HpXFAoEBq_mPF9Xr7QC1Y5Zj5txHmRvk3dmirdmPnTjdZI-7ep5ASDWJqEgCoG09_dv1Ghg8Zg9xFzyZ6KL-uZEadO4sxPEDV-YXc6m6jbO82eYTB4WfV30rCoOkzTKxzCb3L7_xbYQa0HqOmGEbylKRcw",
"1DDZETZ_Sol5SJ0a9L685Qxv1wx_K1hIdZbqxa3-CzGvxuRmoLIvAME5zFEbXeiBqfsKA2hA8YtSjMGvL8rJDvOBbF150f2x12nkwzKLq3yn99KmVPTNazRvMChvnQLmNOVF9Mt1eSOAkaGaYOTm-zjp9o9sH-3Zx_rkJ4-XSt8egqo9LCIyG0bmJZYGV738RVS03VQzMIVbFuj883nMYJA",
"175aRTI7KvsWUgC-cb4pH1xf7ixFYrDEMZIfoHueFSTWuM8vwE_itgzU8MUJ366oK_Gz5AZusssw4mcmLMeSoNTgW2DC3c6st-4JKHsB3ARWW97UHnC0WOTks-ApGAZSPL8ARJEccjCfd0D-qIJrpsFp3KVuCibzKPFVXa6e97_X7jYAXbXrZD7NjxhwNXN8QItbV4Fsqv7ObKz25cP_-WQ",
"175aRTI7KvsWUgC-cb4pH1xf7ixFYrDEMZIfoHueFSTWuM8vwE_itgzU8MUJ366oK_Gz5AZusssw4mcmLMeSoNTgW2DC3c6st-4JKHsB3ARWW97UHnC0WOTks-ApGAZSPL8ARJEccjCfd0D-qIJrpsFp3KVuCibzKPFVXa6e97_X7jYAXbXrZD7NjxhwNXN8QItbV4Fsqv7ObKz25cP_-WQ"
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.post('https://project-dallee3.onrender.com/dalle', data2, config);
  
      if (response.status === 200) {
        const imageUrls = response.data.image_urls.filter(url => !url.endsWith('.svg'));
        const imgData = [];
  
        for (let i = 0; i < imageUrls.length; i++) {
          const imgResponse = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }
  
        await api.unsendMessage(w.messageID);
  
        await message.reply({
          body: `✅ | Generated`,
          attachment: imgData
        });
      } else {
        throw new Error("Non-200 status code received");
      }
    } catch (error) {
      return message.reply("Redirect failed! Most probably bad prompt.");
    }
  }
}