'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

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
	if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Wrong token!');
});


const token = "EAAJL7l1CkEsBAPVosMfliFQqZCHB7N1PaZALO6dIAaZCzXDHT559PVddCzZCMHYpvTJniWZARvYTYzM8vFKX5J0YwHnUcHQ4ratKXSKK6qfPb3Nlclo2Pdvfi5IDucfGbjZA2UMil7SzLtp9yOfxrteaTAiDXEjWRCTyGQSERovKvS6cf0ogaLOZCOfqjm9QFEZD";

app.post('/webhook/', function(req, res) {
    var messaging_events = req.body.entry[0].messaging;
  //  for (var i = 0; i < messaging_events.length; i++) {
  //      var event = req.body.entry[0].messaging[i];
  //      var sender = event.sender.id;
  //      if (event.message && event.message.text) {
  //          var text = event.message.text;
  //          sendTextMessage(sender, text + "!");
  //      }
  //  }
    var event = req.body.entry.messaging[0];
    var sender = event.sender.id;
    var text = event.message.text;
    senTextMessage(sender, text+"!");
    res.sendStatus(200);
});
function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
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
            console.log('Error:', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
