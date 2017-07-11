const Services 	= require("./services")
const uuid 		= require('uuid')

/**
 * FooApp Initializer
 * - inititalizes the application services and tests its communication capabilities between services, 
 * - provides indirect access to service methods using an abstract more http friendly api 
 * - provides intercommunication between different services.
 * - introduces application-context("business") logic layer 
 * return a promise with FooApp instance in result or error from testing or initializing
 * @constructor
 * @param {Object} FooAppConfiguration - FooAppConfiguration object as represented in ../utils/configuration.json
 */

var FooApp = function(config) 
{
	var self 			= this
		self.config 	= config;
		self.services 	= Services;
	const env 			= config.env

	/**
	 * Unit Testing function for FooApp
	 * @test
	 */
	self.test = function() {

		return new Promise(function(resolve, reject) {

		});
	}

	/**
	 * importUsers, imports users into postgresql db from csv string
	 * returns a promise with status success and import id or error
	 * @promise
	 * @param {Object} params - parameter object
	 * @param {string} params.csv - csv string to import user from
	 */	 
	self.importUsers = function(params) 
	{
		const import_id = uuid()

		if(env.dev) console.log("======== trying multi user import #"+import_id+" =========");

		return new Promise(function(resolve, reject)
		{
			self
			.services
			.csv
			.parseBackground(params.csv)
			.then((result) => {

				if(env.dev) console.log("======== csv parse result for import #"+import_id+" =========");
				if(env.dev) console.log(result);
				if(env.dev) console.log("======== csv parse result for import #"+import_id+" =========");
				
				for (var i = result.length - 1; i >= 0; i--) result[i].Import = import_id

				return self.db.writeUsers(result)
			})
			.then(() => {
				return resolve({ "status": "success", "result": {"import": import_id } });
			})
			.catch((err) => {

				if(env.dev) console.error("======== users import error for import #"+import_id+" =========");
				if(env.dev) console.error(err);
				if(env.dev) console.error("======== users import error for import #"+import_id+" =========");	

				return reject({ "status":"error", "result":{"error":err}});
			})
		})
	}

	/**
	 * getUsers, returns all imported users, 
	 * or users from a specific import if you provide the import id
	 * @promise
	 * @param {Object?} params - parameter object
	 * @param {string?} params.Import - id of the import
	 */
	self.getUsers = function(params) {
		if(params.Import) return self.services.db.getUsersByAttributes(params);
		return self.services.db.getUsers()
	}

	/**
	 * code for FooApp constructor
	 * @constructor
	 * @param {Object} Services - Services index instance
	 */
	self.init = function() {
		return new Promise(function(resolve, reject)
		{
			if(env.dev) console.log("======== initializing "+config.title+" controller =========");

			self
			.services(self)
			.then((instance) => {

				if(env.dev) console.log("========== "+config.title+" controller services ready ============");
				if(env.dev) console.log(instance)
				if(env.dev) console.log("==================================================================");
				if(env.dev) console.log(self.services)
				if(env.dev) console.log("==================================================================");
				if(env.dev) console.log("========== starting "+config.title+" controller tests ============");

				return self.test()
			})
			.then(() => {
				resolve(self)
			})
			.catch((err) => {
				if(env.dev) console.error("======== failed initializing "+config.title+" controller =========");
				if(env.dev) console.error(err)
				if(env.dev) console.error("==================================================================");
				reject(err)
			})
		})
	}

	return self.init();
}
module.export = FooApp