const axios = require('axios');
const fs = require('fs');
const readline = require('readline-sync');

const URL = 'http://saral.navgurukul.org/api/courses';

const course_id_list=[];
const slug_list=[];
const slug_url_list=[]

axios
    .get(URL)
	.then(function(response){
		const api_data = (response.data);
		const availableCourses = api_data.availableCourses
		console.log("\n\n***************  WELCOME  TO  SARAL  ***************\n\n")
		for (var index=0; index<availableCourses.length; index++){
			courses = availableCourses[index];
			course_id = courses['id'];
			course_name = courses['name'] 
			console.log(index+1,course_id,course_name)
			course_id_list.push(course_id)

		}
		const user_id = select_course()
        const exercise_url = `${URL}/${select_id}/exercises`
        axios
            .get(exercise_url)
            .then(function(response){
                exercise_api = (response.data);
                const exercise_data = exercise_api.data;
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
                var a = readline.question('enter the exercise id for the content');
                var sl = slug_url_list[a-1];
                slug_url = `${URL}/${select_id}/exercise/getBySlug?slug=${sl}`
               
                axios
                    .get(slug_url)
                    .then((data)=>{
                        console.log(data.data)
                    })
                    .catch((err)=>{
                        console.log('here is errror',err)
                    })                   
            })
            .catch(function(error){
                console.log(error)	
            })	
	})
	.catch(function(error){
		console.log(error)
	})

function select_course(){
	console.log("------------------------------------------------------------------------------------------")
	console.log("\nChoose the Course number which you want to learn:- \n")
	const user_input = parseInt(readline.question('select your course list number:- '));
	return select_id = course_id_list[user_input-1]
}