var gameData = {
    training: 0,
    trainingPerClick: 1,
    trainingPerClickCost: 2,
    updateSpeed: 1000,
    updateSpeedCost: 100,
    availableAP: 0,
    totalAP: 0,
    buyAPCost: 10000,
    studyPoints: 1,
    maxStudyPoints: 1,
    powerTrainPower: 1.5,
    powerTrainSpeed: 2,
    upgradesBought: 0,
    autoUpgrade: false,
    idle: false,
    active: false,
    powerTrainTrainingMultiplier: 0,
    powerTrainUpdateMultiplier: 1
}

function train() {
    gameData.training += gameData.trainingPerClick
    if (gameData.training >= gameData.trainingPerClickCost && gameData.autoUpgrade == true){
        buyTrainingPerClick()
    }
    else if (gameData.training >= gameData.updateSpeedCost && gameData.autoUpgrade == true){
        lowerUpdateSpeed()
    }
    var trainingShown = Number(gameData.training).toFixed(2)
    document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
}

var powerTrainCooldown = false;
function powerTrain(){
    if (powerTrainCooldown == false && gameData.active == true){
        var originalTrainingPerClick = gameData.trainingPerClick
        var originalUpdateSpeed = gameData.updateSpeed
        gameData.trainingPerClick *= gameData.powerTrainPower
        gameData.updateSpeed /= gameData.powerTrainSpeed
        powerTrainCooldown = true
        mainGameLoop = window.setInterval(function () {
            train();
        }, gameData.updateSpeed);
        var updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
        var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power"            
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        document.getElementById("powerTrainActive").hidden = false
        setTimeout(function(){ 
            if (gameData.upgradesBought > 0){
                gameData.trainingPerClick = originalTrainingPerClick * (1.1)**gameData.upgradesBought
            }
            else {
                gameData.trainingPerClick = originalTrainingPerClick
            }
            gameData.updateSpeed = originalUpdateSpeed * gameData.powerTrainUpdateMultiplier
            clearInterval(mainGameLoop)
            powerTrainCooldown = false
            document.getElementById("powerTrainActive").hidden = true
            gameData.powerTrainTrainingMultiplier = 0
            gameData.powerTrainUpdateMultiplier = 1
            gameData.upgradesBought = 0
            var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
            var updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
            var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
            document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
            document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power"
            document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        }, 5000)  
    }
}

function buyTrainingPerClick(){
    if (gameData.training >= gameData.trainingPerClickCost){
        gameData.training -= gameData.trainingPerClickCost
        gameData.upgradesBought += 1
        gameData.trainingPerClick *= 1.1
        gameData.trainingPerClickCost = (gameData.trainingPerClickCost * 2)
        var trainingShown = Number(gameData.training).toFixed(2)
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power"
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
    if (gameData.training >= gameData.updateSpeedCost) {
        gameData.powerTrainUpdateMultiplier /= 1.2
        gameData.training -= gameData.updateSpeedCost
        gameData.updateSpeed /= 1.2
        gameData.updateSpeedCost *= 10
        var trainingShown = Number(gameData.training).toFixed(2)
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        var updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        if (gameData.idle == true) {
            resetUpdateSpeed()        
        }
    }
}

function buyAP() {
    if (gameData.training >= gameData.buyAPCost && powerTrainCooldown == false){
        gameData.training -= gameData.buyAPCost
        gameData.availableAP += 1
        gameData.totalAP += 1
        gameData.buyAPCost *= 2
        gameData.updateSpeed = 1000
        gameData.updateSpeedCost = 100
        gameData.trainingPerClick = 1
        gameData.trainingPerClickCost = 2
        gameData.training = 0
        if(gameData.idle == true){
            resetUpdateSpeed()  
        }
        var trainingShown = Number(gameData.training).toFixed(2)
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        var costOfAPShown = Number(gameData.buyAPCost).toFixed(2)
        var updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
        var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("textAPTotal").innerHTML = "AP Total: " + numberWithCommas(gameData.totalAP)
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("buyAPButton").innerHTML = "Buy 1 AP (Attribute Point) Cost: " + numberWithCommas(costOfAPShown) + " Battle Power" 
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power"
    }
}

function resetUpdateSpeed() {
    clearInterval(mainGameLoop)
    mainGameLoop = window.setInterval(function () {
        train();
    }, gameData.updateSpeed)
}

function buyAutoUpgrade() {
    gameData.availableAP -= 1
    gameData.autoUpgrade = true
    document.getElementById("textAPAvailable").innerHTML = "Available AP: " + numberWithCommas(gameData.availableAP)
}

function loadGame() {
    var savegame = JSON.parse(localStorage.getItem("IdleBattleSave"))
    if (savegame !== null) {
        gameData = savegame
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        if (gameData.idle == true){
            resetUpdateSpeed()
            var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
            document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
            document.getElementById("battlePowerPerSecond").hidden = false
            document.getElementById("powerTrainButton").hidden = true
        }
        else if (gameData.active == true){
            document.getElementById("battlePowerPerSecond").hidden = true
            document.getElementById("powerTrainButton").hidden = false
        }
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Battle Power per second"
        document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(gameData.trainingPerClick) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Battle Power",
        updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
        document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Battle Power"
        var trainingShown = Number(gameData.training).toFixed(2)
        document.getElementById("battlePowerTrained").innerHTML = numberWithCommas(trainingShown) + " Battle Power"
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
    }
}

function saveGame() {
    localStorage.setItem("IdleBattleSave", JSON.stringify(gameData))
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

