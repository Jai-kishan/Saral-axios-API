const axios = require('axios');
const fs = require('fs');

const URL = 'http://saral.navgurukul.org/api/courses';


//The way to check if a file exists in the filesystem, is by using the fs.existsSync() method:
//This means that it’s blocking.
if(fs.existsSync(__dirname+'/courses.json')){
	console.log("\n\n***************  WELCOME  TO  SARAL  ***************\n\n")
	const readfile= read_file() // Here I call the read_file function which work is convert text into a JavaScript object
	course_list(readfile)

}else{
	//#we are calling axios function by giving paramater of courses url.
	axios.get(URL)
	.then(function(response){
		const saral_api =(response.data); // fetch the data form "URL" and store content in valriable.
		var json = JSON.stringify(saral_api, null,4);
		var file = fs.writeFileSync("courses.json", json)
		var saral_data = JSON.parse(fs.readFileSync('courses.json'));
		course_list(saral_data)
		})	
	.catch(function(error){
	console.log(error)
	})
}

function course_list(readfile_var){
	const availableCourses = readfile_var['availableCourses']
	for(let index=0; index<availableCourses.length; index++){
		courses = availableCourses[index]
		// in cousre_name variable I have assigned name of courses which is 
		// available inside availableCourses and inside name of it that too index wise. 
		course_name = courses['name']
		//    # as we are storing course_name in the same way we are storing course_id. 
		course_id = courses['id']
	    //# printed index even so that course_name come along with number wise series.
		console.log(index+1,course_name)
	}
}

function read_file(){
	var data = fs.readFileSync(__dirname+'/courses.json');
	return readfile = JSON.parse(data)
}