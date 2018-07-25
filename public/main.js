class ClientDatabase
{
	constructor()
	{
		this.objects = new Map()
	}
	
	
	async fetchMulti(ids)
	{
		console.log(ids)
		
		let array = []
		for (let id of ids)
			array.push(id)
		
		let result = await request("post", "/objects", { ids: array })
		console.log(result)
		
		for (let entry of Object.entries(result))
			this.objects.set(entry[0], entry[1])
	}
	
	
	async get(id)
	{
		if (this.objects.has(id))
			return this.objects.get(id)
		
		let object = await request("get", "/object/" + id, "")
		
		this.objects.set(id, object)
		return object
	}
}


const db = new ClientDatabase()
const serverView = new ServerView(db, getURLQueryParameter("id"))


async function render()
{
	await serverView.build()
	
	for (let player of serverView.playersByScore)
		document.getElementById("divPlayers").appendChild(makePlayerSlot(player))
	
	for (let match of serverView.matches)
		document.getElementById("divMatches").appendChild(makeMatchSlot(match))
}


function makePlayerSlot(player)
{
	let slot = document.createElement("div")
	slot.className = "playerSlot"
	
	let rank = document.createElement("div")
	rank.className = "playerSlotRank"
	rank.innerHTML = (player.scoreRank + 1).toString()
	slot.appendChild(rank)
	
	let name = document.createElement("div")
	name.className = "playerSlotName"
	name.innerHTML = player.name
	slot.appendChild(name)
	
	let score = document.createElement("div")
	score.className = "playerSlotScore"
	score.innerHTML = player.score.toString()
	slot.appendChild(score)
	
	return slot
}


function makeMatchSlot(match)
{
	let slot = document.createElement("div")
	slot.className = "matchSlot"
	
	let dateStr = new Date()
	dateStr.setTime(match.date)
	
	let date = document.createElement("div")
	date.className = "matchSlotDate"
	date.innerHTML = dateStr.toDateString()
	slot.appendChild(date)
	
	let summary = document.createElement("div")
	summary.className = "matchSlotSummary"
	summary.appendChild(makeMatchSummary(match))
	slot.appendChild(summary)
	
	return slot
}


function makeMatchSummary(match)
{
	let summary = document.createElement("span")
	
	for (let i = 0; i < match.teams.length; i++)
	{
		let team = match.teams[i]
		
		if (i > 0)
		{
			let separator = document.createElement("span")
			separator.className = "matchSlotSummaryName"
			separator.innerHTML = "· "
			summary.appendChild(separator)
		}
		
		let name = document.createElement("span")
		name.className = "matchSlotSummaryName"
		name.innerHTML = team.name
		summary.appendChild(name)
		
		let score = document.createElement("span")
		score.className = "matchSlotSummaryScore"
		score.innerHTML = team.score
		summary.appendChild(score)
	}
	
	return summary
}


function generateRandomMatch()
{
	const teams = ["A", "B", "C", "D", "E", "F"]
	const players = ["Albert", "Betty", "Carol", "Damian", "Estella", "Fred", "Gabriel", "Herbert", "Ignacius", "Johnny", "Kate", "Lance"]
	
	const randomTeam = () => teams[Math.floor(Math.random() * (teams.length - 0.01))]
	const randomPlayer = () => players[Math.floor(Math.random() * (players.length - 0.01))]
	const randomScore = () => Math.floor(Math.random() * 120)
	
	const generate = (numTeams, numPlayers) =>
	{
		let match = { teams: [] }
		for (let i = 0; i < numTeams; i++)
		{
			let team = { name: teams[i], players: [] }
			for (let j = 0; j < numPlayers; j++)
				team.players.push({ name: players[(i * numPlayers) + j], score: randomScore() })
			
			match.teams.push(team)
		}
		
		return JSON.stringify(match)
	}
	
	switch (Math.floor(Math.random() * 3.99))
	{
		case 0:
		default: return generate(2, 6)
		case 1: return generate(3, 4)
		case 2: return generate(4, 3)
		case 3: return generate(6, 2)
	}
}


function matchSetRandom()
{
	let inputMatchData = document.getElementById("inputMatchData")
	inputMatchData.value = generateRandomMatch()
}


function matchCreate()
{
	let inputMatchData = document.getElementById("inputMatchData")
	request("post", "/match_create", { serverId: serverView.serverId, matchData: JSON.parse(inputMatchData.value) })
	inputMatchData.value = generateRandomMatch()
}