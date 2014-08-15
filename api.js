// Global objects
var currentRoom;

var Globals = new Array();	// Store state in here

var player = new Object();
	player.inventory = new Array();
	player.addToInventory = function(item) {
    	player.inventory.push(item);
    };

    player.removeFromInventory = function(item) {
    	
		var index = 0;
		var founditem = false;
    	for(i in player.inventory) {
			if (player.inventory[i].name.toLowerCase() == item.name.toLowerCase()) {
				founditem = true;
				break;
			}
			index++;
		}

		if (founditem == true) {
			player.inventory.splice(index,1);
		}
    };
    
    player.hasItem = function(item) {
		for(i in player.inventory) {
			if (player.inventory[i] == item) {
				return true;
			}
		}
		return false;
	};


function outputSpeech(text) {
    outputLine("<div style='margin-left:40px;'><I>\"" + text + "\"</I></div>");
}


function lookInventoryItem(itemname) {
	for(i in player.inventory) {
		if (player.inventory[i].name.toLowerCase() == itemname.toLowerCase()) {
			player.inventory[i].onDescription();
			return true;
		}
	}

	return false;
}

function outputInventory() {
	outputLine("You are carrying:");
	var numItems = 0;
	for(i in player.inventory) {
		outputLine(" [" + player.inventory[i].name + "]");
		numItems++;
	}
	if (numItems == 0) {
		outputLine(" [Nothing]");
	}
	outputLine("");
}

// Helper functions here
function exitRoom(e) {
	if (currentRoom.exit)
	{
	    if (currentRoom.exit[e] != null)
	    {
	        var id = currentRoom.exit[e];
	        var room = Rooms[id];



	        enterRoom(room);
	        return true;
	    }
    }
    return false;
};

function enterRoom(room) {

    currentRoom = room;
    if (room.onEnter)
    {
        room.onEnter();
    }
}