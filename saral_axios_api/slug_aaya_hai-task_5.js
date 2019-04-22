const axios = require('axios');
const fs = require('fs');
const readline = require('readline-sync');

const URL = 'http://saral.navgurukul.org/api/courses';

var course_id_list=[];
const slug_url_list=[];
const slug_list=[];

if(fs.existsSync(__dirname+'/courses.json')){
	console.log("\n\n***************  WELCOME  TO  SARAL  ***************\n\n")
	const readfile= read_json_file_data("courses.json")
	saral_all_course_list(readfile)
	const user_id = selected_course_index(course_id_list)

    if(fs.existsSync(__dirname+`/cache/course_exercise/exercises-${user_id}.json`)){
    	console.log('writeFileSync')
  		const ex_readfile= read_json_file_data(`./cache/course_exercise/exercises-${user_id}.json`)
		courses_exrcise(ex_readfile)
		console.log("\n------------------------------------------------------\n")
		let  input = readline.question('Select your Exercise Id for reading the Content of Exercise :- ');

		//   '\n' using for new line
        console.log("\n********************* Exercise Data *********************\n")

	    if(fs.existsSync(__dirname+`/cache/exercise_data/${slug_url_list[input-1]}.json`)){
	  		const cc= read_json_file_data(`./cache/exercise_data/${slug_url_list[input-1]}.json`)
	  		console.log(cc.content)
	    }else{
	    	const get_content = `${URL}/${user_id}/exercise/getBySlug?slug=${slug_list[input-1]}`
			get_exercise_content(get_content,input)
		    }

    }else{
    	 const exercise_url = `${URL}/${user_id}/exercises`;

    	axios
			.get(exercise_url)
			.then((response) => {
		    	const exercise_api = (response.data);
		    	var json = JSON.stringify(exercise_api, null,4);
				fs.writeFileSync(`./cache/course_exercise/exercises-${user_id}.json`, json)
				var exercise_data = JSON.parse(fs.readFileSync(`./cache/course_exercise/exercises-${user_id}.json`));
	    		courses_exrcise(exercise_data)
	    		console.log("\n------------------------------------------------------\n")
				let  input = readline.question('Select your Exercise Id for reading the Content of Exercise :- ');
	            console.log("\n********************* Exercise Data *********************\n")
	            const slug_url = `${URL}/${user_id}/exercise/getBySlug?slug=${slug_list[input-1]}`
			    
			    //calling the function for fetxh the exercise content.
			    get_exercise_content(slug_url,input)	            
    		})
    		.catch((error) =>{
    			console.log("something went wrong",error)
    		})
	    }

}else{
	axios
		.get(URL)
		.then((response) => {
			const saral_api =(response.data);
			var json = JSON.stringify(saral_api, null,4);
			fs.writeFileSync("courses.json", json)
			var saral_data = JSON.parse(fs.readFileSync('courses.json'));
			saral_all_course_list(saral_data)
			const user_id = selected_course_index(course_id_list)
		    const exercise_url = `${URL}/${user_id}/exercises`;
	
			axios
				.get(exercise_url)
				.then((response) => {
			    	const exercise_api = (response.data);
			    	var json = JSON.stringify(exercise_api, null,4);
					fs.writeFileSync(`./cache/course_exercise/exercises-${user_id}.json`, json)
					var exercise_data = JSON.parse(fs.readFileSync(`./cache/course_exercise/exercises-${user_id}.json`));
		    		courses_exrcise(exercise_data)
					console.log("\n------------------------------------------------------\n")
					var  input = readline.question('Select your Exercise Id for reading the Content of Exercise :- ');
		            console.log("\n********************* Exercise Data *********************\n")
		            const slug_url = `${URL}/${user_id}/exercise/getBySlug?slug=${slug_list[input-1]}`
			    	get_exercise_content(slug_url,input)
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

function selected_course_index(params){
	console.log("\n------------------------------------------------------\n")
	const user_input = parseInt(readline.question('Choose the Course number which you want to learn:- '));
	console.log("\n*******************  Courses Index *******************\n")
	return select_id = params[user_input-1]
}

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


function get_exercise_content(url,user_input){
axios
	.get(url)
	.then((response) =>{
		const slug_data = (response.data);
		var json = JSON.stringify(slug_data, null,4);
		fs.writeFileSync(`./cache/exercise_data/${slug_url_list[user_input-1]}.json`, json)
		var exercise_slug_data = JSON.parse(fs.readFileSync(`./cache/exercise_data/${slug_url_list[user_input-1]}.json`));	    		
		console.log(exercise_slug_data.content)
	})
	.catch((error) =>{
		console.log("something went wrong",error)
	})
}