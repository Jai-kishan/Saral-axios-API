const axios = require('axios');
const fs = require('fs');

//we are using readline_sync module for conversation with the user via a console
const readline = require('readline-sync');

const URL = 'http://saral.navgurukul.org/api/courses';
var course_id_list=[];

if(fs.existsSync(__dirname+'/courses.json')){
	console.log("\n\n***************  WELCOME  TO  SARAL  ***************\n\n")
	const readfile= read_file()
	course_list(readfile)
	const user_id = select_course()
	console.log(user_id)


}else{
	axios.get(URL)
	.then(function(response){
		const saral_api =(response.data);
		var json = JSON.stringify(saral_api, null,4);
		fs.writeFileSync("courses.json", json)
		var saral_data = JSON.parse(fs.readFileSync('courses.json'));
		course_list(saral_data)
		const user_id = select_course()
		console.log(user_id)
	})
	.catch(function(error){
	console.log(error)
	})
}


function course_list(readfile_var){
	const availableCourses = readfile_var['availableCourses']
	for(var index=0; index<availableCourses.length; index++){
		courses = availableCourses[index]
		course_name = courses['name']
		course_id = courses['id']
		console.log(index+1,course_name)
		course_id_list.push(course_id)
	}
}

//firstly read the file after that this function () convert the text into a JavaScript object
function read_file(){
	var data = fs.readFileSync(__dirname+'/courses.json');
	return readfile = JSON.parse(data)
}

//taking a input from the user and according to course list we return the value
function select_course(){
	console.log("------------------------------------------------------")
	console.log("\nChoose the Course number which you want to learn:- \n")
	const user_input = parseInt(readline.question('select your course list number:- '));
	const select_id = course_id_list[user_input-1]
	return (`\t\nAapne jo course ${user_input} select kiya hai us course ki ID ${select_id} hai`)
}
