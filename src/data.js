const { Database } = require("./database")
const db = new Database()


function serverCreate(name)
{
	return db.create({ type: "server", name: name, matches: [] })
}


function serverGet(user, serverId)
{
	const server = db.get(serverId)
	if (server == null || server.type != "server")
		return null
	
	return server
}


function matchCreate(user, serverId, matchData)
{
	const server = serverGet(user, serverId)
	if (server == null)
		return null
	
	const matchId = db.create(Object.assign({ type: "match", date: Date.now() }, matchData))
	if (matchId == null)
		return null
	
	server.matches.push(matchId)
	return matchId
}


module.exports =
{
	db,
	serverCreate,
	serverGet,
	matchCreate
}














