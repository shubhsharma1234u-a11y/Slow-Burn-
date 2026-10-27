 const savedData = localStorage.getItem("slowburnWorkouts");
      const data = JSON.parse(savedData);
      // selection of DOM Elements
      let Form = document.querySelector("#form");

      let sessionType = document.querySelector("#sessionType");

      let ExerciseName = document.querySelector("#ExerciseName");

      let Weight = document.querySelector("#Weight");

      let NumOfSets = document.querySelector("#NumOfSets");

      let RepsPerSet = document.querySelector("#RepsPerSet");

      let workoutHistory = Array.isArray(data) ? data : [];

      let workoutList = document.querySelector("#workoutList");
      Form.addEventListener("submit", (event) => {
        event.preventDefault();

        // STORING THE MAIN INPUTS
        let recordedSession = sessionType.value;
        let recordedExercise = ExerciseName.value;
        let recordedWeight = Number(Weight.value);
        let recordedSets = Number(NumOfSets.value);
        let recordedRepsPerSet = Number(RepsPerSet.value);

        // Adding Validations
        // EXERCISE CANNOT BE EMPTY
        if (recordedExercise.trim() === "") {
          return alert("Exercise Cannot be Empty");
        }

        // WEIGHT CANNOT BE EMPTY
        if (Weight.value.trim() === "" || !Number.isFinite(recordedWeight)|| recordedWeight < 0  ) {
          return alert("Entered Weight is Incorrect");
        }
        // SETS CANNOT BE LOWER THAN 1
        if (recordedSets < 1 || !Number.isInteger(recordedSets)) {
          return alert("Sets cannot be lower than 1");
        }
        // Reps cannot be lower than 1
        if (recordedRepsPerSet < 1 || !Number.isInteger(recordedRepsPerSet)) {
          return alert("Reps cannot be lower than 1");
        }
        // Storing the inputs in an object
        let workout = {
          Session: recordedSession,
          Exercise: recordedExercise,
          Weight: recordedWeight,
          Sets: recordedSets,
          Reps: recordedRepsPerSet,
        };

        // logging the workout in an array
        workoutHistory.push(workout);
        localStorage.setItem(
          "slowburnWorkouts",
          JSON.stringify(workoutHistory),
        );
        renderedWorkout(workout);
        workoutList.lastElementChild.style.animationDelay = "0s";
        updateStats()  
        Form.reset(); 

        // displaying the workout session
      });

      function updateStats() {
        let stats = document.querySelector("#stats");
        let totalWorkout = workoutHistory.length;
        let totalSets = workoutHistory.reduce((a, b) => {
          return a + b.Sets;
        }, 0);
        let totalReps = workoutHistory.reduce((a, b) => {
          return a + b.Sets * b.Reps;
        }, 0);
        let pushWorkouts = workoutHistory.filter((workout)=>{
            return workout.Session ==="Push"
        }).length;
         let pullWorkouts = workoutHistory.filter((workout)=>{
            return workout.Session ==="Pull"
        }).length;
        let legWorkouts = workoutHistory.filter((workout)=>{
            return workout.Session === "Legs"
        }).length;

        // heaviest weight recorded 
        let heaviestWeight = workoutHistory.reduce((highest ,workout)=>{
            return Math.max(highest, workout.Weight);
        },0);
        let totalVolume = workoutHistory.reduce((total,workout)=>{
            return total+ workout.Weight* workout.Sets * workout.Reps;
        },0)
        if (totalWorkout === 0) {
return  stats.innerText = "No workouts recorded yet. Start your Slowburn journey!";
;
}

stats.classList.remove("stats-update");
void stats.offsetWidth;
stats.classList.add("stats-update");        
        stats.innerText = `

Total Workouts : ${totalWorkout}
Total Sets : ${totalSets}
Total Reps : ${totalReps}
Push Workouts: ${pushWorkouts}
Pull Workouts: ${pullWorkouts}
Legs Workouts: ${legWorkouts}
Heaviest Weight: ${heaviestWeight} kg
Total Training Volume: ${totalVolume} kg`;
      }
      updateStats();
      workoutHistory.forEach((workout) => {
        renderedWorkout(workout);

      });

      function renderedWorkout(workout) {
        let message = document.createElement("div");
        message.classList.add("workout-enter");
        // creating a delete button
        let deleteBtn = document.createElement("button");

        deleteBtn.innerText = "delete";

        message.innerText = `
Session : ${workout.Session}
Exercise : ${workout.Exercise}
Weight : ${workout.Weight}
Sets : ${workout.Sets}
Reps : ${workout.Reps}`;
        // adding delete button to a workout card
        message.append(deleteBtn);
        workoutList.append(message);
        // givb=ing functionality to delete button
        deleteBtn.addEventListener("click", (event) => {
          message.remove();
          workoutHistory = workoutHistory.filter((item) => {
            return item !== workout;
          });
          console.log(workoutHistory);

          localStorage.setItem(
            "slowburnWorkouts",
            JSON.stringify(workoutHistory),
            
          );
          updateStats()
        });
      }