var gameData = {
    name: "",
    attackPoints: 0,
    defensePoints: 0,
    hitPoints: 0,
    maxHitPoints: 0,
    speedPoints: 0,
    inventory: [],
    equipment: [],
    training: 0,
    trainingPerClick: 1,
    trainingPerClickCost: 50,
    updateSpeed: 100,
    availableAP: 0,
    totalAP: 0,
    buyAPCost: 50000,
    statPointCost: 1000,
    statPoints: 0,
    maxStatPoints: 0,
    allocatedHP: 0,
    allocatedAtt: 0,
    allocatedDef: 0,
    allocatedSpe: 0,
    currentProgressHP: 0,
    currentProgressAtt: 0,
    currentProgressDef: 0,
    currentProgressSpe: 0,
    upgradesBought: 0,
    powerTrainUpgradeMultiplier: 1,
    trainingPointBoostCost: 5,
    idleUpgradeMultiplier: 1,
    statPointBoostCost: 5,
    statPointUpgradeMultiplier: 1,
    autoUpgrade: false,
    autoPurchaseAP: false,
    autoPurchaseStatPoints: false,
    enemyList: [],
    allItems: []
}

function update(){
    var numberAnimation = new CountUp("currentTrainingPoints", gameData.training, gameData.training + gameData.trainingPerClick, 0, (gameData.updateSpeed / 1000), options);
    numberAnimation.start()
    gameData.training += gameData.trainingPerClick * gameData.idleUpgradeMultiplier
    if (gameData.training >= gameData.statPointCost && gameData.autoPurchaseStatPoints == true){
        buyStatPoint()
    }
    if (gameData.training >= gameData.buyAPCost && gameData.autoPurchaseAP == true){
        buyAP()
    }
    if (gameData.training >= gameData.trainingPerClickCost && gameData.autoUpgrade == true){
        buyTrainingPerClick()
    }
    statGain()
}

function statGain(){
    if (gameData.allocatedHP > 0){        
        if (document.getElementById("progressBarHP").value >= 10000){
            document.getElementById("progressBarHP").value = 0
            document.getElementById("progressBarHP").max = 10000 * (1.05**gameData.maxHitPoints)
            gameData.maxHitPoints += 1 * gameData.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarHP").value += 5 * gameData.allocatedHP
        gameData.currentProgressHP = document.getElementById("progressBarHP").value
    }
    if (gameData.allocatedAtt > 0){        
        if (document.getElementById("progressBarAttack").value >= 10000){
            document.getElementById("progressBarAttack").value = 0
            document.getElementById("progressBarAttack").max = 10000 * (1.25**gameData.attackPoints)
            gameData.attackPoints += 1 * gameData.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarAttack").value += 5 * gameData.allocatedAtt
        gameData.currentProgressAtt = document.getElementById("progressBarAttack").value
    }
    if (gameData.allocatedDef > 0){        
        if (document.getElementById("progressBarDefense").value >= 10000){
            document.getElementById("progressBarDefense").value = 0
            document.getElementById("progressBarDefense").max = 10000 * (1.25**gameData.defensePoints)
            gameData.defensePoints += 1 * gameData.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarDefense").value += 5 * gameData.allocatedDef
        gameData.currentProgressDef = document.getElementById("progressBarDefense").value
    }
    if (gameData.allocatedSpe > 0){        
        if (document.getElementById("progressBarSpeed").value >= 10000){
            document.getElementById("progressBarSpeed").value = 0
            document.getElementById("progressBarSpeed").max = 10000 * (1.25**gameData.speedPoints)
            gameData.speedPoints += 1 * gameData.statPointUpgradeMultiplier
            updateHTML()
        }        
        document.getElementById("progressBarSpeed").value += 5 * gameData.allocatedSpe
        gameData.currentProgressSpe = document.getElementById("progressBarSpeed").value
    }
}

function allocateHP(increase){
    if (gameData.statPoints > 0 && increase){
        gameData.statPoints -= 1
        gameData.allocatedHP += 1
    }
    else if (gameData.allocatedHP > 0 && !increase){
        gameData.statPoints += 1
        gameData.allocatedHP -= 1
    }
    updateHTML()
}

function allocateAttack(increase){
    if (gameData.statPoints > 0 && increase){
        gameData.statPoints -= 1
        gameData.allocatedAtt += 1
    }
    else if (gameData.allocatedAtt > 0 && !increase){
        gameData.statPoints += 1
        gameData.allocatedAtt -= 1
    }
    updateHTML()
}

function allocateDefense(increase){
    if (gameData.statPoints > 0 && increase){
        gameData.statPoints -= 1
        gameData.allocatedDef += 1
    }
    else if (gameData.allocatedDef > 0 && !increase){
        gameData.statPoints += 1
        gameData.allocatedDef -= 1
    }
    updateHTML()
}

function allocateSpeed(increase){
    if (gameData.statPoints > 0 && increase){
        gameData.statPoints -= 1
        gameData.allocatedSpe += 1
    }
    else if (gameData.allocatedSpe > 0 && !increase){
        gameData.statPoints += 1
        gameData.allocatedSpe -= 1
    }
    updateHTML()
}

var powerTrainCooldown = false;
function powerTrain(){
    if (powerTrainCooldown == false){
        var originalTrainingPerClick = gameData.trainingPerClick
        gameData.trainingPerClick *= gameData.powerTrainUpgradeMultiplier
        powerTrainCooldown = true
        mainGameLoop = window.setInterval(function (){
            update();
        }, gameData.updateSpeed);
        updateHTML()
        document.getElementById("powerTrainButton").disabled = true
        document.getElementById("powerTrainButton").style = "background-color: #474646; color: #373636"
        var trainingPerSecondShown = Number(gameData.trainingPerClick * 2000 / gameData.updateSpeed).toFixed(2)
        var timeLeft = 5
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second for " + timeLeft + " seconds!"   
        var countdown = setInterval(function(){
            if (timeLeft == 1){
                clearInterval(countdown)
            }
            else{
                timeLeft -= 1
                document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second for " + timeLeft + " seconds!"   
            }
        }, 1000)
        setTimeout(function(){ 
            if (gameData.upgradesBought > 0){
                gameData.trainingPerClick = originalTrainingPerClick * (1.5)**gameData.upgradesBought
            }
            else {
                gameData.trainingPerClick = originalTrainingPerClick
            }
            clearInterval(mainGameLoop)
            powerTrainCooldown = false
            gameData.upgradesBought = 0
            document.getElementById("powerTrainButton").innerHTML = "Power Train"
            document.getElementById("powerTrainButton").disabled = false
            document.getElementById("powerTrainButton").style = "background-color: rgb(6, 128, 128); color: black"
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
        gameData.trainingPerClick *= 1.5
        gameData.trainingPerClickCost = (gameData.trainingPerClickCost * 2)
        updateHTML()
    }
}

function buyStatPoint(){
    if (gameData.training >= gameData.statPointCost){
        gameData.training -= gameData.statPointCost
        gameData.statPoints += 1
        gameData.maxStatPoints += 1
        gameData.statPointCost *= 5
        updateHTML()
    }
}

function buyAP(){
    if (gameData.training >= gameData.buyAPCost && powerTrainCooldown == false){
        gameData.training -= gameData.buyAPCost
        gameData.availableAP += 1
        gameData.totalAP += 1
        gameData.buyAPCost *= 1.2
        gameData.updateSpeed = 100
        gameData.updateSpeedCost = 1000
        if (gameData.idle == true && gameData.idleUpgradeMultiplier > 1){
            gameData.trainingPerClick = gameData.idleUpgradeMultiplier
        }
        else {
            gameData.trainingPerClick = 1
        }
        gameData.trainingPerClickCost = 20
        gameData.training = 0
        resetUpdateSpeed()  
        updateHTML()
    }
}

function buyAutoUpgrade(){
    if (gameData.availableAP > 9 && gameData.autoUpgrade == false){  
        gameData.availableAP -= 10
        gameData.autoUpgrade = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Purchased"
        document.getElementById("toggleAutoUpgradeButton").hidden = false
    }
}

function buyAutoPurchaseAP(){
    if (gameData.availableAP > 9 && gameData.autoPurchaseAP == false){
        gameData.availableAP -= 10
        gameData.autoPurchaseAP = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase AP Purchased"
        document.getElementById("toggleAutoPurchaseAPButton").hidden = false
    }
}

function buyAutoPurchaseStatPoints(){
    if (gameData.availableAP > 9 && gameData.autoPurchaseStatPoints == false){
        gameData.availableAP -= 10
        gameData.autoPurchaseStatPoints = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("buyAutoPurchaseStatPointsButton").innerHTML = "Auto Purchase Stat Points Purchased"
        document.getElementById("toggleAutoPurchaseStatPointsButton").hidden = false
    }
}

var mainGameLoop = null
function resetUpdateSpeed(){
    if (mainGameLoop !== null){
        clearInterval(mainGameLoop)
    }
    mainGameLoop = window.setInterval(function (){
        update();
    }, gameData.updateSpeed)
}
resetUpdateSpeed()


function toggleAutoUpgrade(){
    if (gameData.autoUpgrade == false){
        gameData.autoUpgrade = true
        document.getElementById("toggleAutoUpgradeButton").innerHTML = "Auto Upgrade: ON"
    }
    else if (gameData.autoUpgrade == true){
        gameData.autoUpgrade = false
        document.getElementById("toggleAutoUpgradeButton").innerHTML = "Auto Upgrade: OFF"
    }
}

function toggleAutoPurchaseAP(){
    if (gameData.autoPurchaseAP == false){
        gameData.autoPurchaseAP = true
        document.getElementById("toggleAutoPurchaseAPButton").innerHTML = "Auto Buy AP: ON"
    }
    else if (gameData.autoPurchaseAP == true){
        gameData.autoPurchaseAP = false
        document.getElementById("toggleAutoPurchaseAPButton").innerHTML = "Auto Buy AP: OFF"
    }
}

function toggleAutoPurchaseStatPoints(){
    if (gameData.autoPurchaseStatPoints == false){
        gameData.autoPurchaseStatPoints = true
        document.getElementById("toggleAutoPurchaseStatPointsButton").innerHTML = "Auto Buy SP: ON"
    }
    else if (gameData.autoPurchaseStatPoints == true){
        gameData.autoPurchaseStatPoints = false
        document.getElementById("toggleAutoPurchaseStatPointsButton").innerHTML = "Auto Buy SP: OFF"
    }
}

function buyStatPointBoost(){
    if (gameData.availableAP > gameData.statPointBoostCost){   
        gameData.availableAP -= gameData.statPointBoostCost
        gameData.statPointBoostCost *= 2
        gameData.statPointUpgradeMultiplier += 1
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("statPointBoostCurrent").innerHTML = "Current Stat Point Multiplier: " + numberWithCommas(gameData.statPointUpgradeMultiplier)
        document.getElementById("buyStatPointBoostButton").innerHTML = "+1 Stat Point per Bar: " + gameData.statPointBoostCost + " AP"
    }
}

function buyTrainingPointBoost(){
    if (gameData.availableAP > gameData.trainingPointBoostCost){   
        gameData.availableAP -= gameData.trainingPointBoostCost
        gameData.trainingPointBoostCost *= 2
        gameData.idleUpgradeMultiplier += 1
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("trainingPointBoostCurrent").innerHTML = "Current Training Point Multiplier: " + numberWithCommas(gameData.idleUpgradeMultiplier)
        document.getElementById("buyTrainingPointBoostButton").innerHTML = "+1x Training Point Speed: " + gameData.trainingPointBoostCost + " AP"
        updateHTML()
    }
}

/* Currently defunct but may be brought back later

function buySuperPowerTrain(){
    if (gameData.availableAP > 0){    
        gameData.availableAP -= 1
        if (gameData.powerTrainUpgradeMultiplier == 1){
            gameData.powerTrainUpgradeMultiplier = 2
        }
        else {
            gameData.powerTrainUpgradeMultiplier += 2
        }
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
        document.getElementById("superPowerTrainCurrent").innerHTML = "Current Power Train Multiplier: " + numberWithCommas(gameData.powerTrainUpgradeMultiplier)
    }
}*/

//TODO Learn error message display AND/OR find solution to power train loading issue
function loadGame(){
    clearInterval(mainGameLoop)
    var savegame = JSON.parse(localStorage.getItem("IdleBattleSave"))
    if (savegame !== null && powerTrainCooldown == false){
        gameData = savegame
        document.getElementById("trainingTab").style.display = 'none'
        document.getElementById("battleTab").style.display = 'none'
        document.getElementById("shopTab").style.display = 'none'
        document.getElementById("loadingText").hidden = false
        setTimeout(function(){
            updateHTML()
            document.getElementById("progressBarHP").value = gameData.currentProgressHP
            document.getElementById("progressBarAttack").value = gameData.currentProgressAtt
            document.getElementById("progressBarDefense").value = gameData.currentProgressDef
            document.getElementById("progressBarSpeed").value = gameData.currentProgressSpe
            document.getElementById("trainingTab").hidden = false
            document.getElementById("battleTab").hidden = false
            document.getElementById("shopTab").hidden = false
            document.getElementById("loadingText").hidden = true
            if (gameData.autoUpgrade == true){
                document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Purchased"
                document.getElementById("toggleAutoUpgradeButton").hidden = false
            }
            if (gameData.autoPurchaseAP == true){
                document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase AP Purchased"
                document.getElementById("toggleAutoPurchaseAPButton").hidden = false
            }
            if (gameData.autoPurchaseStatPoints == true){
                document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase Stat Points Purchased"
                document.getElementById("toggleAutoPurchaseStatPointsButton").hidden = false    
            }
            resetUpdateSpeed()
            document.getElementById("trainingTab").style.display = 'block'
        }, 1000)
    }
    else if (gameData.powerTrainCooldown == true){

    }
}

//TODO Learn error message display AND/OR find solution to power train saving issue
function saveGame(){
    if (powerTrainCooldown == false){
        localStorage.setItem("IdleBattleSave", JSON.stringify(gameData))
    }
}

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateHTML(){
    var trainingShown = Number(gameData.training).toFixed(0)
    var trainingPerSecondShown = Number(gameData.trainingPerClick * gameData.idleUpgradeMultiplier * 1000 / gameData.updateSpeed).toFixed(2)
    var costOfAPShown = Number(gameData.buyAPCost).toFixed(0)
    var statPointCostShown = Number(gameData.statPointCost).toFixed(0)
    var trainingLevelShown = Number(gameData.trainingPerClick).toFixed(2)
    document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second!"   
    if (gameData.autoPurchaseAP == false){
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Buy AutoPurchase for AP: 10 AP"
    }
    if (gameData.autoUpgrade == false){
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Buy Auto Upgrade: 10 AP"
    }
    document.getElementById("currentTrainingPoints").innerHTML = numberWithCommas(trainingShown)
    document.getElementById("textAPTotal").innerHTML = "AP Total: " + numberWithCommas(gameData.totalAP)
    document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(gameData.availableAP)
    document.getElementById("buyAPButton").innerHTML = "Buy 1 AP (Attribute Point) for " + numberWithCommas(costOfAPShown) + " Training Points" 
    document.getElementById("buyStatPointButton").innerHTML = "Buy Stat Point for " + numberWithCommas(statPointCostShown) + " Training Points"
    document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level (" + numberWithCommas(trainingLevelShown) + " per tick) for " + numberWithCommas(gameData.trainingPerClickCost) + " Training Points"
    document.getElementById("statPointsDisplay").innerHTML = gameData.statPoints + "/" + gameData.maxStatPoints
    document.getElementById("currentHPStat").innerHTML = gameData.maxHitPoints + " HP"
    document.getElementById("currentAttackStat").innerHTML = gameData.attackPoints + " Attack"
    document.getElementById("currentDefenseStat").innerHTML = gameData.defensePoints + " Defense"
    document.getElementById("currentSpeedStat").innerHTML = gameData.speedPoints + " Speed"
    document.getElementById("statPointsOnHP").innerHTML = gameData.allocatedHP
    document.getElementById("statPointsOnAttack").innerHTML = gameData.allocatedAtt
    document.getElementById("statPointsOnDefense").innerHTML = gameData.allocatedDef
    document.getElementById("statPointsOnSpeed").innerHTML = gameData.allocatedSpe
}

var options = {
    useEasing: false, 
    useGrouping: true, 
    separator: ',', 
    decimal: '.', 
    prefix: '',
};

function createEnemy(ID, name, hitPoints, attackPoints, defensePoints, speedPoints, imagePath) {
    var enemy = {
        ID: ID,
        name: name,
        hitPoints: hitPoints,
        attackPoints: attackPoints,
        defensePoints: defensePoints,
        speedPoints: speedPoints,
        inventory: [],
        imagePath: imagePath
    }
    gameData.enemyList[gameData.enemyList.length] = enemy
    document.getElementById("enemy" + enemy.ID).src = enemy.imagePath
    document.getElementById("enemyName" + enemy.ID).innerHTML = enemy.name
    return enemy;
}

function createItem(name, ID, fire, air, earth, water, melee, fireDefense, airDefense, earthDefense, waterDefense, meleeDefense, heal, oncePerBattle, freeze, imagePath){
    var item = {
        name: name,
        ID: ID,
        fire: fire,
        earth: earth,
        air: air,
        water: water,
        melee: melee,
        fireDefense: fireDefense,
        airDefense: airDefense,
        earthDefense: earthDefense,
        waterDefense: waterDefense,
        meleeDefense: meleeDefense,
        heal: heal,
        oncePerBattle: oncePerBattle,
        freeze: freeze,
        imagePath: imagePath
    }
    gameData.allItems[item.ID] = item
    document.getElementById("testWeapon" + item.ID).src = item.imagePath
    document.getElementById("testWeaponClick" + item.ID).onclick = function(){setSelected(item.ID)}
    document.getElementById("testWeaponCaption" + item.ID).innerHTML = item.name
    return item;
}

createEnemy(0, "Snek", 10, 1, 1, 1, "/images/enemies/pipo-enemy003b.png")
createEnemy(1, "Sloim", 10, 1, 1, 1, "/images/enemies/pipo-enemy009b.png")
createItem("Training Sword", 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false, true, "/images/weapons/04 - Steel sword.png")
createItem("Sword of Otherness", 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false, true, "/images/weapons/08 - Red copper sword.png")
createItem("Fourth Sword", 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, false, true, "/images/weapons/29 - Occult sword variant 1.png")


function printSuccess(){
    console.log("Success!")
}

function setSelected(ID){
    var isEquipped = false
    if (gameData.equipment.includes(gameData.allItems[ID])){
        isEquipped = true
        var index = gameData.equipment.indexOf(gameData.allItems[ID])
        gameData.equipment.splice(index, 1)
        document.getElementById("testWeapon" + ID).style.border=""
    }
    if (!isEquipped){
        gameData.equipment.push(gameData.allItems[ID])
        document.getElementById("testWeapon" + ID).style.border="1px solid white"
    }
    reloadInventoryDisplay()
}

function reloadInventoryDisplay(){
    for (var i = 0; i < 8; i++){
        if (gameData.equipment[i] != null){ 
            document.getElementById("table" + i).src = gameData.equipment[i].imagePath
            document.getElementById("equipmentName" + i).innerHTML = gameData.equipment[i].name       
        }
        else {
            document.getElementById("table" + i).src = "/images/weapons/emptyEquipmentSlot.png"
            document.getElementById("equipmentName" + i).innerHTML = " "      
        }
    }
}