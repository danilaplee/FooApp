const express 			= require('express');
const router 			= express.Router();
const FooAppConfig 		= require("../FooApp/config");
const env 				= FooAppConfig.env
const FooApp 			= require("../FooApp");
const foo 				= new FooApp(FooAppConfig);
/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: FooAppConfig.title })

})

console.log("====== starting "+FooAppConfig.title+" with env.dev = "+env.dev+" =====")
///USERS API
foo
.then(function(instance)
{
	foo = instance
	if(env.dev) console.log("======== succesfully initialised "+FooAppConfig.title+" instance =====")
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
		.getUsers(req.query)
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((error) => {
			res.status(500).send(JSON.stringify(error))
		})
	})

})
.catch(function(err){

	if(env.dev) console.error("=========== failed to initialize "+FooAppConfig.title+" instance =====")
	if(env.dev) console.error(err)
	if(env.dev) console.error("===================================================================")
	if(env.dev) console.error(foo)
	if(env.dev) console.error("===================================================================")

})

module.exports = router;
