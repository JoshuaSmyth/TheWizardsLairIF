
///////////////////////////////////////////////////////////////////////////////////////////
// Command parsing and substitution
///////////////////////////////////////////////////////////////////////////////////////////

// Commands that contain the following substring entries are substituted for the value on the right hand side.
var stringReplaceMap = new Array();
    stringReplaceMap['pick up'] = 'get';
    stringReplaceMap['cell door'] = 'door';
    stringReplaceMap['trap door'] = 'hatch';
    stringReplaceMap['book shelf'] = 'shelves';
    stringReplaceMap['book shelves'] = 'shelves';
    stringReplaceMap['look around'] = 'look';
    stringReplaceMap['lookat'] = 'look';

// Commands that contain the following words are substitued for the values on the right hand side
var synonomMap = new Array();
    synonomMap['take'] = 'get';
    synonomMap['pickup'] = 'get';
    synonomMap['north'] = 'n';
    synonomMap['south'] = 's';
    synonomMap['east'] = 'e';
    synonomMap['west'] = 'w';
    synonomMap['examine'] = 'look';
    synonomMap['inspect'] = 'look';
    synonomMap['x'] = 'look';
    synonomMap['mattress'] = 'bed';
    synonomMap['keys'] = 'key';
    synonomMap['i'] = 'inventory';
    synonomMap['carrying'] = "inventory";
    synonomMap['items'] = 'inventory';
    synonomMap['rug'] = 'mat';
    synonomMap['trapdoor'] = 'hatch';
    synonomMap['polly'] = 'parrot';
    synonomMap['octoparrot'] = 'parrot';
    synonomMap['bird'] = 'parrot';
    synonomMap['shelf'] = 'shelves';
    synonomMap['bookshelf'] = 'shelves';
    synonomMap['bookshelves'] = 'shelves';
    synonomMap['place'] = 'put';
    synonomMap['taste'] = 'eat';
    synonomMap['bowl'] = 'cauldron';
    synonomMap['hay'] = 'straw';

// Commands matching these words are stripped from the command before processing to make matching easier
var ignoreWords = new Array();
    ignoreWords['to'] = true;
    ignoreWords['the'] = true;
    ignoreWords['at'] = true;
    ignoreWords['go'] = true;
    ignoreWords['with'] = true;
    ignoreWords['in'] = true;
    ignoreWords['into'] = true;
    ignoreWords['on'] = true;

///////////////////////////////////////////////////////////////////////////////////////////
// Game Functions
///////////////////////////////////////////////////////////////////////////////////////////
var Game = {
    // Executed when a game begins
    onStart: function () {
        outputLine("<span style='color:yellow'>Welcome to the wizards lair</span>");
        outputLine("<span style='color:lightblue'>By Joshua Smyth</span>");
        outputLine("");
        outputLine("This game is a work of <b>Interactive Fiction</b>.");
        outputLine("If you have never played IF before try typing <b>help</b> at the prompt below.");
        outputLine("");
        outputLine("Otherwise type <b>start</b> to begin your adventure. Remember you can type <b>Inventory</b> at any time to see what you are carrying.");
        outputLine("");

        // Set player in the starting room
        enterRoom(Rooms[0]);
    },

    onAskForHelp: function() {
        outputLine("<b>Interactive Fiction</b> was a very popular style of game in the early days of computing before video displays existed and computers where only capable of text output. Originally they were called 'Text Adventure Games' or just 'Adventure Games' because of the first such game <b>Colossal Cave Adventure</b>");
        outputLine("");
        outputLine("<b>How to play</b>");
        outputLine("IF is a combination of story and puzzles. Your character will move around different rooms and be presented with a text based description of that room. Simply type commands at the prompt such as <b>Look at House</b> and <b>Talk to man</b> in order to further progress the game.");
    }
};


///////////////////////////////////////////////////////////////////////////////////////////
// Items
///////////////////////////////////////////////////////////////////////////////////////////
var item_skeleton_arm = new Object();
    item_skeleton_arm.name = "Skeleton Arm";
    item_skeleton_arm.onDescription = function() {
        outputLine("It's a skeleton arm. And you're carrying it around.");
    };

var item_straw = new Object();
    item_straw.name = "Straw";
    item_straw.onDescription = function() {
        outputLine("Hay! It's some straw!");
    };

var item_cell_key = new Object();
    item_cell_key.name = "Cell Key";
    item_cell_key.onDescription = function() {
        outputLine("A key you liberated from the cell the Vice Chanceller threw you in.");
    };

var item_inkwell = new Object();
    item_inkwell.name = "Inkwell";
    item_inkwell.variables = new Array();
    item_inkwell.variables["is_empty"] = true;
    item_inkwell.onDescription = function() {
        if (item_inkwell.variables["is_empty"] == true) {
            outputLine("The Inkwell appears to be all dried up.");
        }
        else {
            outputLine("The Inkwell is full of Octoparrot Ink.");
        }
    };

var item_mirror = new Object();
    item_mirror.name = "Hand Mirror";
    item_mirror.onDescription = function() {
        outputLine("It's a small hand mirror. Good for reflecting light I would imagine.");
    };

var Items = new Array();
    Items[0] = item_skeleton_arm;
    Items[1] = item_straw;
    Items[2] = item_cell_key;
    Items[3] = item_inkwell;
    Items[4] = item_mirror;

///////////////////////////////////////////////////////////////////////////////////////////
// Rooms
///////////////////////////////////////////////////////////////////////////////////////////
var Rooms = new Array();

    var room_lobby = CreateRoomLobby();
    var room_dungeon = CreateRoomDungeon();
    var room_office = CreateRoomOffice();
    var room_balcony = CreateRoomBalcony();
    var room_endgame = CreateRoomEndGame();

    Rooms[0] = room_lobby;
    Rooms[1] = room_dungeon;
    Rooms[2] = room_office;
    Rooms[3] = room_balcony;
    Rooms[4] = room_endgame;


///////////////////////////////////////////////////////////////////////////////////////////
// Lobby Room
///////////////////////////////////////////////////////////////////////////////////////////
function CreateRoomLobby() {
    var room = new Object();
    room.id = 1;
    room.name = "Lobby";
    
    room.onDescription = function() {
        outputLine("You are standing in the lobby waiting to start the game.<br/>Type <b>start</b> to begin.");
    };
    
    room.exit = new Array();

    room.onUnhandledCommand  = function() {
                                    outputLine("Try typing <b>start</b> to start the game.<br/>Otherwise try <b>help</b> if you are new to Interactive Fiction.")
                                };

    room.processCommands = function(e) {
                                if (e == "start") {
                                    enterRoom(room_dungeon);
                                    return true;
                                }
                            };
    return room;   
}


///////////////////////////////////////////////////////////////////////////////////////////
// Dungeon Room
///////////////////////////////////////////////////////////////////////////////////////////
function CreateRoomDungeon() {
    var room = new Object();
    room.id = 1;
    room.name = "Dungeon";

    room.onDescription = function() {
        output("The cell is dimly lit and contains a miserable excuse for a <b>bed</b>. The only exit is the <b>cell door</b>. A foul damp smell permiates the air. ");
        
        if (room.variables["has_looked_skeleton"]) {
            output("There is a <b>skeleton</b> in the far corner ");
        }
        else {
            output("There is somekind of <b>object</b> in the far corner. ");
        }
        if (room.variables["cell_door_opened"]) {
            outputLine("Through the cell door there is an exit to the <b>south</b>.");
        }
    };

    room.exit = new Array();
    room.variables = new Array();
    room.variables["skeleton_has_arm"] = true;
    room.variables["cell_door_opened"] = false;
    room.variables["has_previously_visited"] = false;
    room.variables["has_looked_skeleton"] = false;
    room.variables["key_is_on_hook"] = true;

    // Function called when a player enters the room
    room.onEnter = function() {
        if (room.variables["has_previously_visited"] == false) {
            outputLine("The door to the cell slams shut with a violent thunk.");
            outputSpeech("You don't know how much trouble you are in young man!")
            outputLine("The vice chanceller is obviously very angry.");
            outputSpeech("Next time you cast an anthropomorphize spell it better not be during the most important match of the season! Crikey, If there weren't any senior wizards in attendance the Super City Sharks would have ended up sleeping with the fishes!");
            outputSpeech("I'm revoking your magic rights until further notice, so you'll just have to do everything manually from now on - And you can stay in this cell to think about what you've done!")
            outputSpeech("A mere apprentice shouldn't even be toiling with such high level magics!");
            outputLine("And with that the vice chanceller's footsteps echo as he stomps down the hall.")
            outputLine("");
            room.onDescription();
            room.variables["has_previously_visited"] = true;
        }
    };

    // Function called when the player enters input
    room.processCommands = function(e) {
        if (e == "look cell") {
            room.onDescription();
            return true;
        }
        
        if (e == "talk skeleton") {
            outputLine("You try to strike up a conversation with the skeleton, but you suspect he might be a little shy.")
            return true;
        }
        
        if (e == "look object" || e == "look skeleton" || e == "look corner") {
            output("Upon closer inspection you see there is a <b>skeleton</b> sitting patiently in the corner. Hopefully it's not the last resident to have angered the vice chanceller. ");
            if (room.variables["skeleton_has_arm"] == true) {
                outputLine("It looks like the skeleton's <b>arm</b> has come loose.");
            }
            else {
                outputLine("The skeleton is missing it's left arm. You guess he wasn't particularly attached to it.");
            }
            room.variables["has_looked_skeleton"] = true;
            return true;
        }

        if (e == "fuck skeleton" || e == "screw skeleton") {
            outputLine("You wouldn't want someone jumping your bones now would you?");
            return true;
        }
        
        if (e == "look arm") {
            if (room.variables["skeleton_has_arm"] == true) {
                outputLine("The skeleton's arm looks like it has come loose.");
            }
            return true;
        }

        if (e == "get bone" || e == "get arm" || e == "get skeleton" || e == "get skeleton arm") {
            if (room.variables["skeleton_has_arm"] == true) {
                outputLine("The skeleton arm comes off easily. You pick it up.")
                player.addToInventory(item_skeleton_arm);
                room.variables["skeleton_has_arm"] = false;
            }
            else {
                outputLine("Haven't you done enough grave robbing for today? Leave the other arm alone!");
            }
            return true;
        }

        if (e == "look bed") {
            outputLine("It's a pretty poor excuse for a bed really. Mostly matted <b>straw</b> and the rest composed of fleas and other creepy crawlies.");
            return true;
        }

        if (e == "get straw" || e == "get bed" || e == "get hay") {
            if (!player.hasItem(item_straw)) {
                outputLine("You pocket some straw.");
                player.addToInventory(item_straw);
            }
            else {
                outputLine("You don't need any more straw.");
            }
            return true;
        }
        
        if (e == "look door") {
            outputLine("The cell door is made of solid iron bars. Through the bars you can see the <b>cell door</b> <b>keys</b> hanging on a hook");
            return true;
        }

        if (e == "look key" || e == "look hook") {
            if (room.variables["key_is_on_hook"] == true) {
                outputLine("They are sitting on a hook outside of your reach.");
            }
            else {
                outputLine("The cell door keys are no longer on the hook.");
            }
            return true;
        }
        
        if (e == "get key") {
            outputLine("Try as you might there's no way you can reach the keys from your current position.");
            return true;
        }
        
        if (e == "sleep" || e == "look fleas") {
            outputLine("Remember when your mother told you to sleep tight and not let the bed bugs bite? Yeah, you'd like to keep it that way.");
            return true;
        }
        
        if (e == "get key arm" || e == "get key skeleton arm" || e == "use arm get key" || e == "use arm key") {
            if (room.variables["key_is_on_hook"] == false) {
                outputLine("The key is no longer on it's hook");
                return true;
            }

            if (player.hasItem(item_skeleton_arm) && room.variables["key_is_on_hook"]) {
                outputLine("You dangle the skeleton arm through the cell door an lift the keys from the hook.");
                player.addToInventory(item_cell_key);
                room.variables["key_is_on_hook"] = false;
            }
            else {

                outputLine("You aren't carrying an item of that description.");
            }
            return true;
        }
        
        if (e == "unlock cell" || e == "unlock cell door" || e == "unlock cell keys" || e == "unlock door" || e == "unlock door key" || e == "open door key" || e == "use key door" || e == "use key unlock door" || e == "use cell key" || e == "use cell key door" || e == "use door key") {
            if (player.hasItem(item_cell_key)) {
                outputLine("With a satisfying turn of the key the cell door swings open.");
                room.variables["cell_door_opened"] = true;
                room.exit["s"] = 2;     // Vice Chancellers Office
                outputLine("There is now an exit to the <b>south</b>");
            }
            else {
                outputLine("And just how are you going to do that smarty pants?");
            }
            return true;
        }

        if (e == "open door" || e == "open cell door") {
            if (room.variables["cell_door_opened"] == true) {
                outputLine("The cell door is unlocked. You may exit to the <b>south</b>")
            }
            else {
                outputLine("The cell door is firmly shut.");
            }
            return true;
        }
    };
    return room;
}


///////////////////////////////////////////////////////////////////////////////////////////
// Vice Chancellers Office
///////////////////////////////////////////////////////////////////////////////////////////
function CreateRoomOffice() {
    var room = new Object();
    room.Id = 2;
    room.name = "Vice Chanceller's Office";
    
    room.onDescription = function() {
        outputLine("The Vice Chanceller doesn't appear to be a very tidy man. The pressures of running The Rivercity School of Magick appears to leave him with very little time to do the tidying up.");
        outputLine("");
        outputLine("The floor is stone cold except for a <b>mat</b> which covers a small section of ground. In the centre of the room is a <b>desk</b>. On top of the desk is a heavy looking <b>book</b> open to the middle. There is a large <b>cauldron</b> towards the back of the room and a series of <b>shelves</b> cover almost every wall. A small <b>cage</b> is hanging from the ceiling.");
        outputLine("");
        outputLine("The exits are to the <b>north</b> and to the <b>east</b> and <b>west</b>");
    };

    // Exits refer to other room Id's
    room.exit = new Array();
    room.exit["n"] = 1;         // Dungeon
    room.exit["e"] = 3;
    room.variables = new Array();
    room.variables["has_previously_visited"] = false;
    room.variables["mirror_in_drawer"] = true;
    room.variables["inkwell_on_desk"] = true;
    room.variables["is_hatch_closed"] = true;
    room.variables["is_lever_pulled"] = false;
    room.variables["is_inkwell_on_tray"] = false;
    room.variables["is_cauldron_ready"] = false;
    room.variables["cauldron_has_hay"] = false;
    room.variables["cauldron_has_ink"] = false;

    room.onEnter = function() {
        if (room.variables["has_previously_visited"] == false) {
            room.onDescription();
            room.variables["has_previously_visited"] = true;
        }
    };

    room.CheckIngredients = function(e)
    {
        if (room.variables["cauldron_has_hay"] == true && room.variables["cauldron_has_ink"] == true) {
            outputLine("As you add the final ingredient to the cauldron. The liquid starts to glow hot working it's way up to a simmer and then to a violent boil. The contents begin to slowly swirl and the liquid starts to change colours, pulsating as it shifts between blues and greens. The pace of the swirling starts to increase until a small whirlpool has formed within the cauldron. And then, suddenly, Bang! A small but violent explosion sets off a plume of smoke into the air as the liquid finally settles down to an easy simmer. The stench from the fumes start to waft about the air and head out of the room towards the balcony.");
            item_inkwell.variables["is_empty"]  = true;
            room.variables["is_cauldron_ready"] = true;
            return true;
        }
        else
        {
            outputLine("The cauldron simmers for a bit before settling down. Looks like there are more ingredients to go.");
            return true;
        }
    };

    room.processCommands = function(e) {
            if (e == "w") {
                outputLine("To the west is the door that exits the Vice Chanceller's office. But when you look at the door you see that it contains no handle nor lock. It's one of those magick doors that can only be opened by the Vice Chanceller's presence.");
                return true;
            }

            if (e == "open door") {
                outputLine("It seems the door can only be opened by the Vice Chanceller's presence.");
                return true;
            }

            if (e == "clean room") {
                outputLine("You haven't got all week, which is probably how long you'd need to get this place in order.");
                return true;
            }

            if (e == "put straw cauldron" || e == "add straw cauldron") {
                if (player.hasItem(item_straw)) {
                    player.removeFromInventory(item_straw);
                    room.variables["cauldron_has_hay"] = true;
                    return room.CheckIngredients();
                }
                else {
                    outputLine("Hey! You're not carrying any.");
                }
                return true;
            }

            if (e == "put ink cauldron" || e == "pour ink cauldron" || e == "add ink cauldron" ||
                e == "put inkwell cauldron" || e == "pour inkwell cauldron" || e == "add inkwell cauldron") {
                if (room.variables["is_cauldron_ready"] == true) {
                    outputLine("The concoction has been brewed, there's no need to add any more ink to the recipe.");
                    return true;
                }

                if (item_inkwell.variables["is_empty"] == true) {
                    outputLine("The Inkwell contains no ink.");
                    return true;
                }
                else
                {
                    room.variables["cauldron_has_ink"] = true;
                    return room.CheckIngredients();
                }
            }

            if (e == "look cauldron") {
                outputLine("A large cast iron cauldron is sitting above an unlit fireplace. The cauldron contains a thick broth.");
                return true;
            }

            if (e== "look broth") {
                outputLine("The broth is thick and smells like cat urine. There are also several feathers floating around the bowl.");
                return true;
            }

            if (e == "eat broth" || e == "taste broth" || e == "smell broth") {
                outputLine("The smell of the broth suggests that you would rather not taste it.");
                return true;
            }

            if (e == "look shelves") {
                outputLine("The shelves contains various aparatise and leather bound books. Most items are covered in a thick layer of dust, suggesting they are mostly for show than for use.");
                return true;
            }

            if (e == "look book" || e == "read book" || e == "open book") {
                outputLine("You can sense the large book contains powerful magicks within. It is open to a spell called 'Summon Skytraveler'");
                outputLine("");
                outputLine("Ingredients:");
                outputSpeech(" Black Octopus Ink");
                outputSpeech(" Vile of Cat Urine");
                outputSpeech(" Feathers of ostrich");
                outputSpeech(" Barley and oats");
                outputSpeech(" A handful of hay");
                outputLine("Preparation:");
                outputLine(" Mix all Ingredients except for the Octopus ink and hay into a large caulron. Bring to the boil then cool until a thick broth forms. Once cooled add the final ingredients and stand back!");
                return true;
            }
            if (e == "look desk") {
                output("It is a very solid mahogany writers desk with only a single <b>drawer</b>. On top of the desk is a heavy looking <b>book</b> open to the middle. ");
                if (room.variables["inkwell_on_desk"]) {
                    outputLine("There is an <b>Inkwell</b> on the desk.");
                }
                return true;
            }

            if (e == "look inkwell" && !player.hasItem(item_inkwell)) {
                outputLine("It appears to have dried up.");
                return true;
            }

            if (e == "look drawer" || e == "open drawer") {
                if (room.variables["mirror_in_drawer"] == true) {
                    outputLine("There is a small hand mirror in the top drawer.");
                }
                else {
                    outputLine("The drawer is empty.");
                }
                return true;
            }

            if (e == "get mirror") {
                if (room.variables["mirror_in_drawer"] == true) {
                    outputLine("You retrieve the mirror from the drawer of the Vice Chanceller's writing desk");
                    player.addToInventory(item_mirror);
                    room.variables["mirror_in_drawer"] = false;
                }
                else {
                    outputLine("You don't see any mirror.");
                }
                return true;
            }

            if (e == "get inkwell") {
                if (room.variables["inkwell_on_desk"]) {
                    outputLine("You pocket the Inkwell");
                    player.addToInventory(item_inkwell);
                    room.variables["inkwell_on_desk"] = false;
                }
                else {
                    if (room.variables["is_inkwell_on_tray"]) {
                        outputLine("You collect the Inkwell from off of the tray.");
                        room.variables["is_inkwell_on_tray"] = false;
                        player.addToInventory(item_inkwell);
                    }
                    else {
                        outputLine("The Inkwell is no longer on the desk");
                    }
                }
                return true;
            }

            if (e == "look cage") {
                if (room.variables["is_lever_pulled"]) {
                    outputLine("Inside of the cage is a very curious creature. It appears to be an <b>Octoparrot</b> - Half parrot, half octopus. It must be the Vice Chanceller's pet. There is a <b>tray</b> underneath the cage.");
                }
                else {
                    outputLine("The cage is too high up for you to look into.");
                }
                return true;
            }

            if (room.variables["is_lever_pulled"]) {
                if (e == "look parrot") {
                    outputLine("The <b>Octoparrot</b> is sitting quietly on it's perch. It looks like a standard parrot, but it has eight tencles protruding from it's body. Six for arms and two for legs. There is a <b>tray</b> underneath the cage.");
                    return true;
                }

                if (e == "get parrot") {
                    outputLine("The <b>Octoparrot</b> is perched safely inside of it's cage.");
                    return true;
                }

                if (e == "open cage") {
                    outputLine("The cage doesn't appear to have any kind of door. You are not sure how the <b>Octoparrot</b> got in there in the first place.");
                    return true;
                }

                if (e == "talk parrot") {
                    outputSpeech("Eeak, Polly, pretty polly!");
                    return true;
                }

                if (e == "put inkwell on tray" || e == "put inkwell tray") {
                    if (player.hasItem(item_inkwell)) {
                        outputLine("You put the Inkwell on the tray.");
                        player.removeFromInventory(item_inkwell);
                        room.variables["is_inkwell_on_tray"] = true;
                    }
                    else {
                        outputLine("You are not carrying an Inkwell.");
                    }
                    return true;
                }

                if (e == "look tray") {
                    outputLine("The tray appears to be splattered with some dried black crust.");
                    if (room.variables["is_inkwell_on_tray"]) {
                        outputLine("There is an Inkwell on the tray");
                    }
                    return true;
                }

                if (e == "move tray" || e == "get tray") {
                    outputLine("The tray is fine where it is...");
                    return true;
                }

                if (e == "scare parrot") {
                    outputLine("The Octoparrot appears nonplussed. It might take a little more to ruffle it's feathers.");
                    return true;
                }

                if (e == "use mirror parrot" || e == "show mirror parrot" || e == "show parrot mirror" || e == "scare parrot mirror") {
                    if (player.hasItem(item_mirror)) {
                        outputLine("You hold the mirror up to the bird-fish like creature.");
                        outputSpeech("Eeak, Polly shouldn't be!");
                        output("The creature is visibly frightened and waves it's tencles about. A stream of black liquid is secreted from the poor animal. ");
                        if (room.variables["is_inkwell_on_tray"]) {
                            item_inkwell.variables["is_empty"] = false;
                            outputLine("Some of the Octoparrot Ink is collected by the inkwell placed on the tray");
                        }
                        else {
                            outputLine("The Octoparrot Ink splashes on the tray under the cage");
                        }
                    }
                    else {
                        outputLine("You are not carrying a mirror.");
                    }
                    return true;
                }
            }

            if (e == "look mat") {
                outputLine("The mat is old and otherwise unremarkable. Interior decoration is not the Vice Chanceller's strong point.");
                return true;
            }

            if (e == "look under mat") {
                outputLine("You move the mat aside and see that it was covering a small <b>hatch</b>");
                return true;
            }

            if (e == "open hatch") {
                room.variables["is_hatch_closed"] = false;
                outputLine("The hatch is now open. Inside of the hatch is a small <b>lever</b>.");
                return true;
            }

            if (e == "close hatch") {
                room.variables["is_hatch_closed"] = true;
                outputLine("You close the hatch");
                return true;
            }

            if (e == "look hatch") {
                if (room.variables["is_hatch_closed"]) {
                    outputLine("The hatch is closed");
                }
                else {
                    outputLine("The hatch contains a <b>lever</b>");
                }
                return true;
            }

            if (e == "push lever") {
                if (room.variables["is_hatch_closed"]) {
                    outputLine("There is no lever to be pushed.");
                }
                else {
                    outputLine("It looks like the kind of lever that should be pulled. Not pushed.");
                }
                return true;
            }

            if (e == "look lever") {
                if (room.variables["is_hatch_closed"] == true) {
                    outputLine("You cannot see any lever");
                }
                else {
                    if(room.variables["is_lever_pulled"] == true) {
                        outputLine("The lever is sitting inside of a hatch. It is currently in what looks like the on position");
                    }
                    else {
                        outputLine("The lever is sitting inside of a hatch. It looks like the type you can pull. It is currently in what looks like the off position");
                    }
                }
                return true;
            }

            if (e == "pull lever" || e == "use lever" || e == "raise lever") {
                if (room.variables["is_hatch_closed"] == true) {
                    outputLine("You cannot see any lever which can be pulled.");
                }
                else {
                    if(room.variables["is_lever_pulled"] == true) {
                        outputLine("The lever now appears to be stuck. Try as you might it's not going anywhere.");
                    }
                    else {
                        outputLine("You reach into the hatch and pull the lever. Suddenly you hear the clanging of chains as the <b>cage</b> starts to descend. The cage then stops a few feet from the ground.");
                        room.variables["is_lever_pulled"] = true;
                    }
                }
                return true;
            }

        };

    return room;
}

///////////////////////////////////////////////////////////////////////////////////////////
// Balcony
///////////////////////////////////////////////////////////////////////////////////////////
function CreateRoomBalcony() {
    var room = new Object();
    room.Id = 3;
    room.name = "Balcony";
    
    room.exit = new Array();
    room.exit["w"] = 2;         // Dungeon
    
    room.variables = new Array();
    room.variables["has_previously_visited"] = false;

    room.onDescription = function() {
        outputLine("The Balcony overlooks the entire magic school and courtyard areas");
        outputLine("There is an exit to the <b>west</b>");
    };

    room.onEnter = function() {
        if (room_office.variables["is_cauldron_ready"] == true) {  // Cauldron spell has been made
            outputLine("As you follow the fumes outside to the balcony you see a speck in the horizon that is growing larger and larger. Once it is close enough you see that it is somekind of winged creature. It comes closer and closer still, flying with precision and at great velocity. At this point you realise that it is a <b>Hippogriff</b> - A legendary creatre, offspring of Griffin and Mare. You stand stunned unable to look away. Before you realise what is going on the Hippogriff grabs you with it's front two claws and begins to ascend into the sky above.");
            outputLine("");
            enterRoom(room_endgame);
            return true;
        }

        if (room.variables["has_previously_visited"] == false) {
            room.onDescription();
            room.variables["has_previously_visited"] = true;
            return true;
        }
    };

    room.processCommands = function(e) {

    };
    return room;
}

///////////////////////////////////////////////////////////////////////////////////////////
// End Game
///////////////////////////////////////////////////////////////////////////////////////////

function CreateRoomEndGame() {
    var room = new Object();
    room.Id = 4;
    room.name = "End Game";
    room.variables = new Array();
    room.variables["has_previously_visited"] = false;

    room.onDescription = function() {
        outputLine("<b>CONGRATULATIONS</b>: You have reached the end of the game!");
        outputLine("");
        outputLine("Thank you for playing!");
        outputLine("If you have feedback please email me: joshuapaulsmyth@gmail.com");
    };

    room.onEnter = function() {
        if (room.variables["has_previously_visited"] == false) {
            room.onDescription();
            room.variables["has_previously_visited"] = true;
        }
    };

    room.processCommands = function(e)
    {
        onDescription();
        return true;
    };
    return room;
}
