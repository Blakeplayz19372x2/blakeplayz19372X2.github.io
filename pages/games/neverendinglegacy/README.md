# NeverEnding Legacy

**NeverEnding Legacy** is a game made by Orteil, the same creator of Cookie Clicker, you can play it here:<br>
https://orteil.dashnet.org/legacy/

Or using [@Plasma4](https://github.com/plasma4)'s mirror along with the Magix mod installed:<br>
https://plasma4.github.io/magix-fix/

This repository acts as an archive for the game files, and also its mods and mod authors.

## License
Using [MIT License](https://github.com/Stake2/NeverEnding_Legacy/blob/main/LICENSE)<br>

## The wiki
You can find the Wiki or Fandom of the game at [Legacy Wiki](https://legacygame.fandom.com/), where you can find a lot of articles teaching things about the game and even showcasing mods.

## The game
In the [Game](https://github.com/Stake2/NeverEnding_Legacy/tree/main/Game) folder, you can find a copy of the game that you can run locally.<br>
It includes all original files of the game and also the [Magix](https://github.com/Stake2/NeverEnding_Legacy/tree/main/Mods/PelletsstarPL/Magix/) mod, created by [@PelletsstarPL](https://github.com/pelletsstarPL/), and fixed and patched by [@Plasma4](https://github.com/plasma4/).<br>
You just need to open the [Index.html](https://github.com/Stake2/NeverEnding_Legacy/blob/main/Game/index.html) file to run the game and a button will appear saying "Use Magix", asking if you want to use the mod while playing.<br>
You can find the original repository with the folders and files of the game and the Magix mod here:<br>
https://github.com/plasma4/magix-fix

From the Readme file of Plasma4:<br>
This offline version of Magix...
- Allows you to import Magix saves and use Magix with just one click (well, maybe not one but close enough)
- Automatically updates to the newest version of fixed Magix when online and uses that when offline
- Has the ability to locally mess around with Magix
- Has ALL sprites and files needed for both the base game and Magix pre-downloaded
- Some options for when you exit the page, such as autosaving or confirming if you want to leave or not

## The game mods
In the [Mods](https://github.com/Stake2/NeverEnding_Legacy/tree/main/Mods) folder, you can find a database that I created with mods people have created for the game around the Internet.<br>
This folder also acts as an archive for the game mods, as the links within the mod JavaScript files point to the mod files stored in this repository, rather than to external sources.

The [Authors.json](https://github.com/Stake2/NeverEnding_Legacy/blob/main/Mods/Authors.json) file contains a JSON dictionary with all the mod authors that I found on the [List of Mods](https://legacygame.fandom.com/wiki/List_of_Mods) page on the wiki of the game.<br>
It contains the number of authors and also dictionaries for every author, their Github profiles, social networks, and mod dictionaries.<br>

The [Mods.json](https://github.com/Stake2/NeverEnding_Legacy/blob/main/Mods/Mods.json) file contains a JSON dictionary with all the mods that I found on the same List of Mods on the wiki.<br>
It contains the total number of mods, the number of mods for each category (General, Utility, and Overhaul), the dictionary of categories along with the list of mods for each category, a list of mods, and the main dictionary of mods.<br>
Every mod dictionary contains the mod title, author name, profile, and information about the mod, such as Fandom wiki page, GitHub repository, mod category, jsDelivr and FileGarden links, Discord server, and links to the original mod if it has been fixed.<br>
The mod dictionaries also contain a "JavaScript files" list that stores the JavaScript files the mod loads, in the correct loading order.<br>
There can be also additional files like mod manifests, sprite sheets, and images.<br>

## Installing mods
When you're going to install a mod in the game, you click on the "Use mods" button, and this text appears:
```
Enter the URLs for mods you want to use, separated by linebreaks.
data.js is the default content used by the game.
Once your game starts, you won't be able to change your mods until you start a new game.
Removing a mod will also remove any achievements linked to it.
Only load mods from sources you trust!
```
The "data.js" text inside the list of mods is the game content that is loaded.<br>
In the mods folder, there is a file called [Mods to copy.txt](https://github.com/Stake2/NeverEnding_Legacy/blob/main/Mods/Mods%20to%20copy.txt), which is a list of mods that do not interfere too much in the game performance, the file will help you install the mods.<br>
Every mod dictionary contains a "Replaces data.js" key, its default value is False, but for some overhaul mods, it is True.<br>
That is because some overhaul mods change the game a lot, and you need to remove the "data.js" line and add the mod links, such as the [Magix](https://github.com/Stake2/NeverEnding_Legacy/tree/main/Mods/PelletsstarPL/Magix/) and [Homosapient Legacy](https://github.com/Stake2/NeverEnding_Legacy/tree/main/Mods/Chenxing61/Homosapient%20Legacy/) mods.

The original list of mods in the game is this one:
```
data.js
```

With some mods, you can make it look like this (every line being a mod):
```
data.js
https://orteil.dashnet.org/legacy/mod.js
https://github.com/Packerfan-Gamer/LegacyCOOLMod/raw/refs/heads/master/LegacyCOOLmod1.js
https://brunosupremo.github.io/coal-mod/coal_mod.js
https://raw.githubusercontent.com/Shadowclaimer/LegacyBees/refs/heads/master/modBees.js
```

There is a file called [Lists.txt](https://github.com/Stake2/NeverEnding_Legacy/blob/main/Mods/Lists.txt) which lists the mod authors and their mods.<br>
In the mods folder, there are folders for all the mod authors, and inside those folders, there is an "Author.txt" file that defines information about the author, such as its name, Github profile, repository, website, and Discord server.<br>
Inside the author folders, there are mod folders for each one of their mods, each mod folder contains files to define information about the mod and its JavaScript files, and also a description file to explain the mod and tell you how to install it.<br>
Most of these descriptions come from the Fandom wiki of the game.<br>
The mod folders contain a "Files" folder to store the mod files that are going to be used.<br>
Everyone can make a pull request to add a mod author that they know, or a mod that they saw or created.<br>
By creating a folder for the new mod author with folders of their mods.<br>
And I will update the JSON and text files using a Python program that I created for that.

## Python program
I used a Python program that I created to manage and create the JSON dictionaries that are inside the mods folder, and to update the files, it is called "NeverEnding_Legacy".<br>
You can find the source code of that program here:<br>
[NeverEnding_Legacy.py](https://github.com/Stake2/Python/blob/main/Modules/NeverEnding_Legacy/NeverEnding_Legacy/__init__.py)