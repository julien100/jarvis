/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.e4019df7-07b4-4cb0-ade4-90ab666dcaec"; //replace with "amzn1.ask.skill.e4019df7-07b4-4cb0-ade4-90ab666dcaec";
const SHOW_PASSING_YARDS = ["Showing NFL passing yards statistic now. Is Russel Wilson leading again?",
                            "Sure. How is Tom Brady doing?"];
const POSITIVE_CONFIRMATIONS_EN = ["Sure!", "Of Course!", "Coming right away!"];
const POSITIVE_CONFIRMATIONS_DE = ["Ja!", "Klar!", "Natürlich!"];
const HELP_TEXT = ["I am Jarvis and I am happy to help you to make your life easier!"];

/*****/
//Environment Configuration
var config = {};
config.IOT_BROKER_ENDPOINT      = "a939rhv2v2rs6.iot.us-east-1.amazonaws.com".toLowerCase();
config.IOT_BROKER_REGION        = "us-east-1";
config.IOT_THING_NAME           = "pi";
//Loading AWS SDK libraries
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
//Initializing client for IoT
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});
var AlexaSkill = require('./AlexaSkill');

var Jarvis = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Jarvis.prototype = Object.create(AlexaSkill.prototype);
Jarvis.prototype.constructor = Jarvis;

Jarvis.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Jarvis onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Jarvis.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Jarvis onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hi, my name is Jarvis. I am Just A Rather Very Intelligent System. I am here to make your life easier. Pleasure to meet you.";
    var repromptText = "Tell me how I can help you.";
    response.ask(speechOutput, repromptText);
};

Jarvis.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Jarvis onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Jarvis.prototype.intentHandlers = {
    // register custom intent handlers
    "ShowingPassingYardsIntent": function (intent, session, response, locale) {
        console.log("ShowingPassingYardsIntent started");
        /****/
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "";
        var payloadObj = {"receiver": "VOICE_FOOTBALL", "command": "SHOW PASSING YARDS STATISTIC"}; //On
        //Prepare the parameters of the update call
        var paramsUpdate = {
            topic:"/pi",
            payload: JSON.stringify(payloadObj),
            qos:0
        };
        iotData.publish(paramsUpdate, function(err, data) {
          if (err){
            //Handle the error here
            console.log("MQTT Error" + data);
          }
          else {
            speechOutput = randomText(SHOW_PASSING_YARDS);
            console.log(data);
            response.tell(speechOutput);
            //callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          }
        });
    },
     "HideStatisticIntent": function (intent, session, response, locale) {
        console.log("HideStatisticIntent started");
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "";
        //Set the pump to 0 for activation on the device
        var payloadObj= {"receiver": "VOICE_FOOTBALL", "command": "HIDE STATISTIC"}; //off
         var paramsUpdate = {
            topic:"/pi",
            payload: JSON.stringify(payloadObj),
            qos:0
        };
        iotData.publish(paramsUpdate, function(err, data) {
          if (err){
            //Handle the error here
            console.log("MQTT Error" + data);
          }
          else {
            speechOutput = getPositiveConfirmation();
            console.log(data);
            response.tell(speechOutput);
            //callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          }
        });
        /****/
    },
      "ShowingRushingYardsIntent": function (intent, session, response, locale){
        console.log("ShowingRushingYardsIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "SHOW RUSHING YARDS STATISTIC"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "ShowingReceivingYardsIntent": function (intent, session, response, locale){
        console.log("ShowingReceivingYardsIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "SHOW RECEIVING YARDS STATISTIC"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "ShowingTacklesIntent": function (intent, session, response, locale){
        console.log("ShowingTacklesIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "SHOW TACKLES STATISTIC"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "ShowingSacksIntent": function (intent, session, response, locale){
        console.log("ShowingSacksIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "SHOW SACKS STATISTIC"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "ShowingInterceptionIntent": function (intent, session, response, locale){
        console.log("ShowingInterceptionIntent started");
        var payloadObj= {"receiver": "VOICE_FOOTBALL", "command": "SHOW INTERCEPTIONS STATISTIC"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "NflColorOnIntent": function (intent, session, response, locale){
        console.log("NflColorOnIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "COLOR ON"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "NflColorOffIntent": function (intent, session, response, locale){
        console.log("NflColorOffIntent started");
        var payload = {"receiver": "VOICE_FOOTBALL", "command": "COLOR OFF"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "NflShowHelmetsIntent": function (intent, session, response, locale){
        console.log("NflShowHelmetsIntent started");
        var payloadObj= {"receiver": "VOICE_FOOTBALL", "command": "SHOW HELMETS"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "NflShowLogosIntent": function (intent, session, response, locale){
        console.log("NflShowLogosIntent started");
        var payload= {"receiver": "VOICE_FOOTBALL", "command": "SHOW LOGOS"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
      "TagesschauIntent": function (intent, session, response, locale){
        console.log("StartTagesschauIntent started");
        var payload = {"receiver": "PODCAST", "command": "START_PODCAST"};
        standardResponse(payload, getPositiveConfirmation(locale), response);
    },
        "TvOffIntent": function (intent, session, response, locale){
        console.log("TvOnOffIntent started");
        var payload = getTVcommand("1");
        standardResponse(payload, "Of Course, turning off tv right now!", response);
    },
        "TvOnIntent": function (intent, session, response, locale){
        console.log("TvOnOffIntent started");
        var payload = {"receiver": "LGTV", "command": "ON"};
        standardResponse(payload, "Sure, turning on the tv now!", response);
    },
        "HideMirrorModuleIntent": function (intent, session, response, locale){
        console.log("HideMirrorModuleIntent started");
        var mirrorModule = intent.slots.MirrorModule.value
        var payload = {"receiver": "MQTT-SERVICE", "command": "HIDE_MODULE", "value": mirrorModule};
        standardResponse(payload,getPositiveConfirmation(locale) , response);
    },
        "ShowMirrorModuleIntent": function (intent, session, response, locale){
        console.log("HideMirrorModuleIntent started");
        var mirrorModule = intent.slots.MirrorModule.value
        var payload = {"receiver": "MQTT-SERVICE", "command": "SHOW_MODULE", "value": mirrorModule};
        standardResponse(payload,getPositiveConfirmation(locale) , response);
    },
        "WakeUpIntent": function (intent, session, response, locale){
        console.log("WakeUpIntent started");
        var payload = {"receiver": "MQTT-SERVICE", "command": "WAKE_UP"};
        standardResponse(payload,getPositiveConfirmation(locale) , response);
    },
        "GoToSleepIntent": function (intent, session, response, locale){
        console.log("GoToSleepIntent started");
        var payload = {"receiver": "MQTT-SERVICE", "command": "GO_TO_SLEEP"};
        standardResponse(payload,getPositiveConfirmation(locale) , response);
    },
      "AMAZON.HelpIntent": function (intent, session, response, locale) {
        response.ask(randomText(HELP_TEXT));
    }
};

function standardResponse(payload, speechOutput, response) {

  var repromptText = null;
  var sessionAttributes = {};
  var shouldEndSession = true;
  var paramsUpdate = {
      topic:"/pi",
      payload: JSON.stringify(payload),
      qos:0
  };
  iotData.publish(paramsUpdate, function(err, data) {
    if (err){
      //Handle the error here
      console.log("MQTT Error" + data);
    }
    else {
      console.log(data);
      response.tell(speechOutput);
    }
  });
}

function randomText(stringArray) {

  var randomIndex = Math.floor(Math.random() * stringArray.length);

  return stringArray[randomIndex];
}

function getPositiveConfirmation(locale){
  if (locale === 'en-US') {
    return randomText(POSITIVE_CONFIRMATIONS_EN);
  } else if (locale === 'en-GB') {
    return randomText(POSITIVE_CONFIRMATIONS_EN);
  } else if (locale === 'de-DE') {
    return randomText(POSITIVE_CONFIRMATIONS_DE);
  } else {
    return randomText(POSITIVE_CONFIRMATIONS_EN);
  }
}

function getTVcommand(command){
    return {"receiver": "LGTV", "command": command};
// 27	Kanal nach oben
//28	Kanal nach unten
//24	Lauter
//25	Leiser
//26	Ton an/aus
//34	Wiedergabe pausieren
//33	Wiedergabe fortsetzen
//1	TV ausschalten
//23	Zurück-Taste
//20	OK-Taste
//403	vorheriger Kanal
//35	Wiedergabe stoppen
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Jarvis skill.
    var jarvis = new Jarvis();
    jarvis.execute(event, context);
};
