/** 
* Mizu Webphone Java Script API.
* You can control the webphone using the API functions below.
*/

var webphone_api = (function ()
{

/** 
* Configuration settings can be specified below.
* You can also set the parameters at runtime by using the setparameter() function.cfg_priority
* The serveraddress parameter is mandatory! If username/password is not set, then the user will have to enter them. Other parameters are optional.
*/

var parameters = {
                    serveraddress: '10.114.5.111:5060', // your VoIP server IP address, domain name or SRV DNS record
                    username: '5111', // preconfigured SIP account username
                    password: '1234', // preconfigured SIP account password                        
					//other parameters are optional. See the documentation for the complete parameter list of available settings.
                    loglevel: 5
                 };



/** Call this function once, passing a callback.
 * The passed callback function will be called when the webphone library is completely loaded so you can start the usage (call any other functions) from here.
 * (no parameters) */
function onLoaded(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.loadedcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called when the VoIP engine has sucessfully started (ready to register or make calls)/
 * Note: you can initiate calls also from the onLoaded and it will queued to be executed after onStart. 
 * (no parameters) */
function onStart(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.startcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on registered (connected) to VoIP server.
 * (no parameters) */
function onRegistered(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.registeredcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on unregistered (disconnected) from VoIP server.
 * (no parameters) */
function onUnRegistered(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.unregisteredcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on every call state change.
 * --PARAMETERS --
 * status: can have following values: callSetup, callRinging, callConnected, callDisconnected
 * direction: 1 (outgoing), 2 (incoming)
 * peername: is the other party username
 * peerdisplayname: is the other party display name if any*/
function onCallStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.callstatechangecb = callback;
}
/** Call this function once, passing a callback.
 * The passed callback function will be called when chat message is received.
 * --PARAMETERS --
 * from: username, phone number or sip URI of the sender
 * msg: the content of the text message */
function onChat(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.chatcb = callback;
    // place your code here
}

/** Call this function once, passing a callback.
 * The passed callback function will be called each call. You will receive a CDR (call detail record).
 * --PARAMETERS --
 * caller: the caller party username
 * called: called party username
 * connecttime: milliseconds elapsed between call initiation and call connect
 * duration: milliseconds elapsed between call connect and hangup (0 for not connected calls. Divide by 1000 to obtain seconds.)
 * direction: 1 (outgoing), 2 (incoming)
 * peerdisplayname: is the other party display name if any
 * reason: disconnect reason as string
*/
function onCdr(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.cdrcb = callback;
}

/**
* Optionally you can "start" the phone, before making any other action. 
* In some circumstances the initialization procedure might take a few seconds (depending on usable engines) so you can prepare the webphone with this method
* to avoid any delay when the user really needs to use by pressing the call button for example. 
* If the serveraddress/username/password is already set and auto register is not disabled, then the webphone will also register (connect) to the SIP server upon start.
* If start is not called, then the webphone will initialize itself the first time when you call some other function such as register or call.
* The webphone parameter should be set before you call this method (preset in the js file or by using the setparameter function).
*/
function start ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
    {
        api_helper.AddToQueue('Start', [parameters, true]);
        return false;
    }
    else
        return plhandler.Start(parameters, true);
}

/**
 * Will stop all endpoints and sipstack. This function call is optional */
 function stop ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Stop', [parameters]);
    else
        plhandler.Stop(parameters);
}

/** Optionally you can "register". This will "connect" to the SIP server if not already connected by the start method */
function register ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Register', [parameters]);
    else
        plhandler.Register(parameters);
}

/** Initiate call to a number, sip username or SIP URI.*/
function call (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Call', [number]);
    else
        plhandler.Call(number);
}

/** Initiate video call to a number, sip username or SIP URI.*/
function videocall (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('VideoCall', [number]);
    else
        plhandler.VideoCall(number);
}

/** Initiate screenshare call to a number, sip username or SIP URI.*/
function screenshare (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('ScreenShare', [number]);
    else
        plhandler.ScreenShare(number);
}

/** Disconnect current call(s).*/
function hangup ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Hangup', []);
    else
        plhandler.Hangup();
}

/** Connect incoming call*/
function accept ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Accept', []);
    else
        return plhandler.Accept();
}

/** Disconnect incoming call.*/
function reject ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Reject', []);
    else
        plhandler.Reject();
}

/** Ignore incoming call.*/
function ignore ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Ignore', []);
    else
        plhandler.Ignore();
}

/**
 * Returns a String list of available call functions, sepparated by comma, based on what functions are supported by the current VoIP engine
 * Possible values: conference,transfer,mute,hold,chat
 *                  or ERROR, if webphone is not yet started
*/
function getavailablecallfunc ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
    {
        webphone_api.Log('ERROR, webphone_api: getavailablecallfunc plhandler is not defined');
        return 'ERROR, webphone is not yet started';
    }
    else
    {
        return plhandler.GetAvailableCallfunc();
    }
}

/**
 * Returns  s Tring with details about the last finished call
 */
function getlastcalldetails ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.GetLastCallDetails();
    else
        return '';
};

/** 
* Forward incoming call to number
*/
function forward (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Forward', [number]);
    else
        plhandler.Forward(number);
}

/** 
* Add people to conference.
* If number is empty than will mix the currently running calls (if there is more than one call)
* Otherwise it will call the new number (usually a phone number or a SIP user name) and once connected will join with the current session.
* number: string parameter, usually a phone number or a SIP user name
* add: boolean, true if to add, false to remove
*/
function conference (number, add)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Conference', [number, add]);
    else
        plhandler.Conference(number, add);
}

/** 
* Transfer current call to number which is usually a phone number or a SIP username. (Will use the REFER method after SIP standards).
* You can set the mode of the transfer with the "transfertype" parameter.
*/
function transfer (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Transfer', [number]);
    else
        plhandler.Transfer(number);
}

/** 
* Send DTMF message by SIP INFO or RFC2833 method (depending on the "dtmfmode" parameter).
* Please note that the "msg" parameter is a string. This means that multiple dtmf characters can be passed at once
* and the webphone will streamline them properly. Use the space character to insert delays between the digits.
* The dtmf messages are sent with the protocol specified with the “dtmfmode” parameter.
* Example:	API_Dtmf(-2," 12 345 #");
*/
function dtmf (msg)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Dtmf', [msg]);
    else
        plhandler.Dtmf(msg);
}

/** 
*  Mute current call. The direction can have the following values:
*   0:  mute both
*   1:  mute out (speakers)
*   2:  mute in (microphone) (Default)
*/
function mute (mute, direction)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('MuteEx', [mute, direction]);
    else
        return plhandler.MuteEx(mute, direction);
}

/** Will return true if the call is muted, otherwise false */
function ismuted ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsMuted();
    else
        return false;
}

/** 
* Set state to "true" to put the calll on hold
* or "false" to unhold the call
*/
function hold (state)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Hold', [state]);
    else
        return plhandler.Hold(state);
}

/** Will return true if the call is on hold, otherwise false */
function isonhold ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsOnHold();
    else
        return false;
}

/** 
* Send a chat message. (SIP MESSAGE method after RFC 3428)
* Number can be a phone number or SIP username/extension number.
*/
function sendchat (number, msg)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SendChat', [number, msg]);
    else
        plhandler.SendChat(number, msg);
}

/** 
* Send a SMS message.
* Number can be a PSTN or mobile phone number.
* from is optional
*/
function sendsms (number, msg, from)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SendSms', [number, msg, from]);
    else
        plhandler.SendSms(number, msg, from);
}

/** Start/stop voice record
 * start: true/false
 * url:  FTP or HTTP url where the voice file will be uploaded to*/
function voicerecord (start, url)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Voicerecord(start, url);
}

/** Open audio device selector dialog (built-in user interface).*/
function audiodevice ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.AudioDevice();
}

/** Call this function and pass a callback, to receive a list of all available audio devices.
 * For the dev parameter pass 0 for recording device names list, 1 for the playback, 2 for ringer devices
 * The callback will be called with a string parameter which will contain the audio device names separated by CRLF */
function getaudiodevicelist (dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetAudioDeviceList(dev, callback);
}

/** Call this function and pass a callback, to receive the currently set audio device.
 * For the dev parameter pass 0 for recording device, 1 for the playback, 2 for ringer device 
 * The callback will be called with a string parameter which will contain the currently set audio device names */
function getaudiodevice (dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetAudioDevice(dev, callback);
}

/** Select an audio device. The devicename should be a valid audio device name (you can list them with the getaudiodevicelist() call)
 * For the dev parameter pass 0 for recording device, 1 for the playback, 2 for ringer device
 * The "immediate" parameter can have the following values (!!! only for Java and Native Service engines):
-0: default
-1: next call only
-2: immediately for active calls
 */
function setaudiodevice (dev, devicename, immediate)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetAudioDevice(dev, devicename, immediate);
}

/** 
* Set volume (0-100%) for the selected device. Default value is 50% -> means no change
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
*/
function setvolume(dev, volume)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetVolume(dev, volume);
}

/**
* Call this function, passing a callback
* Return the volume (0-100%) for the selected device.
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
* --PARAMETERS --
* volume: integer representing the volume
*/
function getvolume(dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetVolume(dev, callback);
}

/** Any additional parameters must be set before start/register/call is called*/
function setparameter (param, value)
{
    if (typeof (param) === 'undefined' || param === null || typeof (value) === 'undefined') { return false; }
    
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SetParameter', [param, value]);
    else
        plhandler.SetParameter(param, value);
}

/** Will return value of a parameter if exists, otherwise will return empty string*/
function getparameter (param)  // string
{
    if (typeof (param) === 'undefined' || param === null) { return ''; }
    
    var value = parameters[param];
    
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
    {
        return plhandler.GetParameter(param);
    }else
    {
        var err_msg = 'ERROR, Webphone settings not loaded just yet';
        if (console)
        {
            if (console.error) { console.error(err_msg); }
            else if (console.log) { (console.log(err_msg)); }
        }
    }
    
    if (typeof (value) === 'undefined' || value === null) { return ''; }
    
    return value;
}

/** Will set the current line. (Use only if you present line selection for the users. Otherwise you don’t have to take care about the lines as it is handled automatically by the webphone). */
function setline (line)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetLine(line);
}

/** Will return the current active line number. This should be the line which you have set previously except after incoming and outgoing calls (the webphone will automatically switch the active line to a new free line for these if the current active line is already occupied by a call). */
function getline () //int
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
    {
        return plhandler.GetLine();
    }
    return -1;
}

/** Return true if the webphone is registered ("connected") to the SIP server.*/
function isregistered () // boolean
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsRegistered();
    else
        return false;
}

/** Return true if the user is in call, false otherwise*/
function isincall () // boolean
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsInCall();
    else
        return false;
}

/** Unregister SIP account from VoIP server*/
function unregister ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Unregister();
};

/** 
* Will receive presence information as events: PRESENCE, status,username,displayname,email (displayname and email can be empty)
*       To receive events use the "getEvents(callback)" API function
* Userlist: list of sip account usernames separated by comma
* Also it will return an empty String or a String containing a list of users and their presence statuses separated by semicolon, example: "111111,online;222222offline;333333,online"
*/
function checkpresence (userlist)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.CheckPresence(userlist);
}

/** Function call to change the user online status with one of the followings strings: Online, Away, DND, Invisible, Offline (case sensitive) */
function setpresencestatus(statustring)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetPresenceStatus (statustring);
}

/** Check if communication channel is encrypted: -1=unknown, 0=no, 1=partially, 2=yes, 3=always*/
function isencrypted()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsEncrypted ();
    else
        return -1;
}
/** Set a custom sip header (a line in the SIP signaling) that will be sent with all messages.
 * Can be used for various integration purposes (for example for sending the http session id).
 * You can also set this with applet parameter (customsipheader).*/
function setsipheader(header)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetSipHeader(header);
    else
        webphone_api.Log('ERROR, webphone_api: setsipheader plhandler is not defined');
}

/** Call this function passing a callback.
 * The passed callback function will be called with one parameter, which will be the string value of the requested sip header.*/
function getsipheader(header, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetSipHeader(header, callback);
    else
        webphone_api.Log('ERROR, webphone_api: getsipheader plhandler is not defined');
}


function getsipmessage(dir, type,callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetSipMessage(dir, type,callback);
    else
        webphone_api.Log('ERROR, webphone_api: getsipmessage plhandler is not defined');
}

/** Call this function once passing a callback. From here on you will be responsible for presenting these messages to the user, built in popups/alerts will disabled.
 * The passed callback function will be called with two string parameters, message to be displayed and title (if any).
 * message: a text message intended to be displayed for the user
 * title: the title of the "popup/alert". This can be null/empty for some messages
 * NOTE: The text of the message is language dependent, meaning if the language of the webphone is changed, the message/title language is also changed.*/
function ondisplay(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.displaycb = callback;
}

/** Call this function passing a callback.
 * The passed callback function will be called with one parameter, which will be webphone's work directory.
 * only for Java and Native Service engines*/
function getworkdir(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.GetWorkDir(callback);
    else
        return 'ERROR, getworkdir plhandler is not defined';
}

/** Delete stored data (from cookie and localstorage): settings, contacts, callhistory, messages
 *  level: 1=just settings file, 2=delete everything: settings, contacts, callhistory, messages */
function delsettings(level)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.delsettings(level);
    else
        webphone_api.Log('ERROR, webphone_api: delsettings plhandler is not defined');
}

/** Returns the currently used engine: "java", "webrtc", "ns", "app", "flash", "p2p", "nativedial". Can return empty string if engine selection is in progress*/
function getenginename()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.Getenginename();
    else
        webphone_api.Log('ERROR, webphone_api: getenginename plhandler is not defined');
}

/** Call this function passing a callback.
 * The passed callback function will be called with one String parameter, which will be the last call's SIP INVITE message. */
function getlastinvite(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.GetLastInvite(callback);
    else
        return 'ERROR, getlastinvite plhandler is not defined';
}

/** Call this function once, passing a callback.
 * The passed callback function will receive all the logs in real time.
 * --PARAMETERS --
 * logmessage: one log message
 */
function onLog(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.logcb = callback;
}

/** Returns a string containing all the past logs of the webphone*/
function getlogs()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.getlogs();
    else
        webphone_api.Log('ERROR, webphone_api: getlogs plhandler is not defined');
}

/** If engine is Java or Service plugin, then you can access the full java API as described in the JVoIP SDK documentation: http://www.mizu-voip.com/Software/JVoIP_Doc.pdf
 * --PARAMETERS --
 * name: name of the function
 * jargs: array of arguments passed to the called function; Must be an array, if API function has parameters. If API function has no parameters, then it can be an empty array, null, or omitted altogether
 * ex: API function: API_Call(number)   can be called like this:   webphone_api.jvoip('API_Call',  [number]); */
function jvoip(name, jargs)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Jvoip(name, jargs);
    else
        webphone_api.Log('ERROR, webphone_api: jvoip plhandler is not defined');
}

/** 
* Call this function once and pass a callback, to receive important events, which should be displayed for the user and/or parsed to perform other actions after your software custom logic.
* For the included softphone these are already handled, so no need to use this, except if you need some extra custom actions or functionality which depends on the notifications.
*/

/*
The getEvents is only for low level status messages. For the usual status management you should use the onXXX (for example the onCallStateChange callbacks).
Example: call getEvents() function passing a callback
webphone_api.getEvents( function (event)
{
    // For example the following status means that there is an incoming call ringing from 2222 on the first line:
    // STATUS,1,Ringing,2222,1111,2,Katie,[callid]
    // parameters are separated by comma (,)
    // the sixth parameter (2) means it is an incoming call. (For outgoing call this is set to 1)
    // You can find more detailed explanation about events in the documentation "Notifications" section.
    
    // example for detecting incoming and outgoing calls:
    
    var evtarray = event.split(',');
    
    if (evtarray[0] === 'STATUS' && evtarray[2] === 'Ringing')
    {
        if (evtarray[5] === '1')
        {
            // means it is an outgoing call
            // ...
        }
        else if (evtarray[5] === '2')
        {
            // means it is an icoming call
            // ...
        }
    }
});
*/

function getEvents (callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.evcb = callback;
}

/** Returns the current global status ("best" line status). 
 * The possible returned texts are the same like for notifications: getEvenets
 * This is NOT a callback, you have to call it every time you want to receive the status. 
 */
function getStatus ()  // string
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        return "STATUS,-1,Initializing";
    else
        return plhandler.GetStatus();
}

/**
 * Call this function passing a callback.
 * The passed callback function will be called with a String parameter containing the reason of the last failed registration. Set the extended parameter to true to get more details
*/
function getregfailreason(callback, extended)
{
     if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetRegFailReason(callback, extended);
    else
        webphone_api.Log('ERROR, webphone_api: getregfailreason plhandler is not defined');
}

//***************** public API END *********************

function loadscript (url, async, attrname, attrval)
{
    LogEx = function(msg, err) { try{ if (typeof (msg) === 'undefined' || msg === null) { return; } if (typeof (err) !== 'undefined' && err !== null) { msg = 'ERROR,' + msg + ' ' + err; } Log(msg); } catch(errin) { ; } };
    Log = function(msg) { try{ if (typeof (msg) === 'undefined' || msg === null || msg.length < 1) { return; } if (console && console.log) { if (console.error && (msg.toLowerCase()).indexOf('error') > -1) { console.error(msg); }else { console.log(msg); } } } catch(errin) { ; } };

    try{
    if (typeof (url) === 'undefined' || url === null || url.length < 1)
    {
        Log('ERROR, loadscript invalid url: ' + url);
        return;
    }
    if (typeof (async) === 'undefined' || async === null) { async = false; }
    if (async == true) { alert('async ic true'); }

// <link rel="stylesheet" type="text/css" href="css/index.css" />
    var sNew = null;
    if (url.toLowerCase().indexOf('.css') > url.length - 5)
    {
        sNew = document.createElement("link");
        sNew.async = async;
        sNew.href = url;
        sNew.setAttribute('rel', 'stylesheet');
    }else
    {
        sNew = document.createElement("script");
        sNew.async = async;
        sNew.src = url;
        if (typeof (attrname) !== 'undefined' && attrname !== null && attrname.length > 0 && typeof (attrval) !== 'undefined' && attrval !== null && attrval.length > 0)
        {
            sNew.setAttribute(attrname, attrval);
        }
        //sNew.onload = function () { alert('script loaded'); };
    }
    var s0 = document.getElementsByTagName('head')[0];
    if (typeof (s0) === 'undefined' || s0 === null || !s0.parentNode)
    {
        Log('ERROR, loadscript cannot get script element: ' + url);
        return;
    }
    //s0.parentNode.insertBefore(sNew, s0);
    s0.parentNode.appendChild(sNew);
    
    } catch(err) { LogEx('webphone_api LoadScript', err); }
}
var wphone = {
    getEvents: getEvents,
    getStatus: getStatus,
    onRegistered: onRegistered,
    onUnRegistered: onUnRegistered,
    onLoaded: onLoaded,
    onStart: onStart,
    onCallStateChange: onCallStateChange,
    onChat: onChat,
    onCdr: onCdr,
    start: start,
    stop: stop,
    register: register,
    call: call,
    videocall: videocall,
    screenshare: screenshare,
    hangup: hangup,
    accept: accept,
    reject: reject,
    ignore: ignore,
    getavailablecallfunc: getavailablecallfunc,
    getlastcalldetails: getlastcalldetails,
    forward: forward,
    conference: conference,
    transfer: transfer,
    dtmf: dtmf,
    mute: mute,
    ismuted: ismuted,
    hold: hold,
    isonhold: isonhold,
    sendchat: sendchat,
    sendsms: sendsms,
    voicerecord: voicerecord,
    audiodevice: audiodevice,
    getaudiodevicelist: getaudiodevicelist,
    getaudiodevice: getaudiodevice,
    setaudiodevice: setaudiodevice,
    setvolume: setvolume,
    getvolume: getvolume,
    setparameter: setparameter,
    getparameter: getparameter,
    isregistered: isregistered,
    isincall: isincall,
    unregister: unregister,
    
    setline: setline,
    getline: getline,
    checkpresence: checkpresence,
    setpresencestatus: setpresencestatus,
    isencrypted: isencrypted,
    setsipheader: setsipheader,
    getsipheader: getsipheader,
    getsipmessage: getsipmessage,
    ondisplay: ondisplay,
    getworkdir: getworkdir,
    delsettings: delsettings,
    getenginename: getenginename,
    getlastinvite: getlastinvite,
    getlogs: getlogs,
    onLog: onLog,
    jvoip: jvoip,
    getregfailreason: getregfailreason,
    loadscript: loadscript,
    parameters: parameters,
    evcb: null,
    loadedcb: null,
    displaycb: null,
    startcb: null,
    registeredcb: null,
    unregisteredcb: null,
    callstatechangecb: null,
    chatcb: null,
    cdrcb: null,
    logcb: null
};
//window.wphone = wphone;
return wphone;
})();

webphone_api.bd_logged = false;webphone_api.getbasedir2 = function (forceauto)
{try{if (forceauto !== true){var wpbdir = webphone_api.parameters['webphonebasedir'];if (typeof(wpbdir) === 'undefined' || wpbdir === null || wpbdir === '.' || wpbdir.length < 2) { wpbdir = ''; }wpbdir = wpbdir.toString(); try{ wpbdir = wpbdir.replace(/^\s+|\s+$/g, ''); } catch(err) { }if (wpbdir.indexOf('/') === 0) { wpbdir = wpbdir.substring(1); }if (wpbdir.length > 1 && wpbdir.lastIndexOf('/') < wpbdir.length - 1){wpbdir = wpbdir + '/';}if (wpbdir && wpbdir.length > 0){if (webphone_api.bd_logged !== true){try{console.log('base diectory - webphonebasedir(helper): ' + wpbdir);} catch(err){ }}webphone_api.bd_logged = true;return wpbdir;}}
var scriptElements = document.getElementsByTagName('script');if(scriptElements){for (var i = 0; i < scriptElements.length; i++){wpbdir = scriptElements[i].src;if (wpbdir && wpbdir.indexOf('webphone_api.js') > -1){wpbdir = wpbdir.substring(0, wpbdir.indexOf('webphone_api.js'));if (webphone_api.bd_logged !== true){try{console.log('base diectory - webphonebasedir(guessed): ' + wpbdir);} catch(err){ }}webphone_api.bd_logged = true;return wpbdir;}}}}catch(err) { try{console.log('ERROR, webphone_api getbasedir2');} catch(err2) { ; } }return '';};
//webphone_api.loadscript (webphone_api.getbasedir2() + 'js/lib/api_helper.js', false);
document.write('<script type="text/javascript" src="' + webphone_api.getbasedir2() + 'js/lib/api_helper.js"></script>');
