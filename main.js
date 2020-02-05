var gameData = {
    training: 0,
    trainingPerClick: 1,
    trainingPerClickCost: 20,
    updateSpeed: 100,
    updateSpeedCost: 1000,
    availableAP: 0,
    totalAP: 0,
    buyAPCost: 50000,
    studyPoints: 1,
    maxStudyPoints: 1,
    powerTrainPower: 1.5,
    powerTrainSpeed: 2,
    upgradesBought: 0,
    updateUpgradesBought: 0,
    powerTrainUpgradeMultiplier: 1,
    idleUpgradeMultiplier: 1,
    autoUpgrade: false,
    idle: false,
    active: false,
    powerTrainTrainingMultiplier: 0,
    powerTrainUpdateMultiplier: 1,
    enemyList: []
}

function train(){
    var numberAnimation = new CountUp("currentTrainingPoints", gameData.training, gameData.training + gameData.trainingPerClick, 0, (gameData.updateSpeed / 1000), options);
    numberAnimation.start()
    gameData.training += gameData.trainingPerClick
    if (gameData.training >= gameData.trainingPerClickCost && gameData.autoUpgrade == true){
        buyTrainingPerClick()
    }
    else if (gameData.training >= gameData.updateSpeedCost && gameData.autoUpgrade == true){
        lowerUpdateSpeed()
    }
}

var powerTrainCooldown = false;
function powerTrain(){
    if (powerTrainCooldown == false && gameData.active == true){
        var originalTrainingPerClick = gameData.trainingPerClick
        var originalUpdateSpeed = gameData.updateSpeed
        gameData.trainingPerClick *= (gameData.powerTrainPower * gameData.powerTrainUpgradeMultiplier) 
        gameData.updateSpeed /= gameData.powerTrainSpeed
        powerTrainCooldown = true
        mainGameLoop = window.setInterval(function (){
            train();
        }, gameData.updateSpeed);
        updateHTML()
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
        document.getElementById("battlePowerPerSecond").innerHTML = "POWER TRAIN ACTIVE: " + trainingPerSecondShown + " Training Points per second!"         
        document.getElementById("battlePowerPerSecond").hidden = false
        setTimeout(function(){ 
            if (gameData.upgradesBought > 0){
                gameData.trainingPerClick = originalTrainingPerClick * (1.2)**gameData.upgradesBought
            }
            else {
                gameData.trainingPerClick = originalTrainingPerClick
            }
            gameData.updateSpeed = originalUpdateSpeed * gameData.powerTrainUpdateMultiplier
            clearInterval(mainGameLoop)
            powerTrainCooldown = false
            gameData.powerTrainTrainingMultiplier = 0
            gameData.powerTrainUpdateMultiplier = 1
            gameData.upgradesBought = 0
            updateHTML()
        }, 5000)  
    }
}

function buyTrainingPerClick(){
    if (gameData.training >= gameData.trainingPerClickCost){
        gameData.training -= gameData.trainingPerClickCost
        if (powerTrainCooldown == true){
            gameData.upgradesBought += 1
        }
        gameData.trainingPerClick *= 1.2
        gameData.trainingPerClickCost = (gameData.trainingPerClickCost * 2)
        updateHTML()
    }
}

function idleStudy(){
    if (gameData.studyPoints > 0){
        gameData.trainingPerClick *= gameData.idleUpgradeMultiplier
        mainGameLoop = window.setInterval(function (){
           train();
        }, gameData.updateSpeed)
        gameData.studyPoints -= 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        document.getElementById("battlePowerPerSecond").hidden = false
        gameData.idle = true      
        updateHTML()
    }
    else if (gameData.idle == true){
        clearInterval(mainGameLoop)
        gameData.studyPoints += 1
        gameData.trainingPerClick /= gameData.idleUpgradeMultiplier
        document.getElementById("battlePowerPerSecond").hidden = true
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        gameData.idle = false
    }
    else if (gameData.active == true && powerTrainCooldown == false){
        gameData.active = false
        gameData.idle = true
        gameData.trainingPerClick *= gameData.idleUpgradeMultiplier
        mainGameLoop = window.setInterval(function (){
            train();
        }, gameData.updateSpeed)
        document.getElementById("powerTrainButton").hidden = true
        document.getElementById("battlePowerPerSecond").hidden = false
        updateHTML()
    }
}

function activeStudy(){
    if (gameData.studyPoints > 0){
        gameData.studyPoints -= 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        document.getElementById("battlePowerPerSecond").innerHTML = "Click Power Train to earn " + gameData.powerTrainPower * gameData.powerTrainUpgradeMultiplier * gameData.powerTrainSpeed + "x your training per second for 5 seconds!"
        document.getElementById("battlePowerPerSecond").hidden = false
        gameData.active = true
        document.getElementById("powerTrainButton").hidden = false
    }
    else if (gameData.active == true && powerTrainCooldown == false){
        gameData.studyPoints += 1
        document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
        gameData.active = false
        document.getElementById("battlePowerPerSecond").hidden = true
        document.getElementById("powerTrainButton").hidden = true
    }
    else if (gameData.idle == true){
        clearInterval(mainGameLoop)
        gameData.idle = false
        gameData.active = true
        gameData.trainingPerClick /= gameData.idleUpgradeMultiplier
        document.getElementById("powerTrainButton").hidden = false
        updateHTML()
    }
}
   
function lowerUpdateSpeed(){
    if (gameData.training >= gameData.updateSpeedCost){
        gameData.powerTrainUpdateMultiplier /= 1.05
        gameData.training -= gameData.updateSpeedCost
        gameData.updateSpeed /= 1.05
        gameData.updateSpeedCost *= 10
        updateHTML()
        if (gameData.idle == true){
            resetUpdateSpeed()        
        }
    }
}

function buyAP(){
    if (gameData.training >= gameData.buyAPCost && powerTrainCooldown == false){
        gameData.training -= gameData.buyAPCost
        gameData.availableAP += 1
        gameData.totalAP += 1
        gameData.buyAPCost *= 2
        gameData.updateSpeed = 100
        gameData.updateSpeedCost = 100
        if (gameData.idle == true && gameData.idleUpgradeMultiplier > 1){
            gameData.trainingPerClick = gameData.idleUpgradeMultiplier
        }
        else {
            gameData.trainingPerClick = 1
        }
        gameData.trainingPerClickCost = 2
        gameData.training = 0
        if(gameData.idle == true){
            resetUpdateSpeed()  
        }
        updateHTML()
    }
}

var mainGameLoop = null
function resetUpdateSpeed(){
    if (mainGameLoop !== null){
        clearInterval(mainGameLoop)
    }
    mainGameLoop = window.setInterval(function (){
        train();
    }, gameData.updateSpeed)
}

function buyAutoUpgrade(){
    if (gameData.availableAP > 0){  
        gameData.availableAP -= 1
        gameData.autoUpgrade = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("buyAutoUpgradeButton").hidden
    }
}

function buySuperIdle(){
    if (gameData.availableAP > 0){   
        gameData.availableAP -= 1
        if (gameData.idle == true){
            idleStudy()
        }
        if (gameData.idleUpgradeMultiplier == 1){
            gameData.idleUpgradeMultiplier = 5
        }
        else {
            gameData.idleUpgradeMultiplier += 5
        }
        idleStudy()
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
    }
}

function buySuperPowerTrain(){
    if (gameData.availableAP > 0){    
        gameData.availableAP -= 1
        if (gameData.powerTrainUpgradeMultiplier == 1){
            gameData.powerTrainUpgradeMultiplier = 5
        }
        else {
            gameData.powerTrainUpgradeMultiplier += 5
        }
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
    }
}

//TODO Learn error message display AND/OR find solution to power train loading issue
function loadGame(){
    if (gameData.idle == true){
        idleStudy()
    }
    var savegame = JSON.parse(localStorage.getItem("IdleBattleSave"))
    if (savegame !== null && powerTrainCooldown == false){
        gameData = savegame
        if (gameData.active == true){
            activeStudy()
        }
        else if (gameData.idle == true){
            idleStudy()
        }
        document.getElementById("powerTrainButton").hidden = true
        document.getElementById("currentTrainingPoints").hidden = true
        document.getElementById("availableStudyPoints").innerHTML = "Loading..."
        setTimeout(function(){
            updateHTML()
            document.getElementById("currentTrainingPoints").hidden = false
        }, 1000)
    }
    else if (gameData.powerTrainCooldown == true){

    }
}

function saveGame(){
    localStorage.setItem("IdleBattleSave", JSON.stringify(gameData))
}

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateHTML(){
    var trainingShown = Number(gameData.training).toFixed(0)
    var trainingPerSecondShown = Number(gameData.trainingPerClick * 1000 / gameData.updateSpeed).toFixed(2)
    var costOfAPShown = Number(gameData.buyAPCost)
    var updateSpeedShown = Number(1000 / gameData.updateSpeed).toFixed(2)
    var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
    if (gameData.active == true){
        if (powerTrainCooldown == true){
            document.getElementById("battlePowerPerSecond").innerHTML = "POWER TRAIN ACTIVE: " + trainingPerSecondShown + " Training Points per second!"         
        }
        else{
            document.getElementById("battlePowerPerSecond").innerHTML = "Click Power Train to earn " + gameData.powerTrainPower * gameData.powerTrainUpgradeMultiplier * gameData.powerTrainSpeed + "x your training per second for 5 seconds!"
        }
    }
    else if (gameData.idle == true){
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second"
    }
    else{        
        document.getElementById("battlePowerPerSecond").innerHTML = "0 Training Points per second"
    }
    document.getElementById("currentTrainingPoints").innerHTML = numberWithCommas(trainingShown) + " Training Points"
    document.getElementById("textAPTotal").innerHTML = "AP Total: " + numberWithCommas(gameData.totalAP)
    document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
    document.getElementById("availableStudyPoints").innerHTML = "Study Points: " + gameData.studyPoints + "/" + gameData.maxStudyPoints
    document.getElementById("buyAPButton").innerHTML = "Buy 1 AP (Attribute Point) Cost: " + numberWithCommas(costOfAPShown) + " Training Points" 
    document.getElementById("perSpeedUpdate").innerHTML = "Increase Update Speed (" + numberWithCommas(updateSpeedShown) + " ticks per second) Cost: " + numberWithCommas(gameData.updateSpeedCost) + " Training Points"
    document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) Cost: " + numberWithCommas(gameData.trainingPerClickCost) + " Training Points"
}

var options = {
    useEasing : false, 
    useGrouping : true, 
    separator : ',', 
    decimal : '.', 
    prefix: '',
    suffix: ' Training Points'
};

function createEnemy(name, hitPoints, attackPoints, defensePoints, speedPoints, imagePath) {
    var enemy = {
        name : name,
        hitPoints : hitPoints,
        attackPoints : attackPoints,
        defensePoints : defensePoints,
        speedPoints : speedPoints,
        inventory : [],
        imagePath : imagePath
    }
    enemyList[enemyList.length] = enemy
    return enemy;
}

