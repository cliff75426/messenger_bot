var apiai = require('apiai');


const dialogflow = apiai("6522ed4d07fe42f09edd4963b477b2ca","2bec7b4562fa4c6e81db5188e5c54713");

var received_message = "幫我查高雄到嘉義";

var request = dialogflow.textRequest(received_message, {sessionId: "testtest"});
console.log("123456789");

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

