//Axios is a popular, promise-based HTTP client that sports an easy-to-use API and can be used in both the browser and Node.js.
const axios = require('axios');

// The Node.js file system module allows you to work with the file system on your computer.
// To include the File System module, use the require() method:
const fs = require('fs');

const URL = 'http://saral.navgurukul.org/api/courses';


// Make a request for a user with a given URL 
// axios.get which will return a promise
axios.get(URL)
	// .then() is a method that exists on Promises and is a mechanism for code synchronization.
	.then(function(response){

		const saral_api =(response.data);
		//The JSON.stringify() method converts a JavaScript object or value to a JSON string,
		const json = JSON.stringify(saral_api, null,4);

		var file = fs.writeFile('courses.json', json, 'utf8', function(err){
			if (err) throw err;
			//The simplest way to read a file in Node is to use the fs.readFileSync() method it's a synchronous version
			//JSON.parse() to convert text into a JavaScript object: var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
			var saral_data = JSON.parse(fs.readFileSync('courses.json'));
			console.log(saral_data)
		});
	})
	//The catch() method returns a Promise and deals with rejected cases only. 
	.catch(function(error){
		console.log(error)
})