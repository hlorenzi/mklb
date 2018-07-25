class ServerView
{
	constructor(db, serverId)
	{
		this.db = db
		this.serverId = serverId
		
		this.server = null
		this.matches = []
		this.players = []
		this.playersByName = new Map()
		this.playersByScore = []
	}
	
	
	async build()
	{
		this.server = await this.db.get(this.serverId)
		console.log(this.server)
		
		await this.db.fetchMulti(this.server.matches)
		
		for (let matchId of this.server.matches)
		{
			try
			{
				let match = await this.db.get(matchId)
				this.matches.push(match)
				
				console.log(match)
				for (let team of match.teams)
				{
					team.score = team.players.reduce((accum, p) => accum + p.score, 0)
					
					for (let player of team.players)
					{
						if (this.playersByName.has(player.name))
							this.playersByName.get(player.name).score += player.score
						else
						{
							let newPlayer =
							{
								name: player.name,
								score: player.score
							}
							
							this.players.push(newPlayer)
							this.playersByName.set(player.name, newPlayer)
						}
					}
				}
			}
			catch (e)
			{
				console.error(e)
			}
		}
		
		this.playersByScore = this.players.slice()
		this.playersByScore.sort((a, b) => b.score - a.score)
		
		for (let i = 0; i < this.playersByScore.length; i++)
			this.playersByScore[i].scoreRank = i
		
		console.log(this)
	}
}