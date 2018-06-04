
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
	if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Wrong token!');
});


const token = "EAAJL7l1CkEsBAPVosMfliFQqZCHB7N1PaZALO6dIAaZCzXDHT559PVddCzZCMHYpvTJniWZARvYTYzM8vFKX5J0YwHnUcHQ4ratKXSKK6qfPb3Nlclo2Pdvfi5IDucfGbjZA2UMil7SzLtp9yOfxrteaTAiDXEjWRCTyGQSERovKvS6cf0ogaLOZCOfqjm9QFEZD";
//const token = "11111";
app.post('/webhook/', function(req, res) {
    counter+=1;
    console.log(counter);
    console.log(req.body);
  for(var key in req.body.entry[0]){
    console.log(req.body.entry[0][key]);
  }
    var messaging_events = req.body.entry[0].standby;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].standby[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, text + "!");
        }
    }
    console.log("fuck test");
  //  var event = req.body.entry[0].messaging[0];
  //  var senderID = event.sender.id;
  //  var text = "fuck!!";
  //  senTextMessage(senderID, text+"!");
    res.sendStatus(200);
});
function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v3.0/me/messages',
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
            console.log('messageError:'+messageData.text);
            console.log('Error:', error);
        } else if (response.body.error) {
            console.log('messageBodyError'+messageData.text);
            console.log('Error: ', response.body.error);
        }
    });
}
