const axios = require('axios');
const fs = require('fs');

const URL = 'http://saral.navgurukul.org/api/courses';



axios.get(URL)
	.then(function(response){
		const saral_api =(response.data);
		const json = JSON.stringify(saral_api, null,4);
		var file = fs.writeFile('courses.json', json, 'utf8', function(err){
			if (err) throw err;
			var saral_data = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
			console.log(obj)
		});
	})
	.catch(function(error){
		console.log(error)
})



