/*
Code adapted by Joshua Smyth which was adapted by Matt Gatland which was originally written by Eric Bidelman (See link below)

Based off the original example at http://www.htmlfivewow.com/demos/terminal/terminal.html
*/

  var interlace_ = document.querySelector('.interlace');
  var container_ = document.getElementById('container');
  var cmdLine_ = document.getElementById('cmdline');
  var output_ = document.getElementById('output');
  var prompt = document.getElementById('prompt');
  var history_ = [];
  var histpos_ = 0;
  var histtemp_;
  
  function inputTextClick_(e) {
      this.value = this.value;
    }

  // Clicking ANYWHERE will select the input line.
  if (!window.addEventListener) {
    // IE8
      window.attachEvent('click', function(e) {
          cmdLine_.focus();
      }, false);

       // Always force text cursor to end of input line.
      cmdLine_.attachEvent('click', inputTextClick_, false);

    
      // Setting things up
      cmdline.onkeydown  = processNewCommand_; 
      //cmdLine_.attachEvent('keydown', processNewCommand_);
      cmdLine_.attachEvent('keyup', historyHandler_); // keyup needed for input blinker to appear at end of input.
  }
  else {
    // Chrome / Firefox
      window.addEventListener('click', function(e) {
          cmdLine_.focus();
      }, false);

      // Always force text cursor to end of input line.
      cmdLine_.addEventListener('click', inputTextClick_, false);
      function inputTextClick_(e) {
        this.value = this.value;
      }
    
      // Setting things up
      cmdLine_.addEventListener('keydown', processNewCommand_, false);
      cmdLine_.addEventListener('keyup', historyHandler_, false); // keyup needed for input blinker to appear at end of input.
  }




  function processNewCommand_(e) {
      var keyCode = null;
      if (e) {
        keyCode = e.keyCode;
      }
      else {
        keyCode = window.event.keyCode;
      }

      if (keyCode == 13) { // Enter

          // TODO fix this for IE8...

          //Duplicate current input and append to output section.
          var line = this.parentNode.parentNode.cloneNode(true);
          line.removeAttribute('id')
          line.classList.add('line');
          var input = line.querySelector('input.cmdline');
          input.autofocus = false;
          input.readOnly = true;
        
        
          output_.appendChild(line);

          // Update history
          if (this.value) {
              history_[history_.length] = this.value;
              histpos_ = history_.length;
          }

          var processedCmd = getSimplifiedCommand(this.value);
          processCommand(processedCmd); // Should be in game.js
    
          this.value = ''; // Clear line

          var docHeight = util.getDocHeight();
          interlace_.style.height = docHeight + 'px';
  

          prompt.innerHTML = "[" + currentRoom.name + "] >>";

      }
  }
  
function getSimplifiedCommand(e)
{
  e = e.toLowerCase();
  e = Parse.findAndReplace(e);

  var args = e.split(' ');
  
  // TODO there is an error where 'push' is interpreted as a javascript object (in chrome at least)
  for (var i = 0; i < args.length; i++) {
      args[i] = Parse.ignoreSimpleWords(args[i]);
      args[i] = Parse.convertSynonym(args[i]);
  }
  
  var processedCmd = "";
  for (var i = 0; i < args.length; i++) {
      if (args[i] != null) {
          processedCmd += args[i];

          if (i != (args.length - 1)) {
              processedCmd += " ";
          }
      }
  }

  return processedCmd;
}

function getSimplfiedRoomName()
{
  var roomname = currentRoom.name.toLowerCase();
  return roomname;
 // return getSimplifiedCommand(roomname);
}

  function processCommand(e) {
        outputLine("");

        // Handle global command processing
        if (e == "look" || e == "look room" || e == "look " + getSimplfiedRoomName()) {
            currentRoom.onDescription();
            return;
        }

        if (e == "help") {
          Game.onAskForHelp();
          return;
        }

        // Check for exiting room via compass commands 
        if (e == "n" || e == "s" || e == "e" || e == "w") {
          if (exitRoom(e)) {
              return;
          }
          else
          {
            if (!currentRoom.processCommands(e))
            {
              outputLine("You cannot go that way.");
            }
            return;
          }
        }

        if (e == "inventory" || e == "look inventory") {
          outputInventory();
          return;
        }

        if (e.substring(0,4) == ("look")) {
            // Are we looking at an inventory item?
            var remainingString = e.substring(5, e.length);
            if (lookInventoryItem(remainingString) == true) {
              return;
            }
        }

        // Handle local room command processing
                    console.log("processed command" + e);
        var result = currentRoom.processCommands(e);
        if (result == true) {
            return;
        }

        if (currentRoom.onUnhandledCommand != undefined) {
          currentRoom.onUnhandledCommand();
        }
        else {
          // Could not match any commands.
          output("I'm sorry I don't know what you mean.");
        }
    }

  function output(html) {
      output_.insertAdjacentHTML('beforeEnd', html);
      cmdLine_.scrollIntoView();
  }

  function clearScreen()
  {
      output_.innerHTML = "";
  }

  function outputLine(html) {
      output_.insertAdjacentHTML('beforeEnd', html);
      output_.insertAdjacentHTML('beforeEnd', '<br>');
      cmdLine_.scrollIntoView();
  }
    
    function historyHandler_(e) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
            //history_[histpos_] = this.value; //I don't like this feature. [Josh] Me neither 
        } else {
          histtemp_ = this.value;
        }
      }
	
    if (history_.length) {
      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }
  
var util = util || {};

// Cross-browser impl to get document's height.
util.getDocHeight = function() {
  var d = document;
  return Math.max(
      Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
      Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
      Math.max(d.body.clientHeight, d.documentElement.clientHeight)
  );
};

// Parser helper methods
var Parse =
{
    convertSynonym: function (e) {

        if (synonomMap[e] != null)
            return synonomMap[e];

        return e;
    },

    ignoreSimpleWords: function (e) {
        if (ignoreWords[e] != null) return null;

        return e;
    },

    findAndReplace: function(e) {
      var str = e;
      for(i in stringReplaceMap)
      {
        str = str.replace(i, stringReplaceMap[i]);
      }
      return str;
    }
}

// Call the game.js start function
Game.onStart();
prompt.innerHTML = "[" + currentRoom.name + "] >>";
