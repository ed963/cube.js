"use strict"

// Example 1
const cube1 = new Cube("container1", {
    start: ["R", "R", "L'", "L'", "U", "U", "R", "R", "L'", "L'", "D", "D"]
})

// Example 2
const cube2 = new Cube("container2", {
    mode: "preset", 
    start: ["R", "U", "R'", "U'", "R'", "F", "R", "R", "U'", "R'", "U'", "R", "U", "R'", "F'"], 
    sequence: ["R", "U", "R'", "U'", "R'", "F", "R", "R", "U'", "R'", "U'", "R", "U", "R'", "F'"],
})

// Example 3
const cube3 = new Cube("container3", {
    hideInterface: true,
    start: ["X"]
})

document.querySelector("#fancy-f-button").addEventListener("click", () => {
    cube3.F()
})


// Example 4
let numMoves = 0;
let timerStarted = false;

function incrementTimer() {
    document.querySelector("#time").innerHTML = parseInt(document.querySelector("#time").innerHTML) + 1;
}

function incrementCount() {
    numMoves++;
    document.querySelector("#move-count").innerHTML = numMoves;
}

const cube4 = new Cube("container4", {
    onClick: () => {
        incrementCount();
        if (!timerStarted) {
            timerStarted = true;
            setInterval(incrementTimer, 1000);
        }
    },
    start: ["X", "Y"]
})

// Example 5
const cube5 = new Cube("container5", {
    onClick: updateIsSolved,
    start: ["Y", "Y"]
})

function updateIsSolved() {
    const isSolved = document.querySelector("#is-solved")
    if (cube5.isSolved()) {
        isSolved.innerHTML = "The cube is currently solved!"
        isSolved.style.color = "green"
    }
    else {
        isSolved.innerHTML = "The cube is NOT currently solved!"
        isSolved.style.color = "red"
    }
}

document.querySelector("#scramble-button").addEventListener("click", () => {
    cube5.scramble()
    updateIsSolved()
})

updateIsSolved()