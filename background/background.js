var navValues = null;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var grammar = '#JSGF V1.0;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = false;
recognition.start();

recognition.onstart = function(event) {
  console.log("Started")
}
recognition.onresult = function(event) {
    speechResults(event, navValues);
};
recognition.onerror = function(event) {
    console.log("Theres been an error trying to catch error!: " + event.error);
}
recognition.onend = function(event) {
  console.log("Stopped");
  recognition.start();
}

function speechResults(event, navValues){
  var last = event.results.length - 1;
  var command = event.results[last][0].transcript;
  if (navValues){
    if (command.toLowerCase().includes('cancel')){
      sendMessagetoContext("cancelDom", null);
    }
    else if (command.toLowerCase().includes('test')){
      sendMessagetoContext("newDom", null);
    }
    else if (command.toLowerCase().includes('scroll down')){
      sendMessagetoContext("scrollDown", null);
    }
    else if (command.toLowerCase().includes('scroll up')){
      sendMessagetoContext("scrollUp", null);
    }
    else if (command.toLowerCase().includes('go back')){
      sendMessagetoContext("goBack", null);
    }
    else if (command.toLowerCase().includes('go forward')){
      sendMessagetoContext("goForward", null);
    }
    else {
      var foundNav = false;
      // iterate over each element in the array
      searchTerm = command;
      for (var i = 0; i < navValues.length; i++){
        console.log(navValues[i].elementId);
        if (command == navValues[i].navValue){
          console.log(navValues[i]);
          sendMessagetoContext("pressButton", navValues[i].elementId)
          navValues = null;
          foundNav = true;
          break;
        }
      }
    }
  }
  else{
    if (command.toLowerCase().includes('test')){
      sendMessagetoContext("newDom", null);
    }
    else if (command.toLowerCase().includes('scroll down')){
      sendMessagetoContext("scrollDown", null);
    }
    else if (command.toLowerCase().includes('scroll up')){
      sendMessagetoContext("scrollUp", null);
    }
    else if (command.toLowerCase().includes('go back')){
      sendMessagetoContext("goBack", null);
    }
    else if (command.toLowerCase().includes('go forward')){
      sendMessagetoContext("goForward", null);
    }
  }
}

function sendMessagetoContext (msg, objectToPress){
  chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {command: msg, objectToPress: objectToPress}, function(response){
      if (response.result.includes("Nav Icons")){
        var navList = response.navObjects;
        navValues = navList;
      }
      else if (response.result.includes("Complete")){
        navValues = null;
      }
    })
  })
};

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({
        url: chrome.extension.getURL("html/welcome.html"),
        active: true
    })
});
