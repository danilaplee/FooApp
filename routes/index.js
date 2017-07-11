const express 			= require('express');
const router 			= express.Router();
const FooApp 			= require("../FooApp");
const FooAppConfig 		= require("../FooApp/config.json");
const env 				= FooAppConfig.env
const foo 				= new FooApp(FooAppConfig);

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: appConfig.title })

})

///USERS API
foo.then(function(instance)
{
	if(env.dev) console.log("======== succesfully initialised "+foo.config.title+" instance =====")
	if(env.dev) console.log(instance)
	if(env.dev) console.log("========================================================================")
	if(env.dev) console.log(foo)
	if(env.dev) console.log("========================================================================")

	router.post('/users', function(req, res, next) 
	{
		
		if(env.dev) console.log("======== csv gateway incoming body =========")
		if(env.dev) console.log(req.body)
		if(env.dev) console.log("============================================")

		foo
		.importUsers(req.body)
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((error) => {
			res.status(500).send(JSON.stringify(error))
		})
	})

	router.get("/users", function(req, res, next)
	{
		foo
		.getUsers(req.params)
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((error) => {
			res.status(500).send(JSON.stringify(error))
		})
	})

})
.catch(function(err){

	if(env.dev) console.error("=========== failed to initialise "+appConfig.title+" instance =====")
	if(env.dev) console.error(err)
	if(env.dev) console.error("===================================================================")
	if(env.dev) console.error(app)
	if(env.dev) console.error("===================================================================")

})

module.exports = router;
