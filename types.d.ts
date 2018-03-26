/**
 * @description
 * This is the first and only top-level function that should be called in your script,
 * everything else will be done in the function that is passed to it.
 * @example
 * registerPlugin({
 *     name: 'Demo Script',
 *     version: '1.0',
 *     description: 'This example actually does nothing',
 *     author: 'Author <author@example.com>',
 *     vars: []
 * }, function(sinusbot, config) {
 *     // your code goes here
 * });
 * @param {Manifest} manifest
 * The manifest determines which features are available to the script and
 * contains metadata and variables that will be shown in the web interface.
 * @param {function} setupFunction
 * Called upon activation with two or more parameters.
 * The first one, sinusbot, should **not** be used anymore.
 * The second one will hold the configuration of the plugin that the user set from within the web interface
 * (given you have added anything to the vars field of your script manifest).
 */
declare function registerPlugin(manifest: Manifest, setupFunction: any): void;

/**
 * @class
 * @mixin
 * @param {string} name - Short name of your script
 * @param {string} author - Your name and your email address in the form of: `your name <your-email@example.com>`
 * @param {string} description - A longer description - tell the user what exactly your script does
 * @param {string} version - Start with something like 1.0 and increase it with every release
 * @param {boolean} [autorun] - Set to true, if you want the script to be run on every instance, without the option to disable it.
 * @param {string[]} [backends]
 * Per default scripts will only be available on TS3 instances.
 * If your script supports Discord (or in the future maybe other backends) as well, you have to specify this explicitly by setting this variable to an array containing all backends: `backends: ["ts3", "discord"]`
 * @param {boolean} [enableWeb]
 * If your script required own web content, you can set enableWeb to true and put files into the ./scripts/scriptname/html directory.
 * After restart, the script title will be clickable and lead to an index.html inside that html-directory you just created.
 * From there you have access to the localStorage variables containing the login and may communicate with the bot api from your own pages.
 * @param {string} [engine] - Sets the required engine version (bot version). This uses [Semantic Versioning](https://semver.org). Example: `engine: ">= 0.9.16"`
 * @param {boolean} [hidden]
 * Hides the script from the settings page. Should be used together with autorun.
 * Hidden scripts can not have variables (vars), since they'd never be shown and thus not configurable.
 * @param {string[]} [requiredModules]
 * Using this, you can define which restricted modules the script wants to use. If it's not allowed via the config, the script will not load at all but instead return an error on startup.
 * If you only optionally use features from restricted modules, don't use this but provide a fallback in your script.
 * @param {Object[]} [vars] - More information about the usage of variables can be found [here](https://wiki.sinusbot.com/en:guides:features:scripts:variables).
 * @param {string[]} [voiceCommands]
 * This parameter is only used for the speech recognition feature and may contain one or more strings that are to be detected for the given script.
 * You can find more details on how to use it here: [Speech Recognition](https://wiki.sinusbot.com/en:guides:features:speechrecognition)
 */
declare interface Manifest {
}

/**
 * @mixin Engine
 * @example
 * var engine = require('engine');
 * engine.log('Hello from a script!');
 */
declare interface Engine {
    /**
     * @returns {string} Current instances' unique identifier
     */
    getInstanceID(): string;
    /**
     * @returns {string} Current bots' unique identifier
     */
    getBotID(): string;
    /**
     * Returns the name of the used backend (e.g. "ts3" or "discord")
     * @returns {string} Backend
     */
    getBackend(): string;
    /**
     * @description
     * sets the log level of the instance
     * ```
     * level | what gets logged
     * ---|---
     * 0 | no log messages
     * 1 | errors only
     * 2 | errors and warnings
     * 3 | errors, warnings, information
     * 4 | ...
     * 10 | most verbose
     * 11 | most verbose + external backends
     * ```
     * @param {number} level - Log level to set
     * @returns {boolean}
     */
    setInstanceLogLevel(level: number): boolean;
    /**
     * @description
     * Sets the log level of the bot
     * ```
     * level | what gets logged
     * ---|---
     * 0 | no log messages
     * 1 | errors only
     * 2 | errors and warnings
     * 3 | errors, warnings, information
     * 4 | ...
     * 10 | most verbose
     * 11 | most verbose + external backends
     * ```
     * @param {number} level - Log level to set
     * @returns {boolean}
     */
    setBotLogLevel(level: number): boolean;
    /**
     * Returns the log level of the instance
     * @returns {number} The set loglevel
     */
    getInstanceLogLevel(): number;
    /**
     * Returns the log level of the bot
     * @returns {number} The set loglevel
     */
    getBotLogLevel(): number;
    /**
     * Reloads all scripts; requires the corresponding setting in the config.ini to be enabled
     * @returns {boolean}
     */
    reloadScripts(): boolean;
    /**
     * Returns the configured nickname - to get the actual nickname, use the backend module
     * @returns {string}
     */
    getNick(): string;
    /**
     * Sets the nick to a new value and updates it on the server
     * @param {string} nick - New nick
     * @returns {boolean}
     */
    setNick(nick: string): boolean;
    /**
     * Sets the default channel by its ID
     * @param {string} channelID
     * @returns {boolean}
     */
    setDefaultChannelID(channelID: string): boolean;
    /**
     * Returns true if the backend of this instance has been started
     * @returns {boolean}
     */
    isRunning(): boolean;
    /**
     * Sends a notification to all users that are currently using the webinterface; use this for startup errors
     * @param {string} message - Message to send
     */
    notify(message: string): void;
    /**
     * Stores the given object as configuration for the current script
     * @param {Object} config
     * @returns {boolean}
     */
    saveConfig(config: any): boolean;
    /**
     * Logs to stdout / instance log
     * @param {any} log
     */
    log(log: any): void;
    /**
     * Exports an Object, so other Scripts are able to use functions or values of the Script
     * @param {Object} obj - Object which should get exported
     * @example
     * // scriptname: exportscript.js
     * var engine = require('engine');
     * var publicvariable = 'I get exportet!';
     * engine.export({
     *     // returns the value of 'publicvariable'
     *     get: function get() {
     *         return publicvariable;
     *     },
     *     // modifies the value of 'publicvariable'
     *     set: function get(value) {
     *         publicvariable = value;
     *     }
     * })
     * @example
     * var event = require('event');
     * var engine = require('engine');
     * event.on('load', function() {
     *     // must always be loaded AFTER the 'load' event
     *     var script = require('exportscript.js');
     *     engine.log(script.get()); // logs 'I get exportet!'
     *     script.set('New Value');
     *     engine.log(script.get()); // logs 'New Value'
     * });
     */
    export(obj: any): void;
    /**
     * @description
     * removes the current avatar image
     * @returns {boolean}
     */
    removeAvatar(): boolean;
    /**
     * @description
     * sets the avatar image to the album art of a given track
     * @param {Track} track - Track to extract the album art from
     * @returns {boolean}
     */
    setAvatarFromTrack(track: Track): boolean;
    /**
     * @description
     * sets the avatar image to the manually uploaded image
     * @returns {boolean}
     */
    setDefaultAvatar(): boolean;
    /**
     * @description
     * sets the avatar to the rendered output of a banner template
     * @param {string} bannerName - banner template to use
     * @returns {boolean}
     * @version 0.12.0
     */
    setAvatarFromBanner(bannerName: string): boolean;
    /**
     * @description Gets the users of the SinusBot
     * @version 0.13.37
     * @returns {User[]}
     */
    getUsers(): (User)[];
    /**
     * @description Gets a SinusBot user by his ID
     * @version 0.13.37
     * @param {string} id - ID of the SinusBot user
     * @returns {?User}
     */
    getUserById(id: string): User;
    /**
     * @description Gets a Sinusbot user by his name.
     * @version 0.13.37
     * @param {string} name - Name of the user
     * @returns {?User}
     */
    getUserByName(name: string): User;
}

/**
 * @mixin Store
 * @example
 * var store = require('store');
 * store.set('foo', 'bar');
 */
declare interface Store {
    /**
     * Stores a variable under the given key
     * the values stored are only available for the current script, but shared between instances of it
     * @param {string} key
     * @param {any} value - Value to be stored; must be JSON.stringify()-able
     * @returns {boolean}
     * @example
     * var store = require('store');
     * store.set('foo', 'bar');
     */
    set(key: string, value: any): boolean;
    /**
     * Gets a variable that has been stored previously by set()
     * the values stored are only available for the current script, but shared between instances of it
     * @param {string} key
     * @returns {any} Stored value - or undefined, if not found
     * @example
     * var store = require('store');
     * var foo = store.get('foo');
     */
    get(key: string): any;
    /**
     * Deletes a stored variable by its key
     * the values stored are only available for the current script, but shared between instances of it
     * @param {string} key
     */
    unset(key: string): void;
    /**
     * Returns an array of all set keys
     * the values stored are only available for the current script, but shared between instances of it
     * @returns {string[]} Array of all stored keys
     */
    getKeys(): string[];
    /**
     * Returns all stored items
     * the values stored are only available for the current script, but shared between instances of it
     * @returns {Object} Keys of this object are the keys of each entry
     */
    getAll(): any;
    /**
     * Stores a variable under the given key
     * the values stored are available for every script of every instance
     * @param {string} key
     * @param {any} value - Value to be stored; must be JSON.stringify()-able
     * @returns {boolean}
     */
    setGlobal(key: string, value: any): boolean;
    /**
     * Gets a variable that has been stored previously by set()
     * the values stored are available for every script of every instance
     * @param {string} key
     * @returns {any} Stored value - or undefined, if not found
     */
    getGlobal(key: string): any;
    /**
     * Deletes a stored variable by its key
     * the values stored are available for every script of every instance
     * @param {string} key
     */
    unsetGlobal(key: string): void;
    /**
     * Returns an array of all set keys
     * the values stored are available for every script of every instance
     * @returns {string[]} Array of all stored keys
     */
    getKeysGlobal(): string[];
    /**
     * Returns all stored items
     * the values stored are available for every script of every instance
     * @returns {Object} Keys of this object are the keys of each entry
     */
    getAllGlobal(): any;
    /**
     * Stores a variable under the given key
     * the values stored are available only for the current instance of the script (not shared between instances and / or other scripts)
     * @param {string} key
     * @param {any} value - Value to be stored; must be JSON.stringify()-able
     * @returns {boolean}
     */
    setInstance(key: string, value: any): boolean;
    /**
     * Gets a variable that has been stored previously by set()
     * the values stored are available only for the current instance of the script (not shared between instances and / or other scripts)
     * @param {string} key
     * @returns {any} Stored value - or undefined, if not found
     */
    getInstance(key: string): any;
    /**
     * Deletes a stored variable by its key
     * the values stored are available only for the current instance of the script (not shared between instances and / or other scripts)
     * @param {string} key
     */
    unsetInstance(key: string): void;
    /**
     * Returns an array of all set keys
     * the values stored are available only for the current instance of the script (not shared between instances and / or other scripts)
     * @returns {string[]} Array of all stored keys
     */
    getKeysInstance(): string[];
    /**
     * Returns all stored items
     * the values stored are available only for the current instance of the script (not shared between instances and / or other scripts)
     * @returns {Object} Keys of this object are the keys of each entry
     */
    getAllInstance(): any;
}

/**
 * @mixin Backend
 */
declare interface Backend {
    /**
     * @description Connects to the server
     * @returns {boolean}
     */
    connect(): boolean;
    /**
     * @description Disconnects from the server
     * @returns {boolean}
     */
    disconnect(): boolean;
    /**
     * Returns true if the backend is connected to a server
     * @returns {boolean}
     */
    isConnected(): boolean;
    /**
     * @returns {string} Current bots' unique identifier
     */
    getBotClientID(): string;
    /**
     * @returns {Client} Client of the bot
     */
    getBotClient(): Client;
    /**
     * Returns the actual nickname; To get the configured nickname, use engine.getNick() instead.
     * @returns {string}
     */
    getNick(): string;
    /**
     * Returns a channel if found
     * @param {string} id
     * @returns {Channel}
     * @example
     * var backend = require('backend');
     * var channel = backend.getChannelByID('6');
     */
    getChannelByID(id: string): Channel;
    /**
     * Returns the (primary) channel the bot is in
     * @returns {Channel}
     * @example
     * var backend = require('backend');
     * var channel = backend.getCurrentChannel();
     */
    getCurrentChannel(): Channel;
    /**
     * Returns a channel if found
     * @param {string} name
     * @returns {Channel}
     * @example
     * var backend = require('backend');
     * var channel = backend.getChannelByName('Welcome Channel');
     */
    getChannelByName(name: string): Channel;
    /**
     * Returns the total number of channels
     * @returns {number}
     * @example
     * var backend = require('backend');
     * var count = backend.getChannelCount();
     */
    getChannelCount(): number;
    /**
     * Returns all channels
     * @returns {Channel[]}
     * @example
     * // Logs the name of all channels
     * var backend = require('backend');
     * var engine = require('engine');
     * var channels = backend.getClients();
     * channels.forEach(function(channel) {
     *     engine.log(channel.name);
     * });
     */
    getChannels(): (Channel)[];
    /**
     * Returns all clients
     * @returns {Client[]}
     * @example
     * // Gets a list of all clients and sends them a message
     * var backend = require('backend');
     * var clients = backend.getClients();
     * clients.forEach(function(client) {
     *     client.chat('Hello ', + client.Name() + '. I\'m a SinusBot!');
     * });
     */
    getClients(): (Client)[];
    /**
     * Returns a client by its temporary ID (changes when the client reconnects)
     * @param {string} id
     * @returns {Client}
     */
    getClientByID(id: string): Client;
    /**
     * Returns a client by its name/nickname
     * @param {string} name
     * @returns {Client}
     */
    getClientByName(name: string): Client;
    /**
     * Alias of getClientByName
     * @param {string} name
     * @returns {Client}
     */
    getClientByNick(name: string): Client;
    /**
     * Returns an (online) client by its permanent id
     * @param {string} uniqueID
     * @returns {Client}
     */
    getClientByUniqueID(uniqueID: string): Client;
    /**
     * Alias of getClientByUniqueID
     * @param {string} uniqueID
     * @returns {Client}
     */
    getClientByUID(uniqueID: string): Client;
    /**
     * @description Sends a message to the server
     * @param {string} msg - Message to send
     * @example
     * var backend = require('backend');
     * backend.chat('Hello from SinusBot!');
     */
    chat(msg: string): void;
    /**
     * @description Creates a new channel
     * @version 0.9.16.3
     * @param {ChannelParams} channelParams
     * @returns {Channel} - Channel which was created
     */
    createChannel(channelParams: ChannelParams): Channel;
    /**
     * Returns a servergroup by its ID
     * @param {string} id ServerGroup ID
     * @returns {ServerGroup}
     */
    getServerGroupByID(id: string): ServerGroup;
    /**
     * Returns a channelgroup by its ID
     * @param {string} id - ChannelGroup ID
     * @returns {ChannelGroup}
     */
    getChannelGroupByID(id: string): ChannelGroup;
    /**
     * Returns an array of all known server groups
     * @returns {ServerGroup[]}
     */
    getServerGroups(): (ServerGroup)[];
    /**
     * Returns an array of all known channel groups
     * @returns {ChannelGroup[]}
     */
    getChannelGroups(): (ChannelGroup)[];
}

/**
 * @mixin Media
 */
declare interface Media {
    /**
     * @description Plays a track via internal url
     * @param {string} url - Internal url (like track://...)
     * @returns {boolean}
     */
    playURL(url: string): boolean;
    /**
     * Returns the current track
     * @returns {Track}
     */
    getCurrentTrack(): Track;
    /**
     * Returns the track with the given ID (or null if none was found)
     * @returns {?Track}
     */
    getTrackByID(): Track;
    /**
     * @description Searches for tracks matching the search term, returns 20 entries at most
     * @param {string} searchString
     * @returns {Track[]}
     * @example
     * var event = require('event');
     * var media = require('media');
     * event.on('chat', function(ev) {
     *     var params = ev.text.split(' ');
     *     if (params.length == 1) {
     *         ev.client.chat('Please enter a searchterm after .play - like .play november rain');
     *         return;
     *     }
     *     if (params[0] == '.play') {
     *         params.shift();
     *         var results = media.search(params.join(' '));
     *         if (results.length > 0) {
     *             results[0].play();
     *             ev.client.chat('Playing - just for you: ' + results[0].artist() + ' - ' + results[0].title());
     *         } else {
     *             ev.client.chat('Sorry, I could not find anything that matched your search.');
     *         }
     *     }
     * });
     */
    search(searchString: string): (Track)[];
    /**
     * @description Adds the given url to the queue
     * @param {string} url
     * @returns {boolean}
     */
    enqueue(url: string): boolean;
    /**
     * @description Adds the given url as the first entry in the queue
     * @param {string} url
     * @returns {boolean}
     * @version 0.12.0
     */
    playAsNext(url: string): boolean;
    /**
     * @description Plays the next track of the queue / playlist
     */
    playNext(): void;
    /**
     * @description Plays the next previous of the queue / playlist
     */
    playPrevious(): void;
    /**
     * @description Stops playback completely
     * @param {string} trackID - (optional) the track to stop; if not present, all tracks will be stopped
     * @returns {boolean}
     */
    stop(trackID: string): boolean;
    /**
     * Returns all tracks of the queue
     * @returns {Track[]}
     */
    getQueue(): (Track)[];
    /**
     * Returns all playlists
     * @returns {Playlist[]}
     */
    getPlaylists(): (Playlist)[];
    /**
     * Returns the playlists with the given id
     * @returns {Playlist}
     */
    getPlaylistByID(): Playlist;
    /**
     * Returns the currently active playlist
     * @returns {Playlist}
     */
    getActivePlaylist(): Playlist;
    /**
     * @description Removes the track at a given position from the queue
     * @param {number} index - Index of the track that should be removed from the queue (0 being the first entry)
     * @returns {boolean}
     */
    removeFromQueue(index: number): boolean;
    /**
     * @description Removes all entries from the queue
     * @returns {boolean}
     */
    clearQueue(): boolean;
    /**
     * @description Clears the current playlist (if set) so that playback won't continue inside that playlist
     * @returns {boolean}
     */
    clearPlaylist(): boolean;
    /**
     * @description Streams a file via youtube-dl
     * @param {string} url - Url that youtube-dl supports
     */
    yt(url: string): void;
    /**
     * @description Downloads a file via youtube-dl, optionally plays it
     * @param {string} url - Url that youtube-dl supports
     * @param {boolean} play - Set to true to play after download
     */
    ytdl(url: string, play: boolean): void;
    /**
     * @description Enqueues a stream via youtube-dl
     * @param {string} url - Url that youtube-dl supports
     */
    enqueueYt(url: string): void;
    /**
     * @description Downloads a file via youtube-dl, then enqueues it
     * @param {string} url - Url that youtube-dl supports
     */
    enqueueYtdl(url: string): void;
}

/**
 * @mixin Audio
 */
declare interface Audio {
    /**
     * @description Applies an audiofilter to the audio output
     * @param {string} filter - ffmpeg compatible filter string
     * @returns {boolean}
     */
    setAudioFilter(filter: string): boolean;
    /**
     * @description Enables or disables audio return channel; required for speech recognition engine / recording
     * @param {number} flags - bitmask; use 0x01 for general audio return (recording) or 0x02 for separated audio (for speech recognition) - 0x03 for both
     * @returns {boolean}
     * @version 0.13.37
     */
    setAudioReturnChannel(flags: number): boolean;
    /**
     * @description Starts recording to a file
     * @returns {boolean}
     */
    startRecording(): boolean;
    /**
     * @description Stops recording to a file
     * @returns {boolean}
     */
    stopRecording(): boolean;
    /**
     * @description Streams audio output to an icecast-server
     * @param {string} url - Endpoint to stream to
     * @param {string} username - Username used for authentication
     * @param {string} password - Password
     * @returns {boolean}
     */
    streamToServer(url: string, username: string, password: string): boolean;
    /**
     * @description Stops streaming started with streamToServer
     * @returns {boolean}
     */
    stopStream(): boolean;
    /**
     * Returns the state of repeat-mode
     * @returns {boolean}
     */
    isRepeat(): boolean;
    /**
     * @description Sets the state of repeat-mode
     * @param {boolean} val
     */
    setRepeat(val: boolean): void;
    /**
     * Returns the state of shuffle-mode
     * @returns {boolean}
     */
    isShuffle(): boolean;
    /**
     * @description Sets the state of shuffle-mode
     * @param {boolean} val
     */
    setShuffle(val: boolean): void;
    /**
     * Returns the current volume (0-100)
     * @returns {number} volume
     */
    getVolume(): number;
    /**
     * @description Sets the volume (0-100)
     * @param {number} volume
     * @returns {boolean}
     */
    setVolume(volume: number): boolean;
    /**
     * Returns the position of the current track
     * @returns {number} position (in seconds)
     */
    getTrackPosition(): number;
    /**
     * @description Seeks to a specific position
     * @param {number} pos - New position (in seconds)
     */
    seek(pos: number): void;
    /**
     * Returns if the audio output has been muted
     * @returns {boolean}
     */
    isMute(): boolean;
    /**
     * @description Enables/disables mute
     * @param {boolean} mute
     * @returns {boolean}
     */
    setMute(mute: boolean): boolean;
    /**
     * @returns {boolean} Whether the bot is playing music
     */
    isPlaying(): boolean;
    /**
     * @description Plays audio returned from the text-to-speech engine
     * @param {string} text - Text to say
     * @param {string} [locale] - Locale to use
     */
    say(text: string, locale?: string): void;
    /**
     * @description Returns the client count of the connected server
     * @returns {number} client count
     */
    getClientCount(): number;
    /**
     * @description Sets the volume of a specific stream (0-100)
     * @param {string} streamID - name or alias of the stream(s) to modify
     * @param {number} volume
     * @returns {boolean}
     */
    setStreamVolume(streamID: string, volume: number): boolean;
}

/**
 * @mixin Format
 */
declare interface Format {
    /**
     * @description Apply color if the backend supports it
     * @param {string} text - Text that should be colored
     * @param {string} color - Hex value of color to apply
     * @returns {string} Formatted string
     * @example
     * // Sends a red-colored message to the server chat (requires permission to do so)
     * var backend = require('backend');
     * var format = require('format');
     * backend.chat('This is SinusBot writing in ' + format.formatColor('red', '#aa0000'));
     */
    color(text: string, color: string): string;
    /**
     * @description Apply italic formatting to text
     * @param {string} text
     * @returns {string} Formatted string
     * @example
     * // Sends a formattes message to the server chat (requires permission to do so)
     * var backend = require('backend');
     * var format = require('format');
     * backend.chat('Part of this message is ' + format.italic('italic'));
     */
    italic(text: string): string;
    /**
     * @description Apply bold formatting to text
     * @param {string} text
     * @returns {string} Formatted string
     * @example
     * // Sends a formattes message to the server chat (requires permission to do so)
     * var backend = require('backend');
     * var format = require('format');
     * backend.chat('Part of this message is ' + format.bold('bold'));
     */
    bold(text: string): string;
    /**
     * @description Apply underlined formatting to text
     * @param {string} text
     * @returns {string} Formatted string
     * @example
     * // Sends a formatted message to the server chat (requires permission to do so)
     * var backend = require('backend');
     * var format = require('format');
     * backend.chat('Part of this message is ' + format.underline('underlined'));
     */
    underline(text: string): string;
    /**
     * @description Formats text as code
     * @param {string} text
     * @returns {string} Formatted string
     */
    code(text: string): string;
}

/**
 * @mixin Helpers
 */
declare interface Helpers {
    /**
     * @description Returns a random integer between zero and <max>
     * @param {number} max
     * @returns {number} Random integer
     */
    getRandom(max: number): number;
    /**
     * @description Gets the string representation of an object
     * @param {Object} input
     * @returns {string}
     */
    toString(input: any): string;
    /**
     * @description Encodes a string to base64
     * @param {string} input
     * @returns {string}
     */
    base64Encode(input: string): string;
    /**
     * @description Decodes a string from base64
     * @param {string} input
     * @returns {string}
     */
    base64Decode(input: string): string;
    /**
     * @description Encodes a string to hex
     * @param {string} input
     * @returns {string}
     */
    hexEncode(input: string): string;
    /**
     * @description Decodes a string from hex
     * @param {string} input
     * @returns {string}
     */
    hexDecode(input: string): string;
    /**
     * @description Generate a hex-encoded MD5 checksum of the given input
     * @param {string} input
     * @returns {string}
     */
    MD5Sum(input: string): string;
    /**
     * @description Generate a hex-encoded SHA1 checksum of the given input
     * @param {string} input
     * @returns {string}
     */
    SHA1Sum(input: string): string;
    /**
     * @description Generate a hex-encoded SHA256 checksum of the given input
     * @param {string} input
     * @returns {string}
     */
    SHA256Sum(input: string): string;
}

/**
 * @class
 * @mixin
 * @fires api:$eventName
 * @fires discord:$eventName
 * @fires chat
 * @fires poke
 * @fires typing
 * @fires track
 * @fires trackInfo
 * @fires trackEnd
 * @fires connect
 * @fires connectionFailed
 * @fires disconnect
 * @fires clientMove
 * @fires clientNick
 * @fires clientVisible
 * @fires clientInvisible
 * @fires clientKicked
 * @fires clientKickedFromChannel
 * @fires clientIPAddress
 * @fires clientAway
 * @fires clientBack
 * @fires clientRecord
 * @fires clientRecordStop
 * @fires clientMute
 * @fires clientUnmute
 * @fires clientDeaf
 * @fires clientUndeaf
 * @fires serverGroupAdded
 * @fires serverGroupRemoved
 * @fires channelCreate
 * @fires channelUpdate
 * @fires channelDelete
 * @fires speech
 * @fires talkerCount
 * @fires unload
 * @fires load
 * @example
 * var event = require('event');
 * var engine = require('engine');
 * event.on('chat', function(ev) {
 *     engine.log('Got message "'+ev.text +'" from '+ ev.client.name());
 * })
 */
declare interface Event {
    /**
     * @description Registers an event listener
     * @param {string} eventName - Event to listen to
     * @param {function} callback - Gets called when the given event is triggered
     */
    on(eventName: string, callback: any): void;
    /**
     * @description Emits an event to the current instance
     * @param {string} eventName - Name of the event to be emitted
     * @param {Object} data - A data object to be sent with the event
     */
    emit(eventName: string, data: any): void;
    /**
     * @description Emits an event to all instances
     * @param {string} eventName - Name of the event to be emitted
     * @param {Object} data - A data object to be sent with the event
     */
    broadcast(eventName: string, data: any): void;
}

/**
 * @class
 * @mixin
 */
declare interface APIEvent {
    /**
     * @returns {string} Name of the event
     */
    name(): string;
    /**
     * @returns {Object} Json body
     */
    data(): any;
    /**
     * @returns {?User} User that called the event (or null, if unset)
     */
    user(): User;
    /**
     * @returns {string} Remote address that triggered the call
     */
    remoteAddr(): string;
}

/**
 * @class
 * @mixin
 * @property {string} text - Text of the message
 * @property {Channel} channel - Channel (if given) this message has been sent on
 * @property {Client} client - Client that sent the message
 * @property {number} mode - Number representing the way this message has been sent
 * (1 = private, 2 = channel, 3 = server)
 */
declare interface Message {
}

/**
 * @class
 * @mixin
 * @property {?Channel} fromChannel - Old channel (or null if the client just got online / changed visibility)
 * @property {?Channel} toChannel - New channel (or null if the client just went offline / changed visibility)
 * @property {Client} client - Client that was moved
 * @property {Client} invoker - Client that invoked the move
 */
declare interface MoveInfo {
}

/**
 * @class
 * @mixin
 * @description Note: if the client is inivisible to the bot, some fields might not be available.
 */
declare interface Client {
    /**
     * @returns {string} Name/nickname of the client
     */
    name(): string;
    /**
     * Alias of name()
     * @returns {string} Name/nickname of the client
     */
    nick(): string;
    /**
     * @returns {string} Phonetic name of the client; useful for tts
     */
    phoneticName(): string;
    /**
     * @returns {string} Temporary ID of the client
     */
    id(): string;
    /**
     * Alias of uniqueId()
     * @returns {string} Unique ID of the client
     */
    uid(): string;
    /**
     * @returns {string} Unique ID of the client
     */
    uniqueId(): string;
    /**
     * @returns {string} TeamSpeak database ID of the client
     */
    databaseID(): string;
    /**
     * @returns {string} Country of the client
     */
    country(): string;
    /**
     * @returns {string} Description of the client
     */
    description(): string;
    /**
     * @param {string} description
     * @version 0.9.19
     */
    setDescription(description: string): void;
    /**
     * @returns {number} Number of times the client has connected
     */
    getTotalConnectionsCount(): number;
    /**
     * Returns true when this client is the bot itself
     * @returns {boolean}
     */
    isSelf(): boolean;
    /**
     * Returns if the client is recording the conversation
     * @returns {string}
     */
    isRecording(): string;
    /**
     * Returns if the client is muted (has its microphone disabled)
     * @returns {boolean}
     */
    isMuted(): boolean;
    /**
     * Returns if the client is deaf (has its loudspeakers disabled)
     * @returns {boolean}
     */
    isDeaf(): boolean;
    /**
     * Returns if the client is away
     * @returns {boolean}
     */
    isAway(): boolean;
    /**
     * Returns the clients' servergroups
     * @returns {ServerGroup[]}
     */
    getServerGroups(): (ServerGroup)[];
    /**
     * Returns the clients' channelgroup
     * @returns {ChannelGroup}
     */
    getChannelGroup(): ChannelGroup;
    /**
     * Returns the clients' away message (if set)
     * @returns {string}
     */
    getAwayMessage(): string;
    /**
     * Returns the clients' last ping time (latency)
     * @returns {number}
     */
    getPing(): number;
    /**
     * Returns the clients' ip address (if available)
     * @returns {string}
     */
    getIPAddress(): string;
    /**
     * Returns the clients' online time (requires special permissions)
     * @returns {number} in milliseconds
     */
    getOnlineTime(): number;
    /**
     * Returns the clients' current idle time (requires special permissions)
     * @returns {number} in milliseconds
     */
    getIdleTime(): number;
    /**
     * Returns the clients' packet loss percentage (requires special permissions)
     * @returns {number}
     */
    getPacketLoss(): number;
    /**
     * Returns the clients' amount of received data (requires special permissions)
     * @returns {number}
     */
    getBytesReceived(): number;
    /**
     * Returns the clients' amount of sent data (requires special permissions)
     * @returns {number}
     */
    getBytesSent(): number;
    /**
     * Returns the total number of connections from that client
     * On TS3, this information has to be actively requested from the server. If the bot is unable to get it or hasn't received an answer in time, it will return <= 0 here.
     * @returns {number}
     */
    getTotalConnections(): number;
    /**
     * Returns the time the client has been created / was first seen by the server
     * On TS3, this information has to be actively requested from the server. If the bot is unable to get it or hasn't received an answer in time, it will return <= 0 here.
     * @returns {number}
     */
    getCreationTime(): number;
    /**
     * Returns an array of all channels the client is in; even if TS only uses one channel for a client at a time, other backends might provide several
     * @returns {Channel[]} Array of channels
     */
    getChannels(): (Channel)[];
    /**
     * @returns {Channel} Current audio channel the client is in
     */
    getAudioChannel(): Channel;
    /**
     * @description Compares two clients
     * @param {Client} otherClient
     * @returns {boolean} true, if both clients are the same
     */
    equals(otherClient: Client): boolean;
    /**
     * @description Sends a message to the client
     * @param {string} msg - Message to send
     * @example
     * var backend = require('backend');
     * var client = backend.getClientByName('Bob');
     * client.chat('Hello, ' + client.Name());
     */
    chat(msg: string): void;
    /**
     * @description Pokes the client with a message
     * @param {string} msg - Message to send
     * @example
     * var backend = require('backend');
     * var client = backend.getClientByName('Bob');
     * client.chat('Pokeypoke, ' + client.Name() + '!');
     */
    poke(msg: string): void;
    /**
     * @description Bans a client
     * @param {number} time - Amount of time the ban should last
     * @param {string} msg - Message to send
     * @example
     * var backend = require('backend');
     * var client = backend.getClientByName('Bob');
     * client.ban(100, 'See you in 100 seconds, ' + client.Name() + '!');
     */
    ban(time: number, msg: string): void;
    /**
     * @description Kicks the client from the server
     * @param {string} msg - Message to send
     */
    kick(msg: string): void;
    /**
     * @description Kicks the client from the server
     * @param {string} msg - Message to send
     */
    kickFromServer(msg: string): void;
    /**
     * @description Kicks the client from the channel
     * @param {string} msg - Message to send
     */
    kickFromChannel(msg: string): void;
    /**
     * @description Adds a client to a specific ServerGroup
     * @param {(ServerGroup|string|number)} group - Servergroup the client should be added to
     */
    addToServerGroup(group: ServerGroup | string | number): void;
    /**
     * @description Removes a client from a specific ServerGroup
     * @param {(ServerGroup|string|number)} group - Servergroup the client should be removed from
     */
    removeFromServerGroup(group: ServerGroup | string | number): void;
    /**
     * @description Moves a client to another channel
     * @param {Channel} target - Channel the client should be moved to
     * @param {string} [password] - Password for the target channel, if required
     */
    moveTo(target: Channel, password?: string): void;
    /**
     * @description Enables / disables subscription for this client; requires subscription mode
     * @param {boolean} val
     */
    setSubscription(val: boolean): void;
    /**
     * @description Returns the platform of the client (Windows, Linux, MacOS)
     * @returns {string} platform
     */
    getPlatform(): string;
    /**
     * @description Returns the version of the client
     * @returns {string} version
     */
    getVersion(): string;
    /**
     * @description Returns the client type (Query=0; Normal=1)
     * @returns {string} client type
     */
    type(): string;
}

/**
 * @class
 * @mixin
 * @property {client} client - Client that has been added / removed
 * @property {client} invoker - Client that added client to the group
 * @property {serverGroup} serverGroup - Server Group
 */
declare interface ClientServergroupEvent {
}

/**
 * @class
 * @mixin
 */
declare interface Channel {
    /**
     * @returns {string} ID
     */
    id(): string;
    /**
     * @returns {string} Name
     */
    name(): string;
    /**
     * @returns {?Channel} Parent of channel or null if none is set
     */
    parent(): Channel;
    /**
     * @version 0.9.16.3
     * @returns {number} Order / position of this channel.
     * For ts3 this is a numeric value determining the order in which channels are displayed below their parent. To set a new value, please use moveTo.
     */
    position(): number;
    /**
     * @description delete the current channel
     * @version 0.9.17
     * @returns {boolean}
     */
    delete(): boolean;
    /**
     * @description Moves the channel to a new parent with a new position value
     * @version 0.9.16.3
     * @param {(string|Channel)} parent - New parent channel
     * @param {number} order - New order value
     */
    moveTo(parent: string | Channel, order: number): void;
    /**
     * @param {string} name
     * @version 0.9.16
     */
    setName(name: string): void;
    /**
     * @returns {number} Type (0 = voice, 1 = text)
     */
    type(): number;
    /**
     * @returns {string} Topic
     */
    topic(): string;
    /**
     * @param {string} topic
     * @version 0.9.16
     */
    setTopic(topic: string): void;
    /**
     * @version 0.9.19
     * @returns {string} Description
     */
    description(): string;
    /**
     * @param {string} description
     * @version 0.9.16
     */
    setDescription(description: string): void;
    /**
     * @returns {number} Codec
     */
    codec(): number;
    /**
     * @param {number} codec
     * @version 0.9.16
     */
    setCodec(codec: number): void;
    /**
     * @returns {number} Codec quality
     */
    codecQuality(): number;
    /**
     * @param {number} quality
     * @version 0.9.16
     */
    setCodecQuality(quality: number): void;
    /**
     * @returns {number} Configured number of clients the channel can hold (-1 if unlimited)
     */
    maxClients(): number;
    /**
     * @param {boolean} maxClients Set to -1 for unlimited clients
     * @version 0.9.16
     */
    setMaxClients(maxClients: boolean): void;
    /**
     * @returns {number}
     */
    maxFamilyClients(): number;
    /**
     * @param {boolean} maxFamilyClients
     * @version 0.9.16
     */
    setMaxFamilyClients(maxFamilyClients: boolean): void;
    /**
     * @returns {boolean} Whether channel is permanent or not
     */
    isPermanent(): boolean;
    /**
     * @param {boolean} permanent
     * @version 0.9.16
     */
    setPermanent(permanent: boolean): void;
    /**
     * @returns {boolean} Whether channel is semi-permanent or not
     */
    isSemiPermanent(): boolean;
    /**
     * @param {boolean} permanent
     * @version 0.9.16
     */
    setSemiPermanent(permanent: boolean): void;
    /**
     * @returns {boolean} Whether channel is the default one
     */
    isDefault(): boolean;
    /**
     * @returns {boolean} Whether channel is password-protected or not
     */
    isPassworded(): boolean;
    /**
     * @returns {boolean} Whether channel is encrypted or not
     */
    isEncrypted(): boolean;
    /**
     * @param {boolean} encrypted
     * @version 0.9.16
     */
    setEncrypted(encrypted: boolean): void;
    /**
     * @description Compares two channels
     * @param {Channel} otherChannel
     * @returns {boolean} True, if both channels are the same
     */
    equals(otherChannel: Channel): boolean;
    /**
     * @description Sends a chat message to the channel
     * @param {string} msg - Message to send
     */
    chat(msg: string): void;
    /**
     * @returns {Client[]} Clients that are in this channel
     */
    getClients(): (Client)[];
    /**
     * @returns {number} Number of clients that are in the channel
     */
    getClientCount(): number;
    /**
     * @description enables / disables subscription for this channel; requires subscription mode
     * @param {boolean} val
     */
    setSubscription(val: boolean): void;
    /**
     * @description Updates multiple channel parameters at once
     * @version 0.9.16.3
     * @param {ChannelParams} channelParams
     */
    update(channelParams: ChannelParams): void;
    /**
     * @description Assigns a client to a channel group
     * @version 0.9.18
     * @param {Client} client
     * @param {ChannelGroup} channelGroup
     */
    setChannelGroup(client: Client, channelGroup: ChannelGroup): void;
    /**
     * @description Gets the permissions for the channel from the server - this is an expensive call as the permissions are _not_ cached
     * @version 0.13.37
     * @returns {Permission[]}
     */
    getPermissions(): (Permission)[];
    /**
     * @description Adds/sets a new permission on the channel; you need to use the setters and then call save() to apply - can also be used to remove a permission by delete() afterwards
     * @version 0.13.37
     * @param {string} id - id of the permission to add; can also be supplied as name like i_channel_needed_join_power
     * @returns {Permission}
     */
    addPermission(id: string): Permission;
}

/**
 * @class
 * @mixin
 * @property {string} name - Displayname of the channel; mandatory on create
 * @property {(Channel|number|string)} parent - Parent channel (you can also use the channelId); ignored on update, mandatory on create
 * @property {string} description
 * @property {string} topic
 * @property {string} password
 * @property {number} codec - See codec types for explanation
 * @property {number} codecQuality
 * @property {boolean} encrypted - True by default
 * @property {boolean} permanent
 * @property {boolean} semiPermanent
 * @property {number} position
 * @property {number} maxClients - Set to -1 for unlimited clients
 * @property {number} maxFamilyClients
 * @property {boolean} default - Whether the channel is the default channel
 * @property {number} neededTalkPower - TS only; 0.9.19+
 * @property {number} deleteDelay - TS only; 0.9.19+
 * @property {number} icon - TS only; 0.9.19+
 * @description
 * Used to update or create a channel;
 * When creating a channel parent and name are mandatory for TS3;
 * When updating a channel parent will be ignored (use moveTo instead)
 */
declare interface ChannelParams {
}

/**
 * @class
 * @mixin
 */
declare interface ServerGroup {
    /**
     * @returns {string} ID of the server group
     */
    id(): string;
    /**
     * @returns {string} Name of the server group
     */
    name(): string;
    /**
     * @returns {string} ID of the icon used for the channel group
     * @version 0.12.0
     */
    icon(): string;
    /**
     * @description Adds a client by database ID to the servergroup
     * @returns {boolean} status if the request was successful
     * @version 0.13.37
     * @param {(Client|string|number)} client - The client can be a client object, string or number
     */
    addClientByDatabaseId(client: Client | string | number): boolean;
    /**
     * @description Gets the permissions for the servergroup from the server - this is an expensive call as the permissions are _not_ cached
     * @version 0.13.37
     * @returns {Permission[]}
     */
    getPermissions(): (Permission)[];
    /**
     * @description Adds/sets a new permission to the servergroup; you need to use the setters and then call save() to apply - can also be used to remove a permission by delete() afterwards
     * @version 0.13.37
     * @param {string} id - id of the permission to add; can also be supplied as name like i_channel_needed_join_power
     * @returns {Permission}
     */
    addPermission(id: string): Permission;
}

/**
 * @class
 * @mixin
 */
declare interface ChannelGroup {
    /**
     * @returns {string} ID of the channel group
     */
    id(): string;
    /**
     * @returns {string} Name of the channel group
     */
    name(): string;
    /**
     * @returns {string} ID of the icon used for the channel group
     * @version 0.12.0
     */
    icon(): string;
    /**
     * @description Gets the permissions for the channelgroup from the server - this is an expensive call as the permissions are _not_ cached
     * @version 0.13.37
     * @returns {Permission[]}
     */
    getPermissions(): (Permission)[];
    /**
     * @description Adds/sets a new permission to the channelgroup; you need to use the setters and then call save() to apply - can also be used to remove a permission by delete() afterwards
     * @version 0.13.37
     * @param {string} id - id of the permission to add; can also be supplied as name like i_channel_needed_join_power
     * @returns {Permission}
     */
    addPermission(id: string): Permission;
}

/**
 * @class
 * @mixin
 */
declare interface User {
    /**
     * @description Returns the ID of the user
     * @returns {string} ID of the User
     * @version 0.13.37
     */
    id(): string;
    /**
     * @description Returns the name of the user
     * @returns {string} Name of the User
     * @version 0.13.37
     */
    name(): string;
    /**
     * @description Returns the privileges of the user
     * @returns {number} Privileges of the user
     * @version 0.13.37
     */
    privileges(): number;
    /**
     * @description Returns the teamspeak unique ID of the bind client
     * @returns {string} teamspeak unique ID of the bind ts client
     * @version 0.13.37
     */
    tsUid(): string;
    /**
     * @description Returns the teamspeak group ID
     * @returns {string} ID of the bind teamspeak group
     * @version 0.13.37
     */
    tsGroupId(): string;
    /**
     * @description Checks if an user is an admin
     * @returns {boolean} Admin status of the user
     * @version 0.13.37
     */
    isAdmin(): boolean;
    /**
     * @description Sets a new password to the user
     * @returns {boolean} Success or not
     * @param {string} password - new password of the user
     * @version 0.13.37
     */
    setPassword(password: string): boolean;
    /**
     * @description Sets the teamspeak unique ID to the user
     * @returns {boolean} Success or not
     * @param {string} tsUid - teamspeak unique ID of the client
     * @version 0.13.37
     */
    setTSUid(tsUid: string): boolean;
    /**
     * @description Sets the privileges to an user
     * @returns {boolean} Success or not
     * @param {number} privileges - New privileges of the user
     * @version 0.13.37
     */
    setPrivileges(privileges: number): boolean;
    /**
     * @description Adds an privilege to an user
     * @returns {boolean} Success or not
     * @param {number} privilege - New privilege which should be added
     * @version 0.13.37
     */
    addPrivilege(privilege: number): boolean;
    /**
     * @description Removes an privilege from an user
     * @returns {boolean} Success or not
     * @param {number} privilege - Privilege which should be removed
     * @version 0.13.37
     */
    removePrivilege(privilege: number): boolean;
    /**
     * @description Deletes an user
     * @returns {boolean} Success or not
     * @version 0.13.37
     */
    delete(): boolean;
}

/**
 * @class
 * @mixin
 * @description handles channel, channelgroup and servergroup permissions; mainly for TS3
 * @version 0.13.37
 */
declare interface Permission {
    /**
     * @version 0.13.37
     * @returns {string} ID of the permission
     */
    id(): string;
    /**
     * @version 0.13.37
     * @returns {string} Name of the permission
     */
    name(): string;
    /**
     * @version 0.13.37
     * @returns {number} permission value
     */
    value(): number;
    /**
     * @version 0.13.37
     * @returns {boolean} true, if skip flag has been set - only applicable for ServerGroups
     */
    skip(): boolean;
    /**
     * @version 0.13.37
     * @returns {string} true, if negated flag has been set - only applicable for ServerGroups
     */
    negated(): string;
    /**
     * @description sets the value of the permission; you need to call save() to apply changes
     * @version 0.13.37
     * @param {boolean} val - true, if permission should be negated, false otherwise
     * @returns {boolean}
     */
    setNegated(val: boolean): boolean;
    /**
     * @description sets the skip flag - only applicable for ServerGroups; you need to call save() to apply changes
     * @version 0.13.37
     * @param {boolean} val - true, if permission should be skipped, false otherwise
     * @returns {boolean}
     */
    setSkip(val: boolean): boolean;
    /**
     * @description sets the negated flag - only applicable for ServerGroups; you need to call save() to apply changes
     * @version 0.13.37
     * @param {number} val - new value for the permission
     * @returns {boolean}
     */
    setValue(val: number): boolean;
    /**
     * @description applies the changed settings
     * @version 0.13.37
     * @returns {boolean}
     */
    save(): boolean;
    /**
     * @description delete the current permission
     * @version 0.13.37
     * @returns {boolean}
     */
    delete(): boolean;
}

/**
 * @class
 * @mixin
 */
declare interface Track {
    /**
     * @returns {string} Unique ID of the track
     */
    id(): string;
    /**
     * @returns {string} Unique url for the track
     */
    url(): string;
    /**
     * @returns {string} Type of the file
     */
    type(): string;
    /**
     * @returns {string} Title of the track
     */
    title(): string;
    /**
     * @returns {string} Artist of the track
     */
    artist(): string;
    /**
     * @returns {string} Temporary title of the track; e.g. when playing radio stations
     */
    tempTitle(): string;
    /**
     * @returns {string} Temporary artist of the track; e.g. when playing radio stations
     */
    tempArtist(): string;
    /**
     * @returns {string} Album of the track
     */
    album(): string;
    /**
     * @returns {string} Genre of the track
     * @version 0.9.16
     */
    genre(): string;
    /**
     * @returns {number} Duration of the track
     * @version 0.9.16
     */
    duration(): number;
    /**
     * @returns {number} Tracknumber of the track
     * @version 0.9.16
     */
    trackNumber(): number;
    /**
     * @returns {string} Path to the thumbnail, if any
     */
    thumbnail(): string;
    /**
     * @returns {string} Original filename
     */
    filename(): string;
    /**
     * @description Starts playback of the track
     * @returns {boolean}
     */
    play(): boolean;
    /**
     * @description Adds the track to the queue
     * @returns {boolean}
     */
    enqueue(): boolean;
    /**
     * @description Downloads a thumbnail from the internet and stores it for the given track
     * @param {string} url - Url to download the thumbnail from (limited to X MB)
     */
    setThumbnailFromURL(url: string): void;
    /**
     * @description Removes the thumbnail of a track
     */
    removeThumbnail(): void;
}

/**
 * @class
 * @mixin
 */
declare interface Playlist {
    /**
     * @returns {string} Unique identifier of the playlist
     */
    id(): string;
    /**
     * @returns {string} Name of the playlist
     */
    name(): string;
    /**
     * @returns {PlaylistTrack[]} List of all tracks inside the given playlist
     */
    getTracks(): (PlaylistTrack)[];
    /**
     * @description Sets the playlist to active; will continue playing songs from this playlist
     * @returns {boolean}
     */
    setActive(): boolean;
}

/**
 * @class
 * @mixin
 */
declare interface PlaylistTrack {
    /**
     * @returns {string} Title of the track
     */
    title(): string;
    /**
     * @returns {string} Artist of the track
     */
    artist(): string;
    /**
     * @returns {string} Album of the track
     */
    album(): string;
    /**
     * @returns {string} Url of the track (internal or external)
     */
    url(): string;
    /**
     * @description Starts playback of the track
     * @returns {boolean} success
     */
    play(): boolean;
}

/**
 * @mixin
 * @version 0.9.16
 * @example
 * var net = require('net');
 * var engine = require('engine');
 * var conn = net.connect({ host: '127.0.0.1', port: 80 }, function(err) {
 *     if (err) { engine.log(err); }
 * });
 * conn.on('data', function(x) {
 *     engine.log('got data');
 *     engine.log(x.toString());
 * })
 * if (conn) conn.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n");
 * @description
 * The net module is protected, it needs the following entry per script in your config.ini:
 * ```
 * [Scripts.Privileges]
 * scriptname = ["net"]
 * ```
 */
declare interface Net {
    /**
     * @param {ConnectParams} params - Connection parameters
     * @param {function} callback - Callback gets called on success / error;
     * if an error occured, exactly one parameter containing the error will be handed to the callback
     * @returns {?NetClient} Client connection, or null if failed to setup a connection
     * (e.g. wrong parameters; null does not mean that the connection failed, instead that it is handled in the callback)
     */
    connect(params: ConnectParams, callback: any): NetClient;
}

/**
 * @class
 * @mixin
 * @property {string} [host] - Host to connect to; required for mysql / postgres
 * @property {number} [port] - Port to use
 */
declare interface ConnectParams {
}

/**
 * @class
 * @mixin
 * @version 0.9.16
 * @fires error
 * @fires close
 * @fires data
 */
declare interface NetClient {
    /**
     * @description Sends data over the connection
     * @param {(string|number[])} bytes - Data that should be sent over the socket; one can also send an array of ints / bytes like [0, 255, 1, 1]
     * @param {string} [format] - Optional, if given bytes will be decoded prior to sending; Can be either "hex" or "base64".
     */
    write(bytes: string | number[], format?: string): void;
    /**
     * @description Registers a new event handler
     * @param {string} event - Name of the event to listen to
     * @param {function} callback
     */
    on(event: string, callback: any): void;
}

/**
 * @mixin
 * @version 0.9.20
 * @fires ws.connect
 * @fires ws.close
 * @fires ws.error
 * @fires ws.data
 * @example
 * SinusBot script:
 * var ws = require('ws');
 * var engine = require('engine');
 * var event = require('event');
 * event.on('ws.connect', function(id) {
 *     engine.log('new websocket connection; id ' + id);
 *     ws.broadcast(1, { blubb: 'blubb' });
 * });
 * event.on('ws.disconnect', function(id) {
 *     engine.log('websocket connection disconnected; id ' + id);
 * });
 * event.on('ws.data', function(id, type, data) {
 *     engine.log('ws.data: id ' + id + '; data: ' + data.toString());
 *     ws.write(id, type, data.toString());
 * });
 * @example
 * Client Side (served html files via the enableWeb script option):
 * var proto = (window.location.protocol == 'https:') ? 'wss' : 'ws';
 * var conn = new WebSocket(proto + "://" + document.location.host + "/api/v1/b/" + botId + "/i/" + instanceId + "/ws");
 * conn.onclose = function (evt) {
 * console.log('close', evt);
 *     alert('Closed.');
 * };
 * conn.send(JSON.stringify({ type: 'ping' }));
 * conn.onmessage = function (evt) {
 *     var data = JSON.parse(evt.data);
 * };
 * @description
 * Websocket Server:
 * The ws module is protected, it needs the following entry per script in your config.ini:
 * ```
 * [Scripts.Privileges]
 * scriptname = ["ws"]
 * ```
 */
declare interface Websockets {
    /**
     * @description Writes some data to the connection with given connectionId
     * @param {string} connectionId
     * @param {number} messageType
     * @param {(string|Bytes)} message - Actual message; can be given as string or byteshelper
     */
    write(connectionId: string, messageType: number, message: string | Bytes): void;
    /**
     * @description Broadcasts some data to all connected clients
     * @param {number} messageType
     * @param {(string|Bytes)} message - Actual message; can be given as string or byteshelper
     */
    broadcast(messageType: number, message: string | Bytes): void;
    /**
     * @description Closes the connection
     * @param {string} connectionId
     */
    close(connectionId: string): void;
}

/**
 * @class
 * @mixin
 * @version 0.9.16
 */
declare interface Bytes {
    /**
     * @returns {string} String representation of the bytes
     */
    toString(): string;
}

/**
 * @mixin
 * @version 0.9.16.4
 * @example
 * var db = require('db');
 * var engine = require('engine');
 * var helpers = require('helpers');
 * var dbc = db.connect({ driver: 'mysql', host: '127.0.0.1', username: 'demo', password: 'blah', database: 'foo' }, function(err) {
 *     if (err) {
 *          engine.log(err);
 *     }
 * });
 * if (dbc) dbc.exec("INSERT INTO blah (foo, foo2) VALUES (?, ?)", 'bar', 'bar2');
 * if (dbc) dbc.query("SELECT * FROM blah", function(err, res) {
 *     if (!err) {
 *          res.forEach(function(row) {
 *              engine.log(helpers.toString(row.foo));
 *          });
 *     }
 * });
 * @description
 * The database module is protected, it needs the following entry per script in your config.ini:
 * ```
 * [Scripts.Privileges]
 * scriptname = ["db"]
 * ```
 * Use additional parameters to exec / query whenever you use untrusted/unknown data, as those will automatically be escaped and avoid SQL injection.
 */
declare interface DB {
    /**
     * @param {DBParams} params - Connection parameters
     * @param {function} callback - Callback gets called on success / error;
     * If an error occured, exactly one parameter containing the error will be handed to the callback
     * @returns {?DBConn} Database connection or null if failed
     */
    connect(params: DBParams, callback: any): DBConn;
}

/**
 * @class
 * @mixin
 * @version 0.9.16.4
 */
declare interface DBConn {
    /**
     * @description
     * Use this, if you expect a result set;
     * Note: strings will be returned as byte arrays to be binary safe; to convert to actual strings, please use helpers.toString(column)
     * @param {string} queryString
     * @param {any} parameter1 - Zero or more parameters; e.g. for mysql, ? in the queryString will be replaced with these parameters
     * @param {any} parameter2
     * @param {callback} callback - Callback gets called after the query has finished;
     * gets called with two parameters, err and result - both are mutually exclusive.
     * Result contains an array of rows, each containing an object with the column names as key.
     */
    query(queryString: string, parameter1: any, parameter2: any, callback: any): void;
    /**
     * @description Use this insted of query if you don't expect a result
     * @param {string} queryString
     * @param {any} [parameter1]
     * @param {any} [parameter2]
     */
    exec(queryString: string, parameter1?: any, parameter2?: any): void;
}

/**
 * @class
 * @mixin
 * @version 0.9.16
 * @property {string} driver - Database driver to use, currently sqlite3 (currently in-memory only), mysql or postgres
 * @property {string} [host] - Database server to connect to, required for mysql / postgres
 * @property {string} [username]
 * @property {string} [password]
 * @property {number} [port]
 */
declare interface DBParams {
}

declare var require: any;

declare var backend: Backend;
declare module "backend" {
    export = backend;
}

declare var event: Event;
declare module "event" {
    export = event;
}

declare var engine: Engine;
declare module "engine" {
    export = engine;
}

declare var ws: Ws;
declare module "ws" {
    export = ws;
}

declare var net: Net;
declare module "net" {
    export = net;
}

declare var db: Db;
declare module "db" {
    export = db;
}

declare var store: Store;
declare module "store" {
    export = store;
}

declare var format: Format;
declare module "format" {
    export = format;
}

declare var audio: Audio;
declare module "audio" {
    export = audio;
}

declare var media: Media;
declare module "media" {
    export = media;
}

declare var helpers: Helpers;
declare module "helpers" {
    export = helpers;
}