var express = require("express");
var alexa = require("alexa-app");
var bodyParser = require("body-parser");
var rp = require('request-promise');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

const ENABLE_CMD = "http://server.switcher.co.il/Switcher/appServiceSetSwitchState?token=1455239767592&switchId=1429959227412&state=on"
const DISABLE_CMD = "http://server.switcher.co.il/Switcher/appServiceSetSwitchState?token=1455239767592&switchId=1429959227412&state=off"
const ENABLE_DURATION = "http://server.switcher.co.il/Switcher/setSpontaneousEvent?token=1455239767592&switchId=1429959227412&isManual=true&duration=600000"
const GET_STATE = "http://server.switcher.co.il/Switcher/appServiceGetSwitchState?token=1455239767592&switchId=1429959227412"

var alexaApp = new alexa.app("SwitcherDud");
alexaApp.launch(function(request, response) {
  response.say("You launched the app!");
});

alexaApp.dictionary = { "start_synonym": ["turn on", "start", "enable"], "stop_synonym": ["turn off", "stop", "disable"] };

alexaApp.intent("GetDoodStatus", {
    "slots": { },
    "utterances": [
      "status"
    ]
  },
  function(req, res) {
    rp(GET_STATE).then(function (body) {
      parsed_body = JSON.parse(body);
      state = parsed_body["state"];

      if (state == "on") {
        console.log("Dood is on")

        res.say("Dood is on");
      } else {
        console.log("Dood is off")

        res.say("Dood is off");
      }
    }).catch(function (err) {
      console.log(err)

      res.say("Cannot get state");
    });

    res.say("Dood is dood");
  }
);

alexaApp.intent("EnableDood", {
    "slots": { },
    "utterances": [
      "{start_synonym}"
    ]
  },
  function(req, res) {
  	request(ENABLE_CMD, function (error, response, body) {
  		if (error || response.statusCode != 200) {
  			res.say("Dood was not turned on");
  		} else {
  			res.say("Dood was turned on successfully!");
  		}
	})
  }
);

alexaApp.intent("EnableDoodWithDuration", {
    "slots": {
          "name": "Duration",
          "type": "AMAZON.DURATION"
        },
    "utterances": [
      "start for {Duration}"
    ]
  },
  function(req, res) {
    res.say("enable for duration");
    // request(ENABLE_DURATION, function (error, response, body) {
    //   if (error || response.statusCode != 200) {
    //     response.say("Dood was not turned on");
    //   } else {
    //     response.say("Dood was turned on successfully!");
    //   }
  // })
  }
);

alexaApp.intent("DisableDood", {
    "slots": { },
    "utterances": [
      "{stop_synonym}"
    ]
  },
  function(req, res)  {
  	request(DISABLE_CMD, function (error, response, body) {
  		if (error || response.statusCode != 200) {
  			res.say("Dood was not turned off");
  		} else {
  			res.say("Dood was turned off successfully!");
  		}
	})
  }
);

alexaApp.express(app, "/echo/");

app.listen(PORT);
console.log("Listening on port " + PORT);