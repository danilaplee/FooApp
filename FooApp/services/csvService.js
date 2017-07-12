const fs 		= require('fs')
const appdir 	= __dirname.replace("services", "")
const csv 		= require('csv-parse');

if(env.dev) console.log("==== service dir =====")
if(env.dev) console.log(appdir)
if(env.dev) console.log("======================")

/**
 * Represents a csvService instance used for parsing csv strings
 * returns a promise with the instance
 * @constructor
 * @param {Object} Services - Services index instance
 */
var csvService = function(services) 
{
	var self 			= this
	const config 		= services.config
	const env 			= config.env
	var csv_test_file 	= config.csv_test_file

	/**
	 * Unit Testing function for csvService
	 * @promise
	 */
	self.test = function() 
	{
		const _csv = appdir+config.csv_test_file
		if(env.dev) console.log("========= reading test csv ===========")
		// if(env.dev) console.log(_csv)
		// if(env.dev) console.log("======================================")
		return new Promise(function(resolve, reject) {
			fs.open(_csv, 'r', function(err, fd, d) 
			{
			  	if (err) {
					if(env.dev) console.error("===== failed to read csv from test file =======")
			    	if (err.code === 'ENOENT') {
			      		return reject(new Error('csv test file '+config.csv_test_file+' does not exist'));
			    	}
				    return reject(new Error(err));
				}
				if(env.dev) console.log("===== succesfully read csv from test file =======")
				const _data = fs.readFileSync(_csv, "utf8")
				resolve(_data)
			})
		})
		.then(function(result)
		{
			// if(env.dev) console.log(result)
			return self.parseBackground(result)
		})
	}

	/**
	 * Main function of csvService
	 * parses incoming string in a background thread to allow other request to work in foreground even if the file is very big
	 * returns a promise with csv result data or csv parser error
	 * @promise
	 * @param {string} csv - incoming csv string from http body payload
	 */
	self.parseBackground = function(csv_string) {

		if(env.dev) console.log("starting background parser")

		return new Promise(function(resolve, reject) {
			csv(csv_string, function(err,data) {
				if(err) return reject(err)
				const keys = data[0]
				var _data  = []
				for (var i = data.length - 1; i >= 1; i--) {
					var obj = {}
					for (var n = 0; n < keys.length; n++) obj[keys[n]] = data[i][n]
					_data.push(obj)
				}
				resolve(_data)
			})
		})
	}

	/**
	 * code for csvService constructor
	 * @constructor
	 * @param {Services} Services - Services index instance
	 */
	self.init = function() 
	{
		return new Promise(function(resolve, reject)
		{
			self
			.test()
			.then((data) => {

			    if(env.dev) console.log('Succesfully parsed test csv file');
			    if(env.dev) console.log(data);
			    if(env.dev) console.log('================================');

				resolve(self)
			})
			.catch((err) => {

			    if(env.dev) console.error('Failed to parse test csv file');
			    if(env.dev) console.error(err)
			    if(env.dev) console.error("=======================================")

				return reject(new Error(err))
			})
		})
	}

	return self.init()
}
module.exports = csvService;