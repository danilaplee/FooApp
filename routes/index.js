const express 			= require('express');
const router 			= express.Router();
const fs 				= require("fs")
const multipart 		= require('connect-multiparty');
const multipartMiddleware = multipart();
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
	// foo = instance

	if(env.dev) console.log("======== succesfully initialised "+FooAppConfig.title+" instance =====")
	if(env.dev) console.log(foo)
	if(env.dev) console.log("========================================================================")

	/**
	 * @swagger
	 * /users:
	 *   post:
	 *     summary: Add Users
	 *     description: Add users using csv file
	 *     tags: [Users]
     *     consumes:
     *       - multipart/form-data
	 *     parameters:
	 *       - csv: 
	 *         name: "csv"
	 *         description: Collection of users represented in a csv file
	 *         in: formData
	 *         type: file
	 *         required: true
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Success returns import_id
	 *       500:
	 *         description: Failure returns error
	 */
	router.post('/users', multipartMiddleware, function(req, res, next) 
	{
		
		if(env.dev) console.log("======== csv gateway incoming body =========")
		if(env.dev) console.log(req.body)
		if(env.dev) console.log(req.files)
		if(env.dev) console.log("============================================")
		const _data = fs.readFileSync(req.files.csv.path, "utf8")
		if(env.dev) console.log("============================================")
		instance
		.importUsers({csv:_data})
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((error) => {
			res.status(500).send(JSON.stringify(error))
		})
	})

	/**
	 * @swagger
	 * /users:
	 *   get:
	 *     summary: Get Users
	 *     description: Get All Users
	 *     tags: [Users]
	 *     parameters:
	 *       - import_id: 
	 *         name: "Import"
	 *         description: id of one of the previous imports
	 *         in: query
	 *         type: string
	 *         required: false
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Success get all users
	 */
	router.get("/users", function(req, res, next)
	{
		instance
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
