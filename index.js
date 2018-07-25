const express = require("express")
const app = express()
const data = require("./src/data")


app.set("view engine", "pug")
app.use(express.json())


app.get("/", (req, res) =>
{
	res.render("index")
})


app.get("/server_create", (req, res) =>
{
	const newServerId = data.serverCreate()
	res.redirect("/server?id=" + newServerId)
})


app.post("/match_create", (req, res) =>
{
	console.log(req.body)
	const serverId = req.body.serverId
	const matchData = req.body.matchData
	
	if (data.matchCreate(null, serverId, matchData))
		res.status(200).send()
	else
		res.status(403).send()
})


app.get("/server", (req, res) =>
{
	res.render("server_home")
})


app.get("/object/:id", (req, res) =>
{
	const id = req.params.id
	const object = data.db.get(id)
	
	if (object == null)
	{
		res.status(404).send()
		return
	}
	
	res.send(JSON.stringify(object))
})


app.post("/objects", (req, res) =>
{
	console.log(req.body)
	const ids = req.body.ids
	
	let result = {}
	for (let id of ids)
		result[id.toString()] = data.db.get(id.toString())
	
	console.log(result)
	
	res.send(JSON.stringify(result))
})


app.use("/", express.static(__dirname + "/public/"))


app.listen(80, () =>
{
	console.log("server started at port 80")
})