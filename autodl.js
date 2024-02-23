const axios = require('axios');
const fs = require('fs');
const { shorten } = require('tinyurl');

module.exports.config = {
    name: "autodl", 
    version: "1.0.1",
    credit: "Rômeo",
    cooldowns: 0,
    hasPermission: 0,
    usePrefix: false, 
    description: "Auto download video from tiktok, facebook, Instagram, YouTube, and more",
    commandCategory: "media",
    usage: "[video_link]" ,
};
  
  module.exports.handleEvent = async function ({ api, event, __Global, __GLOBAL }) {

let dipto = event.body ? event.body : '';

  try {
    if (dipto.startsWith('https://vt.tiktok.com') || dipto.startsWith('https://www.tiktok.com/') || dipto.startsWith('https://www.facebook.com') || dipto.startsWith('https://www.instagram.com/') || dipto.startsWith('https://youtu.be/') || dipto.startsWith('https://youtube.com/') || dipto.startsWith('https://x.com/') || dipto.startsWith('https://twitter.com/') || dipto.startsWith('https://vm.tiktok.com') || dipto.startsWith('https://i.imgur.com') || dipto.startsWith('https://fb.watch')){

      { api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      }
    const path = __dirname + `/cache/diptoo.mp4`;

    const aa = await axios.get(`https://d1pt0-all.onrender.com/xnxx?url=${encodeURIComponent(dipto)}`);

    const bb = aa.data;
    const res = aa.data.result;
    const shortUrl = await shorten(res);
    const messageBody = `✅ | Download Url: ${shortUrl}`;
      
    const vid = (await axios.get(bb.result, { responseType: "arraybuffer", })).data;

    fs.writeFileSync(path, Buffer.from(vid, 'utf-8'));
      { api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      }
    api.sendMessage({

        body: `
☂ | ${bb.cp}
♻ | Author: ${bb.author}
${messageBody}
            `,

      attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID)}

if (dipto.startsWith('https://i.imgur.com')){

  const dipto3 = dipto.substring(dipto.lastIndexOf('.'));

  const response = await axios.get(dipto, { responseType: 'arraybuffer' });

const filename = __dirname + `/cache/dipto${dipto3}`;

    fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
    api.sendMessage({body: `✅ | Downloaded from link`,attachment: fs.createReadStream(filename)},event.threadID,

  () => fs.unlinkSync(filename),event.messageID)

}

} catch (e) {
    { api.setMessageReaction("❎", event.messageID, (err) => {}, true);
    }
api.sendMessage(e, event.threadID, event.messageID);
  }
  },

module.exports.run = async function ( api, event , __GLOBAL, __Global ) {},
