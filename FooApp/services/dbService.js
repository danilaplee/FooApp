const Sequelize = require("sequelize")
const uuid 		= require('uuid')


/**
 * Represents a dbService instance used for connecting to postgresql database
 * returns a promise with the instance
 * @constructor
 * @param {Object} Services - Services index instance
 */
var dbService = function(services) 
{
	var self 		= this
	const config 	= services.config.db
 	const env 		= services.config.env
 	const con_string= config.engine+'://'+config.user+':'+config.password+'@'+config.domain+':'+config.port+'/'+config.name
	self.sequelize 	= new Sequelize(con_string);

	/**
	 * initiliaze authenticated connection to database for sequelize 
	 * @promise
	 */
	self.authSequelize = function() {
		return self.sequelize.authenticate()
	}


	/**
	 * Sequelize User model initiliazer
	 * @promise
	 */
	self.initUser = function() {

		self.User = self.sequelize.define('user', 
		{
		  Name: {
		    type: Sequelize.STRING
		  },
		  Birthday: {
		    type: Sequelize.STRING
		  },
		  Username: {
		    type: Sequelize.STRING
		  },
		  Import: {
		  	type: Sequelize.STRING
		  }
		})
	}
	/**
	 * Get Users function, returns all the users in database
	 * returns a promise with result data or db error
	 * @promise
	 */
	self.getUsers = function() {
		return self.User.findAll();
	}

	/**
	 * Get Users by attributes, return all the users from specific import
	 * @promise
	 * @param {Object} params - parameter Object
	 * @param {string} params.Import - uuid of the specific import
	 * @param {string} params.Name - name of the user
	 * @param {string} params.Birthday - birthday of the user
	 * @param {string} params.Username - username of the user
	 */
	self.getUsersByAttributes = function(params) {
		return self.User.findAll({
			where:params
		})
	}

	/**
	 * Write User function
	 * return a promise with write result status or error
	 * @promise 
	 * @param {Object} User - user from csv import
	 * @param {string} user.name - name of the user
	 * @param {string} user.birthday - birthday of the user
	 * @param {string} user.username - username of the user
	 */
	self.writeUser = function(params) 
	{
		return new Promise(function(resolve, reject)
		{
			self
			.User
			.sync({force: true})
			.then(() => {

			  return User.create({
			  	Name 	:params.name,
			  	Birthday:params.birthday,
			  	Username:params.username,
			  	Import  :uuid()
			  })

			})
			.then(resolve)
			.catch((err) => {

			    if(env.dev) console.error('Unable to write single user to database');
			    if(env.dev) console.error(err);
			    if(env.dev) console.error("=======================================")

				reject(err)
			})
		})
	}

	/**
	 * Write Many Users function for fast bulk import into postgresql write cache
	 * return a promise with write result status or error 
	 * @promise
	 * @param {Object} User 			- user from csv import
	 * @param {string} user.name 		- name of the user
	 * @param {string} user.birthday 	- birthday of the user
	 * @param {string} user.username 	- username of the user
	 */
	self.writeUsers = function(params) 
	{
		return new Promise(function(resolve, reject)
		{
			self
			.User
			.sync({force: true})
			.then(() => {
			    
			    if(env.dev) console.log('Performing write of many users to database');

			  	return User.bulkCreate(params.users)
			})
			.then(resolve)
			.catch((err) => {

			    if(env.dev) console.error('Unable to write many users to database');
			    if(env.dev) console.error(err)
			    if(env.dev) console.error("=======================================")

				reject(err)
			})
		})
	}

	/**
	 * Delete Users by attributes, return promise with status success or error
	 * only for test purposes to delete test users after test import
	 * @promise
	 * @param {Object} params - parameter Object
	 * @param {string} params.Import - uuid of the specific import
	 * @param {string} params.Name - name of the user
	 * @param {string} params.Birthday - birthday of the user
	 * @param {string} params.Username - username of the user
	 */
	self.deleteUsers = function(params) {
		return self.User.destroy({
			where:params
		})
	}

	/**
	 * code for dbService constructor
	 * @constructor
	 * @param {Object} Services - Services index instance
	 */
	self.init = function() 
	{
	    if(env.dev) console.log("====== initializing db service with url =======")
	 	if(env.dev) console.log(con_string)
	    if(env.dev) console.log("===============================================")

		return new Promise(function(resolve, reject)
		{
			return self
			.authSequelize()
			.then(() => {
			    
			    if(env.dev) console.log('Connection has been established successfully.');
			    return self.initUser()
			})
			.then(() => {
				resolve(self)
			})
			.catch((err) => {
			    
			    if(env.dev) console.error("=======================================")
			    if(env.dev) console.error('Unable to connect to the database:');
			    if(env.dev) console.error("=======================================")
			    if(env.dev) console.error(err)
			    if(env.dev) console.error("=======================================")
				
				reject(new Error(err))
			})
		})
	}

	return self.init()
}

module.exports = dbService;