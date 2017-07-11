const fs 		= require('fs')
const Worker 	= require('webworker-threads').Worker;
const csv 		= require('csv');

/**
 * Represents a csvService instance used for parsing csv strings
 * returns a promise with the instance
 * @constructor
 * @param {Object} Services - Services index instance
 */

var csvService = function(services) 
{
	var self 			= this
	const env 			= services.config.env
	const csv_test_file = services.config.csv_test_file

	/**
	 * Unit Testing function for csvService
	 * @promise
	 */
	self.test = function() 
	{
		return new Promise(function(resolve, reject)
		{

		})

	}

	/**
	 * Main function of csvService
	 * parses incoming string in a background thread to allow other request to work in foreground even if the file is very big
	 * returns a promise with csv result data or csv parser error
	 * @promise
	 * @param {string} csv - incoming csv string from http body payload
	 */
	self.parseBackground = function(csv_string) 
	{
		return new Promise(function(resolve, reject)
		{
			var worker = new Worker(function()
			{
				const w = this
				w.onmessage = function(event) 
				{

					if(env.dev) console.log("======= parser worker received event =======")
					if(env.dev) console.log(event)
					if(env.dev) console.log("======= parser worker received event =======")

					csv.parse(event.data, function(err,data)
					{

						if(env.dev) console.log("======= parser worker received result =======")
						if(env.dev) console.log(err)
						if(env.dev) console.log(data)
						if(env.dev) console.log("======= parser worker received result =======")

						
						if(err != null) w.postMessage({"status":"error", "result":err});
						else 			w.postMessage({"status":"success", "result":data});

						w.close()
					})
				}
			})

			worker.onmessage = function(event) 
			{
			  	if(env.dev) console.log("Worker said : " + event.data);
			  	
			  	if(event.data.status == "error") {
					
					if(env.dev) console.error("Failed to parse csv with background worker")
				    if(env.dev) console.error(event.data.result)
				    if(env.dev) console.error("==========================================")

					return reject(event.data.result)
			  	}
			  	
			  	if(env.dev) console.log("Parsed csv file with handmade method")

			  	resolve(event.data.result)
			}

			worker.postMessage(csv_string);
			
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
			.then(() => {

			    if(env.dev) console.log('Succesfully parsed test csv file');

				resolve(self)
			})
			.catch((err) => {

			    if(env.dev) console.error('Failed to parse test csv file');
			    if(env.dev) console.error(err)
			    if(env.dev) console.error("=======================================")

				reject(err)
			})
		})
	}

	return self.init()
}
module.export = cssService;