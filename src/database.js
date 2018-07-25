const utils = require("./utils")


class Database
{
	constructor()
	{
		this.objects = new Map()
	}
	
	
	create(contents)
	{
		while (true)
		{
			const newId = utils.generateRandomId()
			console.log(newId)
			
			if (!this.objects.has(newId))
			{
				contents.id = newId
				this.objects[newId] = contents
				
				console.log(this.objects)
				return newId
			}
		}
	}
	
	
	get(id)
	{
		let object = this.objects[id]
		if (object === undefined)
			return null
		
		return object
	}
}


module.exports =
{
	Database
}