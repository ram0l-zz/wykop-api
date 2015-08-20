"use strict";
var md5     = require("md5");
var Promise = require("bluebird");
var request = require("request");



var apiRequest = function (rtype, rmethod, rmethod_params, api_params, post_params, callback) {


	if (!rmethod_params) { rmethod_params = []; }

	// api_params
	var param1 = (rmethod_params[0] ? rmethod_params[0] + "/" : "");
	var param2 = (rmethod_params[1] ? rmethod_params[1] + "/" : "");
	var param3 = (rmethod_params[2] ? rmethod_params[2] + "/" : "");


	var appkey     = api_params.appkey;
	var secretkey  = api_params.secretkey;

	var userkey  = (api_params.userkey  ? "userkey,"  + api_params.userkey  + "," : "");
	var page     = (api_params.page     ? "page,"     + api_params.page     + "," : "");
	var sort     = (api_params.sort     ? "sort,"     + api_params.sort     + "," : "");
	var period   = (api_params.period   ? "period,"   + api_params.period   + "," : "");
	var group    = (api_params.group    ? "group,"    + api_params.group    + "," : "");
	var redirect = (api_params.redirect ? "redirect," + api_params.redirect + "," : "");
	var secure   = (api_params.secure   ? "secure,"   + api_params.secure   + "," : "");
	var output   = (api_params.output   ? "output,"   + api_params.output   + "," : "");
	var format   = (api_params.format   ? "format,"   + api_params.format   + "," : "");



	var options       = {};
	var allPOSTValues = [];


	options.uri = "http://a.wykop.pl/" + rtype + "/" + rmethod + "/" + param1 + param2 + param3 + "appkey," + appkey + "," + userkey + page + sort + period + group + output + format + redirect + secure;

	options.method = (!post_params ? "GET" : "POST");

	options.json = true;


	// POST PARAMS

	if (options.method === "POST") {

		if (typeof post_params.embed === "string" || post_params.embed === null || post_params.embed === undefined) {

			options.form = {};

			for (var prop in post_params) {

				if (post_params.hasOwnProperty(prop)) {

					if (post_params[prop] === null || post_params[prop] === undefined || post_params[prop] === "") {
						// do nothing
					} else {

						options.form[prop] = post_params[prop];

					}

				}

			}

			allPOSTValues = Object.keys(options.form).map(function (key) {

				return options.form[key];

			});

		} else if (typeof post_params.embed === "object") {

			options.formData = {};

			for (var prop in post_params) {

				if (post_params.hasOwnProperty(prop)) {

					if (post_params[prop] === null || post_params[prop] === undefined || post_params[prop] === "") {
						// do nothing
					} else {

						options.formData[prop] = post_params[prop];

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
		"User-Agent": "WykopWebAgent",
		"apisign": md5(secretkey + options.uri + allPOSTValues.toString())
	};


	request(options, callback);

	
};


var DefaultApiParams = function(self, page, sort, group, period) {
	this.appkey = self.appkey;
	this.secretkey = self.secretkey;
	this.userkey = self.userkey;
	this.output = self.output;
	this.format = self.format;
	this.page = page;
	this.sort = sort;
	this.group = group;
	this.period = period;
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




var WykopAPI = function (appkey, secretkey, output, format) {

	if (arguments.length < 2) throw error;

	this.appkey = appkey;
	this.secretkey = secretkey;
	this.output = output; // "clear"
	this.format = format; // "jsonp" || "xml"

};


WykopAPI.prototype.authenticate = function (accountkey, callback) {

	if (arguments.length < 1) throw error;

	var self = this;
	this.accountkey = accountkey;

	return new Promise(function(fulfill, reject) {

		apiRequest("User", "Login", null, {appkey:self.appkey, secretkey:self.secretkey}, {accountkey:self.accountkey}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else {
				self.userkey = body.userkey;
				fulfill(body);
			}

			if (callback) {

				return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Comments", "Add", [param1, param2], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.plusComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Comments", "Plus", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.minusComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Comments", "Minus", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.editComment = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Comments", "Edit", [param1], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.deleteComment = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Comments", "Delete", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.digLink = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Dig", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.cancelLink = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Cancel", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.buryLink = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Bury", [param1,param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinkComments = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Comments", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinkReports = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Reports", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinkDigs = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Digs", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinkRelated = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Related", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinkBuryreasons = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Buryreasons", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.observeLink = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Observe", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.favoriteLink = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Link", "Favorite", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this, page, sort);

	return new Promise(function(fulfill, reject) {

		apiRequest("Links", "Promoted", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getLinksUpcoming = function (page, sort, callback) {

	var api_params = new DefaultApiParams(this, page, sort);

	return new Promise(function(fulfill, reject) {

		apiRequest("Links", "Upcoming", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Popular", "Promoted", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getPopularUpcoming = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Popular", "Upcoming", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Added", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfilePublished = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Published", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileCommented = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Commented", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileDigged = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Digged", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileBuried = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Buried", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.observeProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Observe", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.unobserveProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Unobserve", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.blockProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Block", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.unblockProfile = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Unblock", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileFollowers = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Followers", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileFollowed = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Followed", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileFavorites = function (param1, param2, page, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Favorites", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileEntries = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Entries", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileEntriesComments = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "EntriesComments", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getProfileRelatedLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Profile", "Related", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	// question: string or object
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (question instanceof String) {
		postObject = {q:question};
	}

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Search", "Index", null, api_params, postObject, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.searchLinks = function (question, page, callback) {

	if (arguments.length < 1) throw error;

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
	} else if (question instanceof String) {
		postObject = {q:question};
	}

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Search", "Links", null, api_params, postObject, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.searchEntries = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	// question: string or object 
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (question instanceof String) {
		postObject = {q:question};
	}

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Search", "Entries", null, api_params, postObject, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.searchProfiles = function (question, page, callback) {

	if (arguments.length < 1) throw error;

	// question: string or object 
	var postObject; 
	if (question instanceof Object) {
		postObject = question;
	} else if (question instanceof String) {
		postObject = {q:question};
	}

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Search", "Profiles", null, api_params, postObject, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
		accountkey = this.accountkey;
	}

	return new Promise(function(fulfill, reject) {

		apiRequest("User", "Login", null, {appkey:self.appkey,secretkey:self.secretkey}, {accountkey:accountkey}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else {
				self.userkey = body.userkey;
				fulfill(body);
			}

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.userFavorites = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("User", "Favorites", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.userObserved = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("User", "Observed", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.userObservedTags = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("User", "Tags", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};



WykopAPI.prototype.getConnectUrl = function (param1, callback) {

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Top", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getTopMonth = function (param1, param2, page, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Top", "Date", [param1,param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getTopHits = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Top", "Hits", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	/* FORMAT: 
	parameters = {
		url: String, // adres strony
		title: String, // tytuł, od 6 do 80 znaków
		description: String, // opis, od 20 do 300 znaków
		tags: String, //  tagi rozdzielone spacjami
		type: String, //  typ linka, „news”, „picture” lub „video”
		lus18: Boolean //  tylko dla dorosłych, 1 lub 0 – domyślnie 0
	}
	*/
	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this, null, null, group);

	return new Promise(function(fulfill, reject) {

		apiRequest("Add", "Index", null, api_params, parameters, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Related", "Plus", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.minusRelated = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Related", "Minus", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


// ZWRACA {id: false} CHOCIAŻ LINK DODAJE SIĘ POPRAWNIE
WykopAPI.prototype.addRelated = function (param1, parameters, callback) {

	/*
	parameters = {
		url: String, //adres strony
		title: String, // tytuł, od 6 do 80 znaków
		plus18: Boolean // tylko dla dorosłych, 1 lub 0 – domyślnie 0
	}
	*/

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Related", "Add", [param1], api_params, parameters, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Index", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getMywykopTags = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Tags", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getMywykopUsers = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Users", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getMywykopObserving = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Observing", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getMywykopMine = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Mine", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getMywykopReceived = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Received", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getNotifications = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "Notifications", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getNotificationsCount = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "NotificationsCount", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getHashtagsNotifications = function (page, callback) {

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "HashTagsNotifications", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getHashtagsNotificationsCount = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "HashTagsNotificationsCount", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.readNotifications = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "ReadNotifications", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.readHashtagsNotifications = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "ReadHashTagsNotifications", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.markAsReadNotification = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("MyWykop", "MarkAsReadNotification", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.addEntry = function (body, embed, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Add", null, api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.editEntry = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Edit", [param1], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.deleteEntry = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Delete", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.addEntryComment = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "AddComment", [param1], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.editEntryComment = function (param1, param2, body, embed, callback) {

	if (arguments.length < 3) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "EditComment", [param1,param2], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.deleteEntryComment = function (param1, param2, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "DeleteComment", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.voteEntry  = function (param2, callback) {

	if (arguments.length < 1) throw error;
	var param1 = "entry";
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Vote", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.voteEntryComment  = function (param2, param3, callback) {

	if (arguments.length < 2) throw error;
	var param1 = "comment";
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Vote", [param1, param2, param3], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.unvoteEntry = function (param2, callback) {

	if (arguments.length < 1) throw error;
	var param1 = "entry";
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Unvote", [param1, param2], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.unvoteEntryComment  = function (param2, param3, callback) {

	if (arguments.length < 2) throw error;
	var param1 = "comment";
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Vote", [param1, param2, param3], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


// TOGGLE 
WykopAPI.prototype.favoriteEntry = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Entries", "Favorite", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Rank", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Observatory", "Votes", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getObservatoryComments = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Observatory", "Comments", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getObservatoryEntries = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Observatory", "Entries", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getObservatoryEntresComments = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Observatory", "EntriesComments", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Favorites", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getFavoritesComments = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Favorites", "Comments", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getFavoritesEntries = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Favorites", "Entries", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getFavoritesLists = function (callback) {

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Favorites", "Lists", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Stream", "Index", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getStreamHot = function (page, period, callback) {

	var api_params = new DefaultApiParams(this, page, null, null, period);

	return new Promise(function(fulfill, reject) {

		apiRequest("Stream", "Hot", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Index", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getTagLinks = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Links", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getTagEntries = function (param1, page, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this, page);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Entries", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.tagObserve = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Observe", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.tagUnobserve = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Unobserve", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.tagBlock = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Block", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.tagUnlock = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tag", "Unblock", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("PM", "ConversationsList", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.getConversation = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("PM", "Conversation", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.sendMessage = function (param1, body, embed, callback) {

	if (arguments.length < 2) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("PM", "SendMessage", [param1], api_params, {body:body,embed:embed}, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};


WykopAPI.prototype.deleteConversation = function (param1, callback) {

	if (arguments.length < 1) throw error;
	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("PM", "DeleteConversation", [param1], api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

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

	var api_params = new DefaultApiParams(this);

	return new Promise(function(fulfill, reject) {

		apiRequest("Tags", "Index", null, api_params, null, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};









// full request

WykopAPI.prototype.request = function(rtype, rmethod, rmethod_params, api_params, post_params, callback) {

	if (arguments.length < 5) throw error;
	
	return new Promise(function(fulfill, reject) {

		apiRequest(rtype, rmethod, rmethod_params, api_params, post_params, function(error, response, body) {

			if (error) {
				reject(error);
			} else if (!(/^2/.test("" + response.statusCode))) {
				reject(response.statusCode);
			} else if (body.error) {
				reject(body.error);
			} else fulfill(body);

			if (callback) return callback(error, response, body);

		});
	});
};

// export
module.exports = WykopAPI;