var gameData = {
    training: 0,
    trainingPerClick: 0.1,
    trainingPerClickCost: 1,
    updateSpeed: 1000,
    updateSpeedCost: 50,
    studyPoints: 1,
    maxStudyPoints: 1,
    idle: false,
    active: false
}

function train() {
    gameData.training += gameData.trainingPerClick
    var trainingShown = Number(gameData.training).toFixed(2)
    document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
}

var powerTrainCooldown = false;
function powerTrain() {
    if (powerTrainCooldown == false && gameData.active == true){
        var originalTrainingPerClick = gameData.trainingPerClick
        var originalUpdateSpeed = gameData.updateSpeed
        gameData.trainingPerClick *= 5
        gameData.updateSpeed /= 2
        powerTrainCooldown = true
        mainGameLoop = window.setInterval(function () {
            train();
        }, gameData.updateSpeed);
        document.getElementById("powerTrainActive").hidden = false
        setTimeout(function(){ 
            gameData.trainingPerClick = originalTrainingPerClick
            gameData.updateSpeed = originalUpdateSpeed
            clearInterval(mainGameLoop)
            powerTrainCooldown = false
            document.getElementById("powerTrainActive").hidden = true
        }, 5000)  
    }
}

function buyTrainingPerClick() {
    if (gameData.training >= gameData.trainingPerClickCost && powerTrainCooldown == false) {
        gameData.training -= gameData.trainingPerClickCost
        gameData.trainingPerClick += 1 + Math.round(gameData.trainingPerClick / 2)
        gameData.trainingPerClickCost += Math.round(gameData.trainingPerClickCost * 1.1)
        var trainingShown = Number(gameData.training).toFixed(2)
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (Currently " + numberWithCommas(gameData.trainingPerClick) + ") Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power"
    }
}

function idleStudy() {
    if (gameData.studyPoints > 0){
        mainGameLoop = window.setInterval(function () {
           train();
        }, gameData.updateSpeed)
        gameData.studyPoints -= 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        document.getElementById("battlePowerPerSecond").hidden = false
        gameData.idle = true      
    }
    else if (gameData.idle == true) {
        clearInterval(mainGameLoop)
        gameData.studyPoints += 1
        document.getElementById("battlePowerPerSecond").hidden = true
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        gameData.idle = false
    }
    else if (gameData.active == true && powerTrainCooldown == false) {
        gameData.active = false
        gameData.idle = true
        mainGameLoop = window.setInterval(function () {
            train();
        }, gameData.updateSpeed)
        document.getElementById("powerTrainButton").hidden = true
        document.getElementById("battlePowerPerSecond").hidden = false
    }
}

function activeStudy() {
    if (gameData.studyPoints > 0){
        gameData.studyPoints -= 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        gameData.active = true
        document.getElementById("powerTrainButton").hidden = false
    }
    else if (gameData.active == true && powerTrainCooldown == false) {
        gameData.studyPoints += 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        gameData.active = false
        document.getElementById("powerTrainButton").hidden = true
    }
    else if (gameData.idle == true) {
        clearInterval(mainGameLoop)
        gameData.idle = false
        gameData.active = true
        document.getElementById("battlePowerPerSecond").hidden = true
        document.getElementById("powerTrainButton").hidden = false
    }
}
   
function lowerUpdateSpeed() {
    if (gameData.training >= gameData.updateSpeedCost && powerTrainCooldown == false) {
        gameData.training -= gameData.updateSpeedCost
        gameData.updateSpeed /= 1.5
        gameData.updateSpeedCost *= 10
        var trainingShown = Number(gameData.training).toFixed(2)
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (Currently " + numberWithCommas(gameData.updateSpeed) + ") Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        if (gameData.idle == true) {
            resetUpdateSpeed()        
        }
    }
}

function resetUpdateSpeed() {
    clearInterval(mainGameLoop)
    mainGameLoop = window.setInterval(function () {
        train();
    }, gameData.updateSpeed)
}

function loadGame() {
    var savegame = JSON.parse(localStorage.getItem("IdleBattleSave"))
    if (savegame !== null) {
        gameData = savegame
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        resetUpdateSpeed()    
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (Currently " + numberWithCommas(gameData.trainingPerClick) + ") Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power",
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (Currently " + numberWithCommas(gameData.updateSpeed) + ") Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
    }
}

function saveGame() {
    localStorage.setItem("IdleBattleSave", JSON.stringify(gameData))
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}