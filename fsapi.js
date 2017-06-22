 /* FireShotAPI
 **
 ** simple API for FireShot automation (capturing web pages using JavaScript).**
 ** Code licensed under Mozill Public License                                 **
 **     https://addons.mozilla.org/en-US/firefox/versions/license/69512       **
 **                                                                           **
 ** Author: Evgeny Suslikov, http://screenshot-program.com/fireshot           **
 **                                                                           */

var cFSEdit 		= 0;
var cFSSave 		= 1;
var cFSClipboard 	= 2;
var cFSEMail 		= 3;
var cFSExternal 	= 4;
var cFSUpload 		= 5;
var cFSPrint 		= 7;
var cBASE64Encode 	= 8;
cFSUpgrade			= 100;

var FireShotAPI =
{
        AutoInstall: false,      // Set this variable to false to switch off addon auto-installation

        // Check silently whether the addon is available at the client's PC, returns *true* if everything is OK. Otherwise returns *false*.
        isAvailable : function()
        {
                if (!this.isWindows() || (!this.isFirefox() && !this.isChrome())) return false;

                var element = document.createElement("FireShotDataElement");
                element.setAttribute("FSAvailable", false);
				element.setAttribute("FSUpgraded", false);
				
				element["FSFunction"] = function() {alert(123);};
                document.documentElement.appendChild(element);

                var evt = document.createEvent("Events");
                evt.initEvent("checkFSAvailabilityEvt", true, false);

                element.dispatchEvent(evt);

                return element.getAttribute("FSAvailable") == "true";
        },

        // Installs plugin
        installPlugin : function()
        {
                if (!this.isWindows() || (!this.isFirefox() && !this.isChrome()))
                {
                        this.errorOnlyChromeFirefoxAtWindows();
                        return;
                }
                else if (this.isFirefox())
                {
                        var xpi = new Object();
                           xpi['FireShot'] = "http://screenshot-program.com/fireshot.xpi";
                           InstallTrigger.install(xpi, FireShotAPI.installationDone);
                }
				else if (this.isChrome()) 
				{
						window.open("http://screenshot-program.com/fireshot.crx", '_blank');
						window.focus();
				}
        },

        // Callback function seems to be not working properly
        installationDone : function(name, result)
        {
           if (result != 0 && result != 999)
                 alert("The install didn't seem to work, you could maybe try " +
                           "a manual install instead.\nFailure code was " + result + ".");
           else
                 alert("Installation complete, please restart your browser.");
        },

        // Capture web page and perform desired action
        capturePage : function(EntirePage, Action, CapturedFrameId, Data)
        {
                if (this.AutoInstall && !this.isAvailable())
                {
                        this.installPlugin();
                        return;
                }

                var element = document.createElement("FireShotDataElement");
                element.setAttribute("Entire", EntirePage);
                element.setAttribute("Action", Action);
                element.setAttribute("BASE64Content", "");
				element.setAttribute("Data", Data);
                //element.setAttribute("Document", document);

                if (typeof(CapturedFrameId) != "undefined")
                        element.setAttribute("CapturedFrameId", CapturedFrameId);


                document.documentElement.appendChild(element);

                var evt = document.createEvent("Events");
                evt.initEvent("capturePageEvt", true, false);

                element.dispatchEvent(evt);

                return element;
        },

        // Capture web page (Entire = true for capturing the web page entirely) and *edit*
        editPage : function(Entire, CapturedFrameId)
        {
                this.capturePage(Entire, cFSEdit, CapturedFrameId);
        },

        // Capture web page and *save to disk*
        savePage : function(Entire, CapturedFrameId, Filename)
        {
            console.log("fsapi.js: FireShotAPI.savePage");
                this.capturePage(Entire, cFSSave, CapturedFrameId, Filename);
        },

        // Capture web page and *copy to clipboard*
        copyPage : function(Entire, CapturedFrameId, CapturedFrameId)
        {
                this.capturePage(Entire, cFSClipboard, CapturedFrameId);
        },

        // Capture web page and *EMail*
        emailPage : function(Entire, CapturedFrameId)
        {
                this.capturePage(Entire, cFSEMail, CapturedFrameId);
        },

        // Capture web page and *open it in a third-party editor*
        exportPage : function(Entire, CapturedFrameId)
        {
                this.capturePage(Entire, cFSExternal, CapturedFrameId);
        },

        // Capture web page and *upload to free image hosting*
        uploadPage : function(Entire, CapturedFrameId)
        {
                this.capturePage(Entire, cFSUpload, CapturedFrameId);
        },

        // Capture web page and *print*
        printPage : function(Entire, CapturedFrameId)
        {
                this.capturePage(Entire, cFSPrint, CapturedFrameId);
        },

   // Capture web page and *print*
        base64EncodePage : function(Entire, CapturedFrameId)
        {
                return this.capturePage(Entire, cBASE64Encode, CapturedFrameId).getAttribute("BASE64Content");
        },
		
		upgradePlugin : function(Entire, CapturedFrameId) 
		{
			this.capturePage(Entire, cFSUpgrade, CapturedFrameId);
		},

        // Check whether the addon is available and display the message if required
        checkAvailability : function()
        {
                // The plugin works only in Windows OS. We check it here.
                if (!this.isWindows() || (!this.isFirefox() && !this.isChrome()))
                {
                        this.errorOnlyChromeFirefoxAtWindows();
                        return;
                }

                if (!this.isAvailable() && (this.isFirefox() || this.isChrome()))
				{
					if ((this.isFirefox() && confirm("FireShot plugin for Firefox not found. Would you like to install it?")) ||
						(this.isChrome() && confirm("FireShot extension for Chrome not found. Would you like to navigate to Chrome Web Store to install it?")))
                        this.installPlugin();
				}
        },

        // Check whether current OS is Windows
        isWindows : function()
        {
                return navigator.appVersion.indexOf("Win") != -1;
        },

        // Check whether current browser is Firefox
        isFirefox : function()
        {
                return navigator.userAgent.indexOf("Firefox") != -1;
        },
		
		isChrome : function()
		{
				return /chrome/.test(navigator.userAgent.toLowerCase());
		},

        // Displays error message
        errorOnlyChromeFirefoxAtWindows : function()
        {
				alert("Sorry, this plugin works only in Firefox or Chrome under Windows.");
        },

        sayHello : function()
        {
                alert("Hello");
        }


}