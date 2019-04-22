const axios = require('axios');
const fs = require('fs');
const readline = require('readline-sync');

const URL = 'http://saral.navgurukul.org/api/courses';

//store the all course list Id in this array
var course_id_list=[];
const slug_url_list=[];
const slug_list=[];

if(fs.existsSync(__dirname+'/courses.json')){
	console.log("\n\n***************  WELCOME  TO  SARAL  ***************\n\n")
	const readfile= read_json_file_data("courses.json")
	saral_all_course_list(readfile)
	const user_id = selected_course_index()
    if(fs.existsSync(__dirname+`/cache/course_exercise/exercises-${user_id}.json`)){
  		const ex_readfile= read_json_file_data(`./cache/course_exercise/exercises-${user_id}.json`)
		courses_exrcise(ex_readfile)
    }else{
	    const exercise_url = `${URL}/${select_id}/exercises`;
    	axios
			.get(exercise_url)
			.then(function(response){
		    	const exercise_api = (response.data);
		    	var json = JSON.stringify(exercise_api, null,4);
				fs.writeFileSync(`./cache/course_exercise/exercises-${user_id}.json`, json)
				var exercise_data = JSON.parse(fs.readFileSync(`./cache/course_exercise/exercises-${user_id}.json`));
	    		courses_exrcise(exercise_data)	
			})
			.catch((error) => {
				console.log(error)
			})
    }

}else{
	axios
		.get(URL)
		.then(function(response){
			const saral_api =(response.data);
			var json = JSON.stringify(saral_api, null,4);
			fs.writeFileSync("courses.json", json)
			var saral_data = JSON.parse(fs.readFileSync('courses.json'));
			saral_all_course_list(saral_data)
			const user_id = selected_course_index()
			//creating a exercise url for fetch the Parent and Chile exercise data.
		    const exercise_url = `${URL}/${select_id}/exercises`;
		
		axios
			.get(exercise_url)
			.then(function(response){
		    	const exercise_api = (response.data);
		    	var json = JSON.stringify(exercise_api, null,4);
				fs.writeFileSync(`./cache/course_exercise/exercises-${user_id}.json`, json)
				var exercise_data = JSON.parse(fs.readFileSync(`./cache/course_exercise/exercises-${user_id}.json`));
	    		courses_exrcise(exercise_data)
	    	})
			.catch((error) => {
				console.log(error)
			})
	})
	.catch((error) =>{
		console.log(error)
	})
}


function saral_all_course_list(readfile_var){
	const availableCourses = readfile_var['availableCourses']
	for(var index=0; index<availableCourses.length; index++){
		courses = availableCourses[index]
		course_name = courses['name']
		course_id = courses['id']
		console.log(index+1,course_id,course_name)
		course_id_list.push(course_id)
	}
}

function read_json_file_data(f_name){
	var data = fs.readFileSync(__dirname+'/'+f_name);
	return readfile = JSON.parse(data)
}

function selected_course_index(){
	console.log("------------------------------------------------------")
	console.log("\nChoose the Course number which you want to learn:- \n")
	const user_input = parseInt(readline.question('select your course list number:- '));
	return select_id = course_id_list[user_input-1]
}

//find the ParentExercise and childExercises.
function courses_exrcise(exercise_api){
	const exercise_data = exercise_api['data'];
	for (let index=0; index<exercise_data.length; index++){
	    exercises = exercise_data[index];
	    exercise_name = exercises['name']
	    slug = exercises['slug']
	    slug_url_replace = slug.replace("/","_")
	    child_exercise = exercises['childExercises']
	    slug_url_list.push(slug_url_replace)
	    slug_list.push(exercises['slug'])
	    console.log(index+1,exercise_name)
	    if(child_exercise.length>0){
	        for(let j=0; j<child_exercise.length; j++){
	            child_exercise_name=child_exercise[j]['name']
	            child_exercise_slug=child_exercise[j]['slug']
	            child_slug_replace=child_exercise_slug.replace("/","_")
	            console.log("\t"+(index+1)+"."+(j+1)+" "+(child_exercise_name))
	            slug_list.push(child_exercise_slug)
	            slug_url_list.push(child_slug_replace)
	        }
	    }
	}
}