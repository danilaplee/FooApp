const csvService 	= require("./csvService")
const dbService 	= require("./dbService")

var Services = function(app) 
{
	var self 		= this
		self.app 	= app
		self.config = self.app.config
		
	const env		= self.env

	return new Promise(function(resolve, reject)
	{
		new dbService(self)
		.then(function(db)
		{
			if(env.dev) console.log("======= succesfully initialised db service ========")
		
			self.db = db
		
			return new csvService(self)
		})
		.then(function(csv)
		{
			if(env.dev) console.log("======= succesfully initialised csv service ========")		
			if(env.dev) console.log("=========== succeded to init all services ==========");

			self.csv = csv
		
			resolve(self)
		})
		.catch(function(err) 
		{
			if(env.dev) console.error("======= failed to init services =====");
		
			reject(err)
		})
	})
}
module.export = Services;