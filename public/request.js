function request(verb, api, content)
{
	return new Promise((resolve, reject) =>
	{
		let stringContent = JSON.stringify(content)
		console.log("request() content:\n" + stringContent + "\n")
		
		let req = new XMLHttpRequest()
		req.open(verb, api, true)
		req.setRequestHeader("Content-Type", "application/json")
		req.onload = () =>
		{
			if (req.status === 200)
			{
				if (req.response == "")
					resolve({})
				else
					resolve(JSON.parse(req.response))
			}
			else
				reject(req.status)
		}
		req.send(stringContent)
	})
}