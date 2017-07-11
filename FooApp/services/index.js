const csvService 	= require("./csvService")
const dbService 	= require("./dbService")

/**
 * Represents app services collection object
 * returns a promise with the instance or error
 * @constructor
 * @param {Object} Services - Services index instance
 */
var Services = function(app) 
{
	var self 		= this
		self.app 	= app
		self.config = self.app.config
		
	const env		= self.config.env

	return new Promise(function(resolve, reject)
	{
		return new dbService(self)
		.then((db) => {

			if(env.dev) console.log("======= succesfully initialised db service ========")
		
			self.db = db
		
			return new csvService(self)
		})
		.then((csv) => {

			if(env.dev) console.log("======= succesfully initialised csv service ========")		
			if(env.dev) console.log("=========== succeded to init all services ==========");

			self.csv = csv
		
			resolve(self)
		})
		.catch((err) => {
			
			if(env.dev) console.error("======= failed to init services =====");
		
			return reject(err)
		})
	})
}
module.exports = Services;