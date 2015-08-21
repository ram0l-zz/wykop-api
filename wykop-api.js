"use strict";
var md5     = require("md5");
var Promise = require("bluebird");
var request = require("request");



var apiRequest = function (self, rtype, rmethod, rmethod_params, callback) {


	if (!rmethod_params) { rmethod_params = []; }

	var apiParams  = self.apiParams  || {};
	var postParams = self.postParams || null;

	delete self.apiParams;
	delete self.postParams;

	// apiParams
	var param1 = (rmethod_params[0] ? rmethod_params[0] + "/" : "");
	var param2 = (rmethod_params[1] ? rmethod_params[1] + "/" : "");
	var param3 = (rmethod_params[2] ? rmethod_params[2] + "/" : "");


	var appkey     = self.appkey;
	var secretkey  = self.secretkey;

	var userkey  = (self.userkey       ? "userkey,"  + self.userkey       + "," : "");
	var page     = (apiParams.page     ? "page,"     + apiParams.page     + "," : "");
	var sort     = (apiParams.sort     ? "sort,"     + apiParams.sort     + "," : "");
	var period   = (apiParams.period   ? "period,"   + apiParams.period   + "," : "");
	var group    = (apiParams.group    ? "group,"    + apiParams.group    + "," : "");
	var output   = (self.output        ? "output,"   + self.output        + "," : "");
	var format   = (self.format        ? "format,"   + self.format        + "," : "");



	var options       = {};
	var allPOSTValues = [];


	options.uri = "http://a.wykop.pl/" + rtype + "/" + rmethod + "/" + param1 + param2 + param3 + "appkey," + appkey + "," + userkey + page + sort + period + group + output + format;

	options.method = (!postParams ? "GET" : "POST");

	options.json = true;

	options.timeout = self.timeout * 1000 || 30000;


	// POST PARAMS

	if (options.method === "POST") {

		if (typeof postParams.embed === "string" || postParams.embed === null || postParams.embed === undefined) {

			options.form = {};

			for (var prop in postParams) {

				if (postParams.hasOwnProperty(prop)) {

					if (postParams[prop] === null || postParams[prop] === undefined || postParams[prop] === "") {
						// do nothing
					} else {

						options.form[prop] = postParams[prop];

					}

				}

			}

			allPOSTValues = Object.keys(options.form).map(function (key) {

				return options.form[key];

			});

		} else if (typeof postParams.embed === "object") {

			options.formData = {};

			for (var prop in postParams) {

				if (postParams.hasOwnProperty(prop)) {

					if (postParams[prop] === null || postParams[prop] === undefined || postParams[prop] === "") {
						// do nothing
					} else {

						options.formData[prop] = postParams[prop];

					}

				}

			}


			for (var key in options.formData) {

				if (options.formData.hasOwnProperty(key) && typeof options.formData[key] === "string") {

					allPOSTValues.push(options.formData[key]);

				}

			}

		}

	}
	

	options.headers = {
		"User-Agent": self.useragent || "wykop-api sdk Nodejs",
		"apisign": md5(secretkey + options.uri + allPOSTValues.toString())
	};


	request(options, function(error, response, body) {

		var errorObj, bodyObj;

		if (error) {
			errorObj = error;
		} else if (!(response.statusCode >= 200 && response.statusCode < 300)) {
			errorObj = response;
		} else if (body.error) {
			errorObj = body.error;
		} else {
			bodyObj = body;
		}

		callback(errorObj, bodyObj);

	});
};


var SelfApiParams = function(page, sort, group, period) {
	this.page = page;
	this.sort = sort;
	this.group = group;
	this.period = period;
};

var SelfPostParams = function(body, embed, accountkey) {
	this.body = body;
	this.embed = embed;
	this.accountkey = accountkey;
};


var error = new Error("Invalid arguments length");



/*
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTTTTTT     OOOOOOOOO     DDDDDDDDDDDDD       YYYYYYY       YYYYYYY
M:::::::M             M:::::::ME::::::::::::::::::::ET:::::::::::::::::::::T   OO:::::::::OO   D::::::::::::DDD    Y:::::Y       Y:::::Y
M::::::::M           M::::::::ME::::::::::::::::::::ET:::::::::::::::::::::T OO:::::::::::::OO D:::::::::::::::DD  Y:::::Y       Y:::::Y
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::ET:::::TT:::::::TT:::::TO:::::::OOO:::::::ODDD:::::DDDDD:::::D Y::::::Y     Y::::::Y
M::::::::::M       M::::::::::M  E:::::E       EEEEEETTTTTT  T:::::T  TTTTTTO::::::O   O::::::O  D:::::D    D:::::DYYY:::::Y   Y:::::YYY
M:::::::::::M     M:::::::::::M  E:::::E                     T:::::T        O:::::O     O:::::O  D:::::D     D:::::D  Y:::::Y Y:::::Y   
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE           T:::::T        O:::::O     O:::::O  D:::::D     D:::::D   Y:::::Y:::::Y    
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E           T:::::T        O:::::O     O:::::O  D:::::D     D:::::D    Y:::::::::Y     
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E           T:::::T        O:::::O     O:::::O  D:::::D     D:::::D     Y:::::::Y      
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE           T:::::T        O:::::O     O:::::O  D:::::D     D:::::D      Y:::::Y       
M::::::M    M:::::M    M::::::M  E:::::E                     T:::::T        O:::::O     O:::::O  D:::::D     D:::::D      Y:::::Y       
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEE        T:::::T        O::::::O   O::::::O  D:::::D    D:::::D       Y:::::Y       
M::::::M               M::::::MEE::::::EEEEEEEE:::::E      TT:::::::TT      O:::::::OOO:::::::ODDD:::::DDDDD:::::D        Y:::::Y       
M::::::M               M::::::ME::::::::::::::::::::E      T:::::::::T       OO:::::::::::::OO D:::::::::::::::DD      YYYY:::::YYYY    
M::::::M               M::::::ME::::::::::::::::::::E      T:::::::::T         OO:::::::::OO   D::::::::::::DDD        Y:::::::::::Y    
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEE      TTTTTTTTTTT           OOOOOOOOO     DDDDDDDDDDDDD           YYYYYYYYYYYYY    
*/




var WykopAPI = function (appkey, secretkey, options) {

	if (arguments.length < 2) throw error;

	this.appkey    = appkey;
	this.secretkey = secretkey;

	this.output    = options.output;
	this.format    = options.format;
	this.timeout   = options.timeout;
	this.useragent = options.useragent;

};


WykopAPI.prototype.authenticate = function (accountkey, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	this.accountkey = accountkey;
	self.postParams = new SelfPostParams(null, null, accountkey);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "User", "Login", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					self.userkey = body.userkey;
					fulfill(body);

				}
			}
		});
	});
};




/*
 ######   #######  ##     ## ##     ## ######## ##    ## ########  ######  
##    ## ##     ## ###   ### ###   ### ##       ###   ##    ##    ##    ## 
##       ##     ## #### #### #### #### ##       ####  ##    ##    ##       
##       ##     ## ## ### ## ## ### ## ######   ## ## ##    ##     ######  
##       ##     ## ##     ## ##     ## ##       ##  ####    ##          ## 
##    ## ##     ## ##     ## ##     ## ##       ##   ###    ##    ##    ## 
 ######   #######  ##     ## ##     ## ######## ##    ##    ##     ###### 

*/

WykopAPI.prototype.addComment = function (param1, param2, body, embed, callback) {

	if (arguments.length < 3) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Comments", "Add", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.plusComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Comments", "Plus", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.minusComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Comments", "Minus", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.editComment = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Comments", "Edit", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.deleteComment = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Comments", "Delete", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*
##       #### ##    ## ##    ## 
##        ##  ###   ## ##   ##  
##        ##  ####  ## ##  ##   
##        ##  ## ## ## #####    
##        ##  ##  #### ##  ##   
##        ##  ##   ### ##   ##  
######## #### ##    ## ##    ## 
*/


WykopAPI.prototype.getLink = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.digLink = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Dig", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.cancelLink = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Cancel", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.buryLink = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Bury", [param1,param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinkComments = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Comments", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinkReports = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Reports", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinkDigs = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Digs", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinkRelated = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Related", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinkBuryreasons = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Buryreasons", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.observeLink = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Observe", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.favoriteLink = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Link", "Favorite", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*
##       #### ##    ## ##    ##  ######  
##        ##  ###   ## ##   ##  ##    ## 
##        ##  ####  ## ##  ##   ##       
##        ##  ## ## ## #####     ######  
##        ##  ##  #### ##  ##         ## 
##        ##  ##   ### ##   ##  ##    ## 
######## #### ##    ## ##    ##  ######  
*/


WykopAPI.prototype.getLinksPromoted = function (page, sort, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page, sort);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Links", "Promoted", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getLinksUpcoming = function (page, sort, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page, sort);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Links", "Upcoming", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*
########   #######  ########  ##     ## ##          ###    ########  
##     ## ##     ## ##     ## ##     ## ##         ## ##   ##     ## 
##     ## ##     ## ##     ## ##     ## ##        ##   ##  ##     ## 
########  ##     ## ########  ##     ## ##       ##     ## ########  
##        ##     ## ##        ##     ## ##       ######### ##   ##   
##        ##     ## ##        ##     ## ##       ##     ## ##    ##  
##         #######  ##         #######  ######## ##     ## ##     ## 
*/


WykopAPI.prototype.getPopularPromoted = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Popular", "Promoted", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getPopularUpcoming = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Popular", "Upcoming", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*
########  ########   #######  ######## #### ##       ######## 
##     ## ##     ## ##     ## ##        ##  ##       ##       
##     ## ##     ## ##     ## ##        ##  ##       ##       
########  ########  ##     ## ######    ##  ##       ######   
##        ##   ##   ##     ## ##        ##  ##       ##       
##        ##    ##  ##     ## ##        ##  ##       ##       
##        ##     ##  #######  ##       #### ######## ######## 
*/


WykopAPI.prototype.getProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Added", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfilePublished = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Published", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileCommented = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Commented", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileDigged = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Digged", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileBuried = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Buried", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.observeProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Observe", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unobserveProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Unobserve", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.blockProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Block", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unblockProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Unblock", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileFollowers = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Followers", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileFollowed = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Followed", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileFavorites = function (param1, param2, page, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Favorites", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileEntries = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Entries", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileEntriesComments = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "EntriesComments", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getProfileRelatedLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Profile", "Related", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

 ######  ########    ###    ########   ######  ##     ## 
##    ## ##         ## ##   ##     ## ##    ## ##     ## 
##       ##        ##   ##  ##     ## ##       ##     ## 
 ######  ######   ##     ## ########  ##       ######### 
	  ## ##       ######### ##   ##   ##       ##     ## 
##    ## ##       ##     ## ##    ##  ##    ## ##     ## 
 ######  ######## ##     ## ##     ##  ######  ##     ## 
*/


WykopAPI.prototype.search = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	// question: string or object
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (typeof question === "string") {

		postObject = {q:question};
	}

	self.apiParams = new SelfApiParams(page);
	self.postParams = question;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Search", "Index", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.searchLinks = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	/* question
	question = {
		q: String,
		what: String,
		sort: String,
		when: String,
		from: String,
		to: String,
		votes: String
	}*/

	// question: string or object
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (typeof question === "string") {
		postObject = {q:question};
	}

	self.apiParams = new SelfApiParams(page);
	self.postParams = question;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Search", "Links", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.searchEntries = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	// question: string or object 
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (typeof question === "string") {
		postObject = {q:question};
	}

	self.apiParams = new SelfApiParams(page);
	self.postParams = question;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Search", "Entries", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.searchProfiles = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	// question: string or object 
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (typeof question === "string") {
		postObject = {q:question};
	}

	self.apiParams = new SelfApiParams(page);
	self.postParams = question;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Search", "Profiles", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*
##     ##  ######  ######## ########  
##     ## ##    ## ##       ##     ## 
##     ## ##       ##       ##     ## 
##     ##  ######  ######   ########  
##     ##       ## ##       ##   ##   
##     ## ##    ## ##       ##    ##  
 #######   ######  ######## ##     ##
 */


WykopAPI.prototype.login = function (accountkey, callback) {

	var self = this;

	if (accountkey === null || accountkey === undefined || accountkey === "") {
		this.accountkey = accountkey;
	}

	self.postParams = new SelfPostParams(null, null, accountkey);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "User", "Login", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					self.userkey = body.userkey;
					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.userFavorites = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "User", "Favorites", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.userObserved = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "User", "Observed", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.userObservedTags = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "User", "Tags", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};



WykopAPI.prototype.getConnectUrl = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var a = new Buffer(param1).toString("base64");
	var redirect = encodeURI(a);
	var secure = md5(this.secretkey +  param1);
	var url = "http://a.wykop.pl/user/connect/appkey," + this.appkey + ",redirect," + redirect + ",secure," + secure;
	callback(url);
	return url;
	
};


WykopAPI.prototype.getConnectData = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var a = new Buffer(param1, "base64").toString("utf8");
	var b = JSON.parse(a);
	callback(b);
	return b;
	
};





/*
########  #######  ########  
   ##    ##     ## ##     ## 
   ##    ##     ## ##     ## 
   ##    ##     ## ########  
   ##    ##     ## ##        
   ##    ##     ## ##        
   ##     #######  ##   
*/


WykopAPI.prototype.getTop = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Top", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getTopMonth = function (param1, param2, page, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Top", "Date", [param1,param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getTopHits = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Top", "Hits", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

   ###    ########  ########  
  ## ##   ##     ## ##     ## 
 ##   ##  ##     ## ##     ## 
##     ## ##     ## ##     ## 
######### ##     ## ##     ## 
##     ## ##     ## ##     ## 
##     ## ########  ########  

*/


WykopAPI.prototype.addLink = function (group, parameters, callback) {

	if (arguments.length < 2) throw error;

	/* FORMAT: 
	parameters = {
		description: "",
		*plus18: 0, 
		tags: "spam,test",
		title: "test api",
		*type: "news",
		url: "link"
	}
	*/

	var self = this;
	self.apiParams = new SelfApiParams(null, null, group);
	self.postParams = parameters;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Add", "Index", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

########  ######## ##          ###    ######## ######## ########  
##     ## ##       ##         ## ##      ##    ##       ##     ## 
##     ## ##       ##        ##   ##     ##    ##       ##     ## 
########  ######   ##       ##     ##    ##    ######   ##     ## 
##   ##   ##       ##       #########    ##    ##       ##     ## 
##    ##  ##       ##       ##     ##    ##    ##       ##     ## 
##     ## ######## ######## ##     ##    ##    ######## ########  

*/


WykopAPI.prototype.plusRelated = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Related", "Plus", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.minusRelated = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Related", "Minus", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


// zwraca {id: false} chociaż link dodaje się poprawnie
WykopAPI.prototype.addRelated = function (param1, parameters, callback) {

	if (arguments.length < 2) throw error;

	/*
	parameters = {
		title: String, // tytuł, od 6 do 80 znaków
		url: String, //adres strony
		plus18: Number // tylko dla dorosłych, 1 lub 0 – domyślnie 0
	}
	*/

	var self = this;
	self.postParams = parameters;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Related", "Add", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

##     ## ##    ## ##      ## ##    ## ##    ##  #######  ########  
###   ###  ##  ##  ##  ##  ##  ##  ##  ##   ##  ##     ## ##     ## 
#### ####   ####   ##  ##  ##   ####   ##  ##   ##     ## ##     ## 
## ### ##    ##    ##  ##  ##    ##    #####    ##     ## ########  
##     ##    ##    ##  ##  ##    ##    ##  ##   ##     ## ##        
##     ##    ##    ##  ##  ##    ##    ##   ##  ##     ## ##        
##     ##    ##     ###  ###     ##    ##    ##  #######  ##       

*/


WykopAPI.prototype.getMywykop = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Index", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getMywykopTags = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Tags", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getMywykopUsers = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Users", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getMywykopObserving = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Observing", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getMywykopMine = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Mine", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getMywykopReceived = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Received", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getNotifications = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "Notifications", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getNotificationsCount = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "NotificationsCount", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getHashtagsNotifications = function (page, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "HashTagsNotifications", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getHashtagsNotificationsCount = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "HashTagsNotificationsCount", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.readNotifications = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "ReadNotifications", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.readHashtagsNotifications = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "ReadHashTagsNotifications", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.markAsReadNotification = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;	

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "MyWykop", "MarkAsReadNotification", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

######## ##    ## ######## ########  #### ########  ######  
##       ###   ##    ##    ##     ##  ##  ##       ##    ## 
##       ####  ##    ##    ##     ##  ##  ##       ##       
######   ## ## ##    ##    ########   ##  ######    ######  
##       ##  ####    ##    ##   ##    ##  ##             ## 
##       ##   ###    ##    ##    ##   ##  ##       ##    ## 
######## ##    ##    ##    ##     ## #### ########  ######  

*/


WykopAPI.prototype.getEntry = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.addEntry = function (body, embed, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Add", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.editEntry = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);	

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Edit", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.deleteEntry = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Delete", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.addEntryComment = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "AddComment", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.editEntryComment = function (param1, param2, body, embed, callback) {

	if (arguments.length < 3) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "EditComment", [param1,param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.deleteEntryComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "DeleteComment", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.voteEntry  = function (param2, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	var param1 = "entry";

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Vote", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.voteEntryComment  = function (param2, param3, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	var param1 = "comment";
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Vote", [param1, param2, param3], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unvoteEntry = function (param2, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	var param1 = "entry";

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Unvote", [param1, param2], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unvoteEntryComment  = function (param2, param3, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	var param1 = "comment";
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Vote", [param1, param2, param3], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


// TOGGLE 
WykopAPI.prototype.favoriteEntry = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Entries", "Favorite", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

########     ###    ##    ## ##    ## 
##     ##   ## ##   ###   ## ##   ##  
##     ##  ##   ##  ####  ## ##  ##   
########  ##     ## ## ## ## #####    
##   ##   ######### ##  #### ##  ##   
##    ##  ##     ## ##   ### ##   ##  
##     ## ##     ## ##    ## ##    ## 

*/


WykopAPI.prototype.getRank = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Rank", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

 #######  ########   ######  ######## ########  ##     ##    ###    ########  #######  ########  ##    ## 
##     ## ##     ## ##    ## ##       ##     ## ##     ##   ## ##      ##    ##     ## ##     ##  ##  ##  
##     ## ##     ## ##       ##       ##     ## ##     ##  ##   ##     ##    ##     ## ##     ##   ####   
##     ## ########   ######  ######   ########  ##     ## ##     ##    ##    ##     ## ########     ##    
##     ## ##     ##       ## ##       ##   ##    ##   ##  #########    ##    ##     ## ##   ##      ##    
##     ## ##     ## ##    ## ##       ##    ##    ## ##   ##     ##    ##    ##     ## ##    ##     ##    
 #######  ########   ######  ######## ##     ##    ###    ##     ##    ##     #######  ##     ##    ##    

 */


WykopAPI.prototype.getObservatoryVotes = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Observatory", "Votes", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getObservatoryComments = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Observatory", "Comments", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getObservatoryEntries = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Observatory", "Entries", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getObservatoryEntresComments = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Observatory", "EntriesComments", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

########    ###    ##     ##  #######  ########  #### ######## ########  ######  
##         ## ##   ##     ## ##     ## ##     ##  ##     ##    ##       ##    ## 
##        ##   ##  ##     ## ##     ## ##     ##  ##     ##    ##       ##       
######   ##     ## ##     ## ##     ## ########   ##     ##    ######    ######  
##       #########  ##   ##  ##     ## ##   ##    ##     ##    ##             ## 
##       ##     ##   ## ##   ##     ## ##    ##   ##     ##    ##       ##    ## 
##       ##     ##    ###     #######  ##     ## ####    ##    ########  ######  

*/


WykopAPI.prototype.getFavorites = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Favorites", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getFavoritesComments = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Favorites", "Comments", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getFavoritesEntries = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Favorites", "Entries", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getFavoritesLists = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Favorites", "Lists", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

 ######  ######## ########  ########    ###    ##     ## 
##    ##    ##    ##     ## ##         ## ##   ###   ### 
##          ##    ##     ## ##        ##   ##  #### #### 
 ######     ##    ########  ######   ##     ## ## ### ## 
	  ##    ##    ##   ##   ##       ######### ##     ## 
##    ##    ##    ##    ##  ##       ##     ## ##     ## 
 ######     ##    ##     ## ######## ##     ## ##     ## 

 */


// dwie wersje, jako zalogowany i niezalogowany
WykopAPI.prototype.getStream = function (page,callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Stream", "Index", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getStreamHot = function (page, period, callback) {

	var self = this;
	self.apiParams = new SelfApiParams(page, null, null, period);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Stream", "Hot", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

########    ###     ######   
   ##      ## ##   ##    ##  
   ##     ##   ##  ##        
   ##    ##     ## ##   #### 
   ##    ######### ##    ##  
   ##    ##     ## ##    ##  
   ##    ##     ##  ######   

*/


WykopAPI.prototype.getTagIndex = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Index", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getTagLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Links", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getTagEntries = function (param1, page, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	self.apiParams = new SelfApiParams(page);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Entries", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.observeTag = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Observe", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unobserveTag = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Unobserve", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.blockTag = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Block", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.unblockTag = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tag", "Unblock", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};




/*

########  ##     ## 
##     ## ###   ### 
##     ## #### #### 
########  ## ### ## 
##        ##     ## 
##        ##     ## 
##        ##     ## 

*/


WykopAPI.prototype.getConversationsList = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "PM", "ConversationsList", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.getConversation = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "PM", "Conversation", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.sendMessage = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;

	var self = this;
	self.postParams = new SelfPostParams(body, embed);

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "PM", "SendMessage", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


WykopAPI.prototype.deleteConversation = function (param1, callback) {

	if (arguments.length < 1) throw error;

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "PM", "DeleteConversation", [param1], function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};





/*

########    ###     ######    ######  
   ##      ## ##   ##    ##  ##    ## 
   ##     ##   ##  ##        ##       
   ##    ##     ## ##   ####  ######  
   ##    ######### ##    ##        ## 
   ##    ##     ## ##    ##  ##    ## 
   ##    ##     ##  ######    ######  

*/


WykopAPI.prototype.getTagsList = function (callback) {

	var self = this;

	return new Promise(function(fulfill, reject) {

		apiRequest(self, "Tags", "Index", null, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
};


// full request, nie testowałem, nieaktualne
/*
WykopAPI.prototype.request = function(rtype, rmethod, rmethod_params, apiParams, postParams, callback) {

	var self = this;
	self.postParams = ?
	if (arguments.length < 5) throw error;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(self, rtype, rmethod, rmethod_params, apiParams, postParams, function(error, body) {

			if (callback) {

				return callback(error, body);

			} else {

				if (error) {

					reject(error);

				} else {

					fulfill(body);

				}
			}
		});
	});
}; */

// export
module.exports = WykopAPI;