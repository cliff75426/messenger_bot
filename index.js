
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
var counter = 0;
app.set('port', (process.env.PORT || 8000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Home
app.get('/', function (req, res) {
	res.send('Hello world!');
});
// Start the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});


app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Wrong token!');
});



app.post('/webhook/', function(req, res) {

  var data = req.body;
  console.log(data);
  if(data && data.object === 'page'){
    data.entry.forEach(function(entry){
      var pageID = entry.id;
      entry.messaging.forEach(function (event){
        if(event.message){
          handleMessage(event);
        }else if(event.postback && event.postback.payload){
          handlePostback(event);
        }
      })
    })
    res.sendStatus(200);
  }
});




function handleMessage(event){

  var senderID = event.sender.id;
  var received_message = event.message;

  if(received_message.text){

    switch (received_message.text){
      case '你好' :
        sendTextMessage(senderID, "我很好喔，那你呢？");
        break;
      case 'structure' :
        sendStructuredMessage(senderID);
        break;
    }

  }else if(received_message.attachments){
    sendTextMessage(senderID, "this is attachments");
  }
}

function sendTextMessage(senderID,messageText){
  var messageData = {
    recipient:{
        id: senderID
      },
      message:{
        text: messageText
      }
  };

  callSenderAPI(messageData);
}

function sendStructuredMessage(senderID){

  var messageData = {
    recipient:{
      id: senderID
    },
    message:{
      attachment:{
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Is this the right picture?",
            subtitle: "tap a button to answer.",
            image_url: "https://www.haskell.org/happy/Happy.gif",
            buttons :[
              {
                type: "postback",
                title: "YES!",
                payload "yes"
              },
              {
                type: "postback",
                title: "NO!",
                payload: "no"
              }
            ]
          }]
        }
      }
    }
  };

  callSenderAPI(messageData);
}

function handlePostback(event){

  var payload = event.postback.payload;
  if(payload == 'yes'){
    sendTextMessage(event.sender.id,'This is button yes');
  }else if(payload == 'no'){
    sendTextMessage(event.sender.id, 'This is button no');
  }

}

function callSendAPI(messageData){

  request({
      url: 'https://graph.facebook.com/v3.0/me/messages',
      qs: {
          access_token:  process.env.PAGE_ACCESS_TOKEN
      },
      method: 'POST',
      json: {
          recipient: {
              id: sender
          },
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('messageError:'+messageData.text);
          console.log('Error:', error);
      } else if (response.body.error) {
          console.log('messageBodyError'+messageData.text);
          console.log('Error: ', response.body.error);
      }
  });

}
