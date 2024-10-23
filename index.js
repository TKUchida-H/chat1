// This is a test comment
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};

const app = express();
app.use(express.json());

let userSessions = {};

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  const userId = event.source.userId;
  if (!userSessions[userId]) {
    userSessions[userId] = true;
    const responseMessage = {
      type: 'text',
      text: 'メッセージをお送りいただきありがとうございます。内容詳細を確認し、改めて返答させていただきます。'
    };
    return client.replyMessage(event.replyToken, responseMessage);
  } else {
    return Promise.resolve(null);
  }
}

app.listen(3000, () => {
  console.log('App running on port 3000');
});