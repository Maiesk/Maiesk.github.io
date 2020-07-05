var player = {
    name: "Player",
    imagePath: "/images/enemies/pipo-player001.png",
    attackPoints: 1,
    defensePoints: 1,
    hitPoints: 11,
    maxHitPoints: 11,
    speedPoints: 1,
    inventory: [],
    equipment: [],
    training: 0,
    trainingPerClick: 1,
    trainingPerClickCost: 50,
    updateSpeed: 100,
    availableAP: 0,
    totalAP: 0,
    gold: 2,
    exp: 0,
    level: 1,
    buyAPCost: 50000,
    statPointCost: 0,
    levelUpCost: 50,
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
    currentMaxHP: 100,
    currentMaxAtt: 100,
    currentMaxDef: 100,
    currentMaxSpe: 100, 
    progressDivider: 1,
    upgradesBought: 0,
    powerTrainUpgradeMultiplier: 1,
    trainingPointBoostCost: 1,
    idleUpgradeMultiplier: 1,
    statPointBoostCost: 5,
    statPointUpgradeMultiplier: 1,
    autoUpgrade: false,
    autoPurchaseAP: false,
    autoPurchaseStatPoints: false,
    frozen: false,
    currentStance: "Steady",
    enemySaveList: [],
    secretEnemySaveList: [],
    allItems: [],
    secretItems: [],
    goldGeneratorLevel: 0,
    goldGeneratorUpgradeCost: 1,
    currentZone: 1,
    zoneMax: 1,
    zones: [],
    boughtFirstAP: false,
    goldGeneratorMulti: 1,
    goldGeneratorMultiUpgradeCost: 5,
    imagePathList: ["/images/enemies/pipo-player001.png","/images/enemies/pipo-player002.png"]
}

var enemyList = []
var defaultEnemyList = []
var secretEnemyList = []

function setName(){
    var name = document.getElementById("playerNameBox").value
    if (name.length < 20){
        player.name = name
    }
    document.getElementById("playerNameDisplay").innerHTML = player.name
}

function updateAvatarGrid(){
    document.getElementById("avatarGridPageOne").innerHTML = ""
    document.getElementById("avatarGridPageTwo").innerHTML = ""
    for (var i = 0; i < player.imagePathList.length; i++){
        var cell = document.createElement("div")
        var image = document.createElement("img")
        cell.style = "width: 75px; height: 75px"
        image.src = player.imagePathList[i]
        image.id = "avatarImage" + i
        image.style = "width: 75px; height: 75px"
        cell.appendChild(image)
        if (i < 15){
            document.getElementById("avatarGridPageOne").appendChild(cell)
        }
        else{
            document.getElementById("avatarGridPageTwo").appendChild(cell)
        }
        setAvatarClickable(i)
    }
}

function setAvatarClickable(index){
    document.getElementById("avatarImage" + index).onclick = function(){setPlayerImage(index)}
}

function setPlayerImage(index){
    player.imagePath = player.imagePathList[index]
    document.getElementById("playerImage").src = player.imagePath
    placeOnGrid()
}

var goldGeneratorTicks = 0
function update(){
    var numberAnimation = new CountUp("currentTrainingPoints", player.training, player.training + player.trainingPerClick, 0, (player.updateSpeed / 1000), options);
    numberAnimation.start()
    player.training += player.trainingPerClick * player.idleUpgradeMultiplier
    if (player.training >= player.statPointCost && player.autoPurchaseStatPoints == true){
        buyStatPoint()
    }
    if (player.training >= player.buyAPCost && player.autoPurchaseAP == true){
        buyAP()
    }
    if (player.training >= player.trainingPerClickCost && player.autoUpgrade == true){
        buyTrainingPerClick()
    }
    updateHPBar()
    updateAttBar()
    updateDefBar()
    updateSpeBar()
    goldGeneratorTicks += (player.goldGeneratorLevel) * 10
    if (goldGeneratorTicks >= 100){
        goldGeneratorTicks = 0
        player.gold += 1 * player.goldGeneratorMulti
        displayGold()
    }
    if (player.boughtFirstAP){
        updateBuyAPButton()
    }
}

function updateHPBar() {
    if (player.allocatedHP > 0 && player.level > (player.maxHitPoints / 20)){  
        var elementHP = document.getElementById("myprogressBarHP"); 
        var intervalHP = setInterval(sceneHP, 15); 
        function sceneHP() { 
            if (player.currentProgressHP >= 100) { 
                clearInterval(intervalHP); 
                player.currentProgressHP = 0
                elementHP.style.width = 0
                if (player.maxHitPoints % 2 == 0){
                    elementHP.style = "background: linear-gradient(to right, #ac9444, #94b0da 200px);"
                }
                else{
                    elementHP.style = "background: linear-gradient(to right, #94b0da, #ac9444 200px);"
                }
                player.maxHitPoints += player.statPointUpgradeMultiplier
                player.secretItems[0].heal = Math.round(player.maxHitPoints / 10)
                player.secretItems[11].heal = Math.round(player.maxHitPoints / 20)
                player.secretItems[12].heal = Math.round(player.maxHitPoints / 20)
                player.secretItems[13].heal = player.maxHitPoints
                player.currentMaxHP = 100 * (1.05**Math.sqrt(player.maxHitPoints - 10)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
                updateHTML()
            } 
            else { 
                if (player.allocatedHP > 0){
                    var percentageHP =  player.allocatedHP / 4 / (player.currentMaxHP / 100)
                    if (player.currentProgressHP + percentageHP > 100){
                        player.currentProgressHP = 100
                    }
                    else{
                        player.currentProgressHP += percentageHP
                    }                    
                    elementHP.style.width = player.currentProgressHP + '%';  
                    var percentShown = Number(player.currentProgressHP).toFixed(2)
                    document.getElementById("currentProgressDisplayHP").innerHTML = percentShown + "%"
                    clearInterval(intervalHP)
                }
                else{
                    clearInterval(intervalHP)
                }
            } 
        } 
    }
} 

function updateAttBar() {
    if (player.allocatedAtt > 0 && player.level > (player.attackPoints / 10)){  
        var elementAtt = document.getElementById("myprogressBarAtt"); 
        var intervalAtt = setInterval(sceneAtt, 15); 
        function sceneAtt() { 
            if (player.currentProgressAtt >= 100) { 
                clearInterval(intervalAtt); 
                player.currentProgressAtt = 100
                var percentShown = Number(player.currentProgressAtt).toFixed(2)
                document.getElementById("currentProgressDisplayAtt").innerHTML = percentShown + "%"
                player.currentProgressAtt = 0
                if (player.attackPoints % 2 == 0){
                    elementAtt.style = "background: linear-gradient(to right, #ac9444, #94b0da 200px);"
                }
                else{
                    elementAtt.style = "background: linear-gradient(to right, #94b0da, #ac9444 200px);"
                }
                player.attackPoints += player.statPointUpgradeMultiplier
                if (player.level == player.attackPoints / 10){
                    elementAtt.style.width = 100
                }
                player.currentMaxAtt = 100 * (1.05**Math.sqrt(player.attackPoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
                updateHTML()
            } 
            else { 
                if (player.allocatedAtt > 0){
                    var percentageAtt =  player.allocatedAtt / 4 / (player.currentMaxAtt / 100)
                    if (player.currentProgressAtt + percentageAtt > 100){
                        player.currentProgressAtt = 100
                    }
                    else{
                        player.currentProgressAtt += percentageAtt
                    }                   
                    elementAtt.style.width = player.currentProgressAtt + '%';  
                    var percentShown = Number(player.currentProgressAtt).toFixed(2)
                    document.getElementById("currentProgressDisplayAtt").innerHTML = percentShown + "%"
                    clearInterval(intervalAtt)
                }
                else{
                    clearInterval(intervalAtt)
                }
            } 
        } 
    }
} 

function updateDefBar() {
    if (player.allocatedDef > 0 && player.level > (player.defensePoints / 10)){  
        var elementDef = document.getElementById("myprogressBarDef"); 
        var intervalDef = setInterval(scene2, 15); 
        function scene2() { 
            if (player.currentProgressDef >= 100) { 
                clearInterval(intervalDef); 
                player.currentProgressDef = 0
                elementDef.style.width = 0
                if (player.defensePoints % 2 == 0){
                    elementDef.style = "background: linear-gradient(to right, #ac9444, #94b0da 200px);"
                }
                else{
                    elementDef.style = "background: linear-gradient(to right, #94b0da, #ac9444 200px);"
                }
                player.defensePoints += player.statPointUpgradeMultiplier
                player.currentMaxDef = 100 * (1.05**Math.sqrt(player.defensePoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
                updateHTML()
            } 
            else { 
                if (player.allocatedDef > 0){
                    var percentageDef = player.allocatedDef / 4 / (player.currentMaxDef / 100)
                    if (player.currentProgressDef + percentageDef > 100){
                        player.currentProgressDef = 100
                    }
                    else{
                        player.currentProgressDef += percentageDef
                    }
                    elementDef.style.width = player.currentProgressDef + '%';  
                    var percentShown = Number(player.currentProgressDef).toFixed(2)
                    document.getElementById("currentProgressDisplayDef").innerHTML = percentShown + "%"
                    clearInterval(intervalDef)
                }
                else{
                    clearInterval(intervalDef)
                }
            } 
        } 
    }
} 

function updateSpeBar() {
    if (player.allocatedSpe > 0 && player.level > (player.speedPoints / 10)){  
        var elementSpe = document.getElementById("myprogressBarSpe"); 
        var intervalSpe = setInterval(scene2, 15); 
        function scene2() { 
            if (player.currentProgressSpe >= 100) { 
                clearInterval(intervalSpe); 
                player.currentProgressSpe = 0
                elementSpe.style.width = 0
                if (player.speedPoints % 2 == 0){
                    elementSpe.style = "background: linear-gradient(to right, #ac9444, #94b0da 200px);"
                }
                else{
                    elementSpe.style = "background: linear-gradient(to right, #94b0da, #ac9444 200px);"
                }
                player.speedPoints += player.statPointUpgradeMultiplier
                player.currentMaxSpe = 100 * (1.05**Math.sqrt(player.speedPoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
                updateHTML()
            } 
            else { 
                if (player.allocatedSpe > 0){
                    var percentageSpe =  player.allocatedSpe / 4 / (player.currentMaxSpe / 100)
                    if (player.currentProgressSpe + percentageSpe > 100){
                        player.currentProgressSpe = 100
                    }
                    else{
                        player.currentProgressSpe += percentageSpe;  
                    }
                    elementSpe.style.width = player.currentProgressSpe + '%';  
                    var percentShown = Number(player.currentProgressSpe).toFixed(2)
                    document.getElementById("currentProgressDisplaySpe").innerHTML = percentShown + "%"
                    clearInterval(intervalSpe)
                }
                else{
                    clearInterval(intervalSpe)
                }
            } 
        } 
    }
} 

function allocateHP(increase, amount){
    if (player.statPoints > 0 && increase){
        player.statPoints -= amount
        player.allocatedHP += amount
    }
    else if (player.allocatedHP > 0 && !increase){
        player.statPoints += amount
        player.allocatedHP -= amount
    }
    updateStatButtonHTML()
}

function allocateAttack(increase, amount){
    if (player.statPoints > 0 && increase){
        player.statPoints -= amount
        player.allocatedAtt += amount
    }
    else if (player.allocatedAtt > 0 && !increase){
        player.statPoints += amount
        player.allocatedAtt -= amount
    }
    updateStatButtonHTML()
}

function allocateDefense(increase, amount){
    if (player.statPoints > 0 && increase){
        player.statPoints -= amount
        player.allocatedDef += amount
    }
    else if (player.allocatedDef > 0 && !increase){
        player.statPoints += amount
        player.allocatedDef -= amount
    }
    updateStatButtonHTML()
}

function allocateSpeed(increase, amount){
    if (player.statPoints > 0 && increase){
        player.statPoints -= amount
        player.allocatedSpe += amount
    }
    else if (player.allocatedSpe > 0 && !increase){
        player.statPoints += amount
        player.allocatedSpe -= amount
    }
    updateStatButtonHTML()
}

var powerTrainCooldown = false;
function powerTrain(){
    if (powerTrainCooldown == false){
        var originalTrainingPerClick = player.trainingPerClick
        player.trainingPerClick *= 2
        player.goldGeneratorLevel *= 2
        powerTrainCooldown = true
        updateHTML()
        document.getElementById("powerTrainButton").disabled = true
        document.getElementById("powerTrainButton").style = "background-color: #474646; color: #373636; height: 75px; width: 300px; font-size: 40px"
        document.getElementById("buyAPButton").disabled = true
        document.getElementById("buyAPButton").className = "mainButtonLayoutDisabled"
        document.getElementById("saveButton").disabled = true
        document.getElementById("saveButton").className = "mainButtonLayoutDisabled"   
        document.getElementById("loadButton").disabled = true
        document.getElementById("loadButton").className = "mainButtonLayoutDisabled"
        var trainingPerSecondShown = Number(player.trainingPerClick * 1000 / player.updateSpeed * player.idleUpgradeMultiplier).toFixed(0)
        var timeLeft = 5
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second for " + timeLeft + " seconds!"   
        var countdown = setInterval(function(){
            if (timeLeft == 1){
                clearInterval(countdown)
            }
            else{
                timeLeft -= 1
                trainingPerSecondShown = Number(player.trainingPerClick * 1000 / player.updateSpeed * player.idleUpgradeMultiplier).toFixed(0)
                document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second for " + timeLeft + " seconds!"   
            }
        }, 1000)
        setTimeout(function(){
            if (player.upgradesBought > 0){
                player.trainingPerClick = originalTrainingPerClick * (1.5)**player.upgradesBought
            }
            else {
                player.trainingPerClick = originalTrainingPerClick
            }
            powerTrainCooldown = false
            player.goldGeneratorLevel /= 2
            player.upgradesBought = 0
            document.getElementById("buyAPButton").disabled = false
            document.getElementById("buyAPButton").className = "mainButtonLayout"
            document.getElementById("powerTrainButton").innerHTML = "Power Train"
            document.getElementById("powerTrainButton").disabled = false
            document.getElementById("powerTrainButton").style = "color: #ac9444; background-color: #335C81; height: 75px; width: 300px; font-size: 40px"    
            document.getElementById("saveButton").disabled = false
            document.getElementById("saveButton").className = "mainButtonLayout"
            document.getElementById("loadButton").disabled = false
            document.getElementById("loadButton").className = "mainButtonLayout"
            updateHTML()
        }, 5000)
    }
}


function buyTrainingPerClick(){
    if (player.training >= player.trainingPerClickCost){
        player.training -= player.trainingPerClickCost
        if (powerTrainCooldown == true){
            player.upgradesBought += 1
        }
        trainingPerSecondShown = Number(player.trainingPerClick * 2000 / player.updateSpeed).toFixed(2)
        player.trainingPerClick *= 1.5
        player.trainingPerClickCost = (player.trainingPerClickCost * 2)
        updateHTML()
    }
}

function fibonacci(index){
    if (index == 1 || index == 2){
        return 1
    }
    else{
        var result = 0
        var first = 1
        var second = 1
        for (var i = 2; i < index; i++){
            var result = first + second
            first = second
            second = result
        }
        return result
    }
}

function buyStatPoint(){
    if (player.training >= player.statPointCost){
        player.training -= player.statPointCost
        player.statPoints += 1
        player.maxStatPoints += 1
        player.statPointCost = fibonacci(player.maxStatPoints + 1) * 2000
        updateHTML()
        updateStatButtonHTML()
    }
}

function buyAP(){
    if (player.training >= player.buyAPCost && powerTrainCooldown == false){
        if (!player.boughtFirstAP){
            player.training -= player.buyAPCost
            player.availableAP += 1
            player.totalAP += 1
            player.buyAPCost *= 1.3
            player.boughtFirstAP = true
        }
        else{
            while (player.training > player.buyAPCost){
                player.training -= player.buyAPCost
                player.availableAP += 1
                player.totalAP += 1
                player.buyAPCost *= 1.3
            }
        }
        player.updateSpeed = 100
        player.updateSpeedCost = 1000
        if (player.idle == true && player.idleUpgradeMultiplier > 1){
            player.trainingPerClick = player.idleUpgradeMultiplier
        }
        else {
            player.trainingPerClick = 1
        }
        player.trainingPerClickCost = 20
        player.training = 0
        if (player.totalAP > 19){
            buyAutoUpgrade()
        }
        if (player.totalAP > 29){
            buyAutoPurchaseStatPoints()
        }
        if (player.totalAP > 39){
            buyAutoPurchaseAP()
        }
        updateHTML()
    }
}

function buyLevelUp(){
    if (player.exp >= player.levelUpCost){
        player.level += 1
        player.exp -= player.levelUpCost
        player.levelUpCost = Math.round(4 * ((player.level + 3)**3) / 5).toFixed(0)
        updateHTML()
    }
}

function buyAutoUpgrade(){
    if (player.autoUpgrade == false){  
        player.autoUpgrade = true
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Unlocked"
        document.getElementById("toggleAutoUpgradeButton").hidden = false
    }
}

function buyAutoPurchaseAP(){
    if (player.autoPurchaseAP == false){
        player.autoPurchaseAP = true
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase AP Unlocked"
        document.getElementById("toggleAutoPurchaseAPButton").hidden = false
    }
}

function buyAutoPurchaseStatPoints(){
    if (player.autoPurchaseStatPoints == false){
        player.autoPurchaseStatPoints = true
        document.getElementById("buyAutoPurchaseStatPointsButton").innerHTML = "Auto Purchase Stat Points Unlocked"
        document.getElementById("toggleAutoPurchaseStatPointsButton").hidden = false
    }
}

var mainGameLoop = null
function resetUpdateSpeed(){
    if (mainGameLoop !== null){
        clearInterval(mainGameLoop)
    }
    mainGameLoop = window.setTimeout(function (){
        update();
        resetUpdateSpeed()
    }, player.updateSpeed)
}
resetUpdateSpeed()


function toggleAutoUpgrade(){
    if (player.autoUpgrade == false){
        player.autoUpgrade = true
        document.getElementById("toggleAutoUpgradeButton").innerHTML = "Auto Upgrade: ON"
    }
    else if (player.autoUpgrade == true){
        player.autoUpgrade = false
        document.getElementById("toggleAutoUpgradeButton").innerHTML = "Auto Upgrade: OFF"
    }
}

function toggleAutoPurchaseAP(){
    if (player.autoPurchaseAP == false){
        player.autoPurchaseAP = true
        document.getElementById("toggleAutoPurchaseAPButton").innerHTML = "Auto Buy AP: ON"
    }
    else if (player.autoPurchaseAP == true){
        player.autoPurchaseAP = false
        document.getElementById("toggleAutoPurchaseAPButton").innerHTML = "Auto Buy AP: OFF"
    }
}

function toggleAutoPurchaseStatPoints(){
    if (player.autoPurchaseStatPoints == false){
        player.autoPurchaseStatPoints = true
        document.getElementById("toggleAutoPurchaseStatPointsButton").innerHTML = "Auto Buy SP: ON"
    }
    else if (player.autoPurchaseStatPoints == true){
        player.autoPurchaseStatPoints = false
        document.getElementById("toggleAutoPurchaseStatPointsButton").innerHTML = "Auto Buy SP: OFF"
    }
}

function buyStatPointBoost(){
    if (player.availableAP >= player.statPointBoostCost){   
        player.availableAP -= player.statPointBoostCost
        player.statPointBoostCost *= 2
        player.statPointUpgradeMultiplier += 1
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("statPointBoostCurrent").innerHTML = "Current Stat Point Multiplier: " + numberWithCommas(player.statPointUpgradeMultiplier)
        document.getElementById("buyStatPointBoostButton").innerHTML = "+1 Stat Point per Bar: " + player.statPointBoostCost + " AP"
    }
}

function buyTrainingPointBoost(){
    if (player.availableAP >= player.trainingPointBoostCost){   
        player.availableAP -= player.trainingPointBoostCost
        player.idleUpgradeMultiplier += 1
        player.trainingPointBoostCost = fibonacci(player.idleUpgradeMultiplier)
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("trainingPointBoostCurrent").innerHTML = "Current Training Point Multiplier: " + numberWithCommas(player.idleUpgradeMultiplier)
        document.getElementById("buyTrainingPointBoostButton").innerHTML = "+1x Training Point Speed: " + player.trainingPointBoostCost + " AP"
        updateHTML()
    }
}

/* Currently defunct but may be brought back later

function buySuperPowerTrain(){
    if (player.availableAP > 0){    
        player.availableAP -= 1
        if (player.powerTrainUpgradeMultiplier == 1){
            player.powerTrainUpgradeMultiplier = 2
        }
        else {
            player.powerTrainUpgradeMultiplier += 2
        }
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("superPowerTrainCurrent").innerHTML = "Current Power Train Multiplier: " + numberWithCommas(player.powerTrainUpgradeMultiplier)
    }
}*/

//TODO Learn error message display AND/OR find solution to power train loading issue
function loadGame(){
    clearInterval(mainGameLoop)
    var savegame = JSON.parse(localStorage.getItem("IdleBattleSave"))
    if (savegame !== null && powerTrainCooldown == false){
        player = savegame
        document.getElementById("trainingTab").style.display = 'none'
        document.getElementById("battleTab").style.display = 'none'
        document.getElementById("shopTab").style.display = 'none'
        document.getElementById("loadingText").hidden = false
        isLoading = true
        setTimeout(function(){
            updateHTML()
            updateAvatarGrid()
            document.getElementById("trainingTab").hidden = false
            document.getElementById("battleTab").hidden = false
            document.getElementById("shopTab").hidden = false
            document.getElementById("loadingText").hidden = true
            if (player.autoUpgrade == true){
                document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Unlocked"
                document.getElementById("toggleAutoUpgradeButton").hidden = false
            }
            if (player.autoPurchaseAP == true){
                document.getElementById("buyAutoPurchaseAPButton").innerHTML = "AutoPurchase for AP Unlocked"
                document.getElementById("toggleAutoPurchaseAPButton").hidden = false
            }
            if (player.autoPurchaseStatPoints == true){
                document.getElementById("buyAutoPurchaseStatPointsButton").innerHTML = "AutoPurchase for Stat Points Unlocked"
                document.getElementById("toggleAutoPurchaseStatPointsButton").hidden = false    
            }
            resetUpdateSpeed()
            document.getElementById("trainingTab").style.display = 'block'
            document.getElementById("inventoryGrid").innerHTML = ""
            for (var i = 0; i < player.inventory.length; i++){
                pushInventoryDisplay(i)
                var itemCheck = player.inventory[i]
                ID = player.allItems.findIndex(item => item.name === itemCheck.name);
                if (ID > -1){
                    document.getElementById("goldShopItem" + ID).onclick = ""
                    document.getElementById("goldShopItemCaption" + ID).innerHTML = itemCheck.name  + "<br/>" + "Bought"
                }
                var itemLevelCost = itemCheck.itemCost * 3 **(itemCheck.level + 1)
                if (player.inventory[i].level < 4){
                    document.getElementById("inventoryButton" + i).innerHTML = "Lvl Up Weapon<br/>" + itemLevelCost + " Gold"
                    document.getElementById("inventoryCaption" + i).innerHTML = player.inventory[i].name + "<br/>Level: " + (player.inventory[i].level + 1)
                }
                else if (player.inventory[i].level == 4){
                    document.getElementById("inventoryButton" + i).innerHTML = "Lvl MAX"
                    document.getElementById("inventoryButton" + i).disabled = true
                    document.getElementById("inventoryCaption" + i).innerHTML = player.inventory[i].name + "<br/>Level: " + (player.inventory[i].level + 1)
                }
            }
            player.equipment = []
            loadLadderFromWinLoss()
            loadZone(1)
            player.allocatedAtt = 0,
            player.allocatedHP = 0,
            player.allocatedDef = 0,
            player.allocatedSpe = 0,
            player.statPoints = player.maxStatPoints
            updateStatButtonHTML()
            document.getElementById("myprogressBarHP").style.width = player.currentProgressHP + '%'; 
            var percentShownHP = Number(player.currentProgressHP).toFixed(2)
            document.getElementById("currentProgressDisplayHP").innerHTML = percentShownHP + "%"

            document.getElementById("myprogressBarAtt").style.width = player.currentProgressAtt + '%'; 
            var percentShownAtt = Number(player.currentProgressAtt).toFixed(2)
            document.getElementById("currentProgressDisplayAtt").innerHTML = percentShownAtt + "%"

            document.getElementById("myprogressBarDef").style.width = player.currentProgressDef + '%'; 
            var percentShownDef = Number(player.currentProgressDef).toFixed(2)
            document.getElementById("currentProgressDisplayDef").innerHTML = percentShownDef + "%"

            document.getElementById("myprogressBarSpe").style.width = player.currentProgressSpe + '%'; 
            var percentShownSpe = Number(player.currentProgressSpe).toFixed(2)
            document.getElementById("currentProgressDisplaySpe").innerHTML = percentShownSpe + "%"
            isLoading = false
            document.getElementById("playerNameBox").value = player.name
            document.getElementById("playerNameDisplay").innerHTML = player.name
        }, 1000)
    }
    else if (player.powerTrainCooldown == true){

    }
}

//TODO Learn error message display AND/OR find solution to power train saving issue
function saveGame(){
    if (powerTrainCooldown == false){
        localStorage.setItem("IdleBattleSave", JSON.stringify(player))
    }
}


var autoSave = window.setInterval(function (){
    saveGame()
    setTimeout(function(){
    }, 500)
}, 60000);

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateHTML(){
    var trainingShown = Number(player.training).toFixed(0)
    var trainingPerSecondShown = Number(player.trainingPerClick * player.idleUpgradeMultiplier * 1000 / player.updateSpeed).toFixed(0)
    var statPointCostShown = Number(player.statPointCost).toFixed(0)
    var goldGeneratorCostShown = Number(player.goldGeneratorUpgradeCost).toFixed(0)
    var goldShown = Number(player.gold).toFixed(0)
    if (!powerTrainCooldown){
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second!"   
    }
    if (player.autoPurchaseAP == false){
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "AutoPurchase for AP Unlocks at 40 Total AP"
    }
    if (player.autoUpgrade == false){
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Unlocks at 20 Total AP"
    }
    if (player.autoPurchaseStatPoints == false){
        document.getElementById("buyAutoPurchaseStatPointsButton").innerHTML = "AutoPurchase for Stat Points Unlocks at 30 Total AP"
    }
    document.getElementById("currentTrainingPoints").innerHTML = "Training Points<br/><br/>" + numberWithCommas(trainingShown)
    document.getElementById("textAPTotal").innerHTML = "AP Total: " + numberWithCommas(player.totalAP)
    document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
    if (player.maxStatPoints !== 0){
        document.getElementById("buyStatPointButton").innerHTML = "Buy Stat Point<br/>" + numberWithCommas(statPointCostShown) + " Training Points"
    }
    document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level<br/>" + numberWithCommas(player.trainingPerClickCost) + " Training Points"
    document.getElementById("buyLevelUpButton").innerHTML = "EXP Level Up<br/>" + numberWithCommas(player.levelUpCost) + " EXP"
    document.getElementById("goldGeneratorLevelCurrent").innerHTML = "Current Gold Generator Level: " + numberWithCommas(player.goldGeneratorLevel)
    document.getElementById("upgradeGoldGeneratorButton").innerHTML = "+1 Gold Generator Level: " + numberWithCommas(goldGeneratorCostShown) + " AP"
    document.getElementById("currentEXP").innerHTML = "EXP<br/><br/>" + player.exp + "/" + player.levelUpCost
    document.getElementById("currentLevel").innerHTML = "Level<br/><br/>" + player.level
    document.getElementById("currentHPStat").innerHTML = player.maxHitPoints + " HP"
    document.getElementById("currentAttackStat").innerHTML = player.attackPoints + " Attack"
    document.getElementById("currentDefenseStat").innerHTML = player.defensePoints + " Defense"
    document.getElementById("currentSpeedStat").innerHTML = player.speedPoints + " Speed"
    document.getElementById("currentGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
    document.getElementById("inventoryPageGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
}

function updateStatButtonHTML(){
    document.getElementById("statPointsDisplay").innerHTML = "Stat Points<br/><br/>" + player.statPoints + "/" + player.maxStatPoints
    document.getElementById("statPointsOnHP").innerHTML = player.allocatedHP
    document.getElementById("statPointsOnAttack").innerHTML = player.allocatedAtt
    document.getElementById("statPointsOnDefense").innerHTML = player.allocatedDef
    document.getElementById("statPointsOnSpeed").innerHTML = player.allocatedSpe
    if (player.statPoints < 10){
        document.getElementById("plusTenHPButton").className = "greyedOutStatButton"
        document.getElementById("plusTenAttackButton").className = "greyedOutStatButton"
        document.getElementById("plusTenDefenseButton").className = "greyedOutStatButton"
        document.getElementById("plusTenSpeedButton").className = "greyedOutStatButton"
        document.getElementById("plusTenHPButton").disabled = true
        document.getElementById("plusTenAttackButton").disabled = true
        document.getElementById("plusTenDefenseButton").disabled = true
        document.getElementById("plusTenSpeedButton").disabled = true
    }
    else{
        document.getElementById("plusTenHPButton").className = "statButtonLayout"
        document.getElementById("plusTenAttackButton").className = "statButtonLayout"
        document.getElementById("plusTenDefenseButton").className = "statButtonLayout"
        document.getElementById("plusTenSpeedButton").className = "statButtonLayout"
        document.getElementById("plusTenHPButton").disabled = false
        document.getElementById("plusTenAttackButton").disabled = false
        document.getElementById("plusTenDefenseButton").disabled = false
        document.getElementById("plusTenSpeedButton").disabled = false
    }
    if (player.statPoints < 1){
        document.getElementById("plusOneHPButton").className = "greyedOutStatButton"
        document.getElementById("plusOneAttackButton").className = "greyedOutStatButton"
        document.getElementById("plusOneDefenseButton").className = "greyedOutStatButton"
        document.getElementById("plusOneSpeedButton").className = "greyedOutStatButton"
        document.getElementById("plusOneHPButton").disabled = true
        document.getElementById("plusOneAttackButton").disabled = true
        document.getElementById("plusOneDefenseButton").disabled = true
        document.getElementById("plusOneSpeedButton").disabled = true
    }
    else{
        document.getElementById("plusOneHPButton").className = "statButtonLayout"
        document.getElementById("plusOneAttackButton").className = "statButtonLayout"
        document.getElementById("plusOneDefenseButton").className = "statButtonLayout"
        document.getElementById("plusOneSpeedButton").className = "statButtonLayout"
        document.getElementById("plusOneHPButton").disabled = false
        document.getElementById("plusOneAttackButton").disabled = false
        document.getElementById("plusOneDefenseButton").disabled = false
        document.getElementById("plusOneSpeedButton").disabled = false
    }
    if (player.allocatedHP > 0){
        document.getElementById("minusOneHPButton").className = "statButtonLayout"
        document.getElementById("minusOneHPButton").disabled = false
    }
    else{
        document.getElementById("minusOneHPButton").className = "greyedOutStatButton"
        document.getElementById("minusOneHPButton").disabled = true
    }
    if (player.allocatedAtt > 0){
        document.getElementById("minusOneAttackButton").className = "statButtonLayout"
        document.getElementById("minusOneAttackButton").disabled = false
    }
    else{
        document.getElementById("minusOneAttackButton").className = "greyedOutStatButton"
        document.getElementById("minusOneAttackButton").disabled = true
    }
    if (player.allocatedDef > 0){
        document.getElementById("minusOneDefenseButton").className = "statButtonLayout"
        document.getElementById("minusOneDefenseButton").disabled = false
    }
    else{
        document.getElementById("minusOneDefenseButton").className = "greyedOutStatButton"
        document.getElementById("minusOneDefenseButton").disabled = true
    }
    if (player.allocatedSpe > 0){
        document.getElementById("minusOneSpeedButton").className = "statButtonLayout"
        document.getElementById("minusOneSpeedButton").disabled = false
    }
    else{
        document.getElementById("minusOneSpeedButton").className = "greyedOutStatButton"
        document.getElementById("minusOneSpeedButton").disabled = true
    }
    if (player.allocatedHP > 9){
        document.getElementById("minusTenHPButton").className = "statButtonLayout"
        document.getElementById("minusTenHPButton").disabled = false
    }
    else{
        document.getElementById("minusTenHPButton").className = "greyedOutStatButton"
        document.getElementById("minusTenHPButton").disabled = true
    }
    if (player.allocatedAtt > 9){
        document.getElementById("minusTenAttackButton").className = "statButtonLayout"
        document.getElementById("minusTenAttackButton").disabled = false
    }
    else{
        document.getElementById("minusTenAttackButton").className = "greyedOutStatButton"
        document.getElementById("minusTenAttackButton").disabled = true
    }
    if (player.allocatedDef > 9){
        document.getElementById("minusTenDefenseButton").className = "statButtonLayout"
        document.getElementById("minusTenDefenseButton").disabled = false
    }
    else{
        document.getElementById("minusTenDefenseButton").className = "greyedOutStatButton"
        document.getElementById("minusTenDefenseButton").disabled = true
    }
    if (player.allocatedSpe > 9){
        document.getElementById("minusTenSpeedButton").className = "statButtonLayout"
        document.getElementById("minusTenSpeedButton").disabled = false
    }
    else{
        document.getElementById("minusTenSpeedButton").className = "greyedOutStatButton"
        document.getElementById("minusTenSpeedButton").disabled = true
    }
}

function updateBuyAPButton(){
    var runningTotal = player.buyAPCost
    var counter = 0
    var costOfAPShown = Number(player.buyAPCost).toFixed(0)
    while (player.training > runningTotal){
        if (player.training > runningTotal){
            costOfAPShown = Number(runningTotal).toFixed(0)
        }
        counter += 1
        runningTotal += player.buyAPCost * 1.3**counter
    }
    if (counter == 0){
        counter = 1
    }
    document.getElementById("buyAPButton").innerHTML = "Reset Training for " + counter + " AP<br/>" + numberWithCommas(costOfAPShown) + " Training Points" 
}

function createEnemy(ID, name, hitPoints, attackPoints, defensePoints, speedPoints, imagePath, ladderValue, timesDefeated, timesLostTo, equipment, dropMin, dropMax, rarity, moveSpeed) {
    var enemy = {
        ID: ID,
        name: name,
        hitPoints: hitPoints,
        maxHitPoints: hitPoints,
        attackPoints: attackPoints,
        defensePoints: defensePoints,
        speedPoints: speedPoints,
        equipment: equipment,
        imagePath: imagePath,
        ladderValue: ladderValue,
        timesDefeated: timesDefeated,
        timesLostTo: timesLostTo,
        dropMin: dropMin,
        dropMax: dropMax,
        autoBattleVictories: 0,
        autoBattleTotalGold: 0,
        autoBattleTotalExp: 0,
        frozen: false,
        discovered: false,
        rarity: rarity,
        moveSpeed: moveSpeed
    }
    var enemySaveStats = {
        timesDefeated: timesDefeated,
        timesLostTo: timesLostTo, 
        discovered: false
    }
    if (ID >= 100){
        secretEnemyList[secretEnemyList.length] = enemy
        if (player.secretEnemySaveList.length < 13){
            player.secretEnemySaveList[player.secretEnemySaveList.length] = enemySaveStats
        }
    }
    else{
        enemyList[enemyList.length] = enemy
        defaultEnemyList[defaultEnemyList.length] = enemy
        if (player.enemySaveList.length < 16){
            player.enemySaveList[player.enemySaveList.length] = enemySaveStats
        }
    }
    return enemy;
}

function createItem(name, ID, fire, air, earth, water, melee, light, dark, fireDef, airDef, earthDef, waterDef, meleeDef, lightDef, darkDef, heal, oncePerBattle, freeze, imagePath, itemCost, level){
    var item = {
        name: name,
        ID: ID,
        fire: fire,
        earth: earth,
        air: air,
        water: water,
        melee: melee,
        light: light,
        dark: dark,
        fireDef: fireDef,
        airDef: airDef,
        earthDef: earthDef,
        waterDef: waterDef,
        meleeDef: meleeDef,
        lightDef: lightDef,
        darkDef: darkDef,
        heal: heal,
        oncePerBattle: oncePerBattle,
        freeze: freeze,
        imagePath: imagePath,
        itemCost: itemCost,
        level: level
    }
    if (item.ID > 99){
        player.secretItems[item.ID - 100] = item
    }
    else{
        player.allItems[item.ID] = item
        var cell = document.createElement("div");
        var figure = document.createElement("figure")
        var caption = document.createElement("figcaption")
        var image = document.createElement("img")
        cell.style = "max-width: 300px; min-width: 300px; height: 250px; background-color: #335C81; border: 1px solid #ac9444; text-align: center"
        cell.id = "goldShopItem" + item.ID
        image.src = item.imagePath
        image.className = "itemImages"
        image.style = "background-image: linear-gradient(to bottom right, rgb(50, 50, 50), rgb(20, 20, 20)); border: 1px solid white"
        caption.id = "goldShopItemCaption" + item.ID
        caption.className = "itemText"
        caption.style = "font-size: 25px"
        figure.appendChild(image)
        figure.appendChild(caption)
        cell.appendChild(figure)
        document.getElementById("goldShopGrid").appendChild(cell);
        document.getElementById("goldShopItem" + item.ID).onclick = function(){buyItem(item.ID)}
        document.getElementById("goldShopItemCaption" + item.ID).innerHTML = item.name  + "<br/><br/>" + item.itemCost + " Gold"
    }
        
    return item;
}

function createZone(ID, name, color, enemies){
    var zone = {
        ID: ID,
        name: name,
        color: color,
        enemies: enemies
    }
    player.zones.push(zone)
    return zone
}

var enemyWeapons = []
function createEnemyWeapon(name, ID, fire, air, earth, water, melee, light, dark, fireDef, airDef, earthDef, waterDef, meleeDef, lightDef, darkDef, heal, oncePerBattle, freeze){
    var enemyWeapon = {
        name: name,
        ID: ID,
        fire: fire,
        earth: earth,
        air: air,
        water: water,
        melee: melee,
        light: light,
        dark: dark,
        fireDef: fireDef,
        airDef: airDef,
        earthDef: earthDef,
        waterDef: waterDef,
        meleeDef: meleeDef,
        lightDef: lightDef,
        darkDef: darkDef,
        heal: heal,
        oncePerBattle: oncePerBattle,
        freeze: freeze
    }
    enemyWeapons[enemyWeapon.ID] = enemyWeapon
}

function buyItem(ID){
    var buyItem = player.allItems[ID]
    if (player.gold >= buyItem.itemCost){
        player.gold -= buyItem.itemCost
        document.getElementById("goldShopItem" + ID).onclick = ""
        document.getElementById("goldShopItemCaption" + ID).innerHTML = buyItem.name  + "<br/></br>" + "Bought"
        player.inventory.push(buyItem)
        pushInventoryDisplay(player.inventory.length - 1)
        updateHTML()
    }
}

function displayGold(){
    var goldShown = Number(player.gold).toFixed(0)
    document.getElementById("currentGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
    document.getElementById("inventoryPageGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
    document.getElementById("goldDisplay").innerHTML = "Gold<br/><br/>" + player.gold
}

function itemLevelUp(index){
    item = player.inventory[index]
    var itemLevelCost = item.itemCost * 3 **(item.level + 1)
    if (player.gold >= itemLevelCost){
        item.level += 1
        player.gold -= itemLevelCost    
        displayGold()
        var attackIconTotal = getTotalIcons(item, false)
        var defenseIconTotal = getTotalIcons(item, true)
        var attackDivider = attackIconTotal / 4
        var defenseDivider = defenseIconTotal / 4
        if (item.fire > 0){
            var percentageFire = item.fire / attackIconTotal
            item.fire += attackDivider * percentageFire
        }
        if (item.air > 0){
            var percentageAir = item.air / attackIconTotal
            item.air += attackDivider * percentageAir
        }
        if (item.earth > 0){
            var percentageEarth = item.earth / attackIconTotal
            item.earth += attackDivider * percentageEarth
        }
        if (item.water > 0){
            var percentageWater = item.water / attackIconTotal
            item.water += attackDivider * percentageWater
        }
        if (item.melee > 0){
            var percentageMelee = item.melee / attackIconTotal
            item.melee += attackDivider * percentageMelee
        }
        if (item.light > 0){
            var percentageLight = item.light / attackIconTotal
            item.light += attackDivider * percentageLight
        }
        if (item.dark > 0){
            var percentageDark = item.dark / attackIconTotal
            item.dark += attackDivider * percentageDark
        }
        if (item.fireDef > 0){
            var percentageFireDef = item.fireDef / defenseIconTotal
            item.fireDef += defenseDivider * percentageFireDef
        }
        if (item.airDef > 0){
            var percentageAirDef = item.airDef / defenseIconTotal
            item.airDef += defenseDivider * percentageAirDef
        }
        if (item.earthDef > 0){
            var percentageEarthDef = item.earthDef / defenseIconTotal
            item.earthDef += defenseDivider * percentageEarthDef
        }
        if (item.waterDef > 0){
            var percentageWaterDef = item.waterDef / defenseIconTotal
            item.waterDef += defenseDivider * percentageWaterDef
        }
        if (item.meleeDef > 0){
            var percentageMeleeDef = item.meleeDef / defenseIconTotal
            item.meleeDef += defenseDivider * percentageMeleeDef
        }
        if (item.lightDef > 0){
            var percentageLightDef = item.lightDef / defenseIconTotal
            item.lightDef += defenseDivider * percentageLightDef
        }
        if (item.darkDef > 0){
            var percentageDarkDef = item.darkDef / defenseIconTotal
            item.darkDef += defenseDivider * percentageDarkDef
        }
        if (item.level < 4){
            document.getElementById("inventoryButton" + index).innerHTML = "Lvl Up Weapon<br/>" + itemLevelCost * 3 + " Gold"
            document.getElementById("inventoryCaption" + index).innerHTML = player.inventory[index].name + "<br/>Level: " + (player.inventory[index].level + 1)
        }
        else{
            document.getElementById("inventoryButton" + index).innerHTML = "Lvl MAX"
            document.getElementById("inventoryButton" + index).disabled = true
            document.getElementById("inventoryCaption" + index).innerHTML = player.inventory[index].name + "<br/>Level: " + (player.inventory[index].level + 1)
        }
    }
}
    
function pushInventoryDisplay(index){ 
    var cell = document.createElement("div");
    var figure = document.createElement("figure")
    var caption = document.createElement("figcaption")
    var image = document.createElement("img")
    var levelButton = document.createElement("button")
    cell.style = "max-width: 300px; min-width: 300px; min-height: 300px; background-color: #335C81; border: 1px solid #ac9444; text-align: center"
    cell.id = "inventory" + index
    figure.id = "inventoryFig" + index
    image.src = player.inventory[index].imagePath
    image.className = "itemImages"
    image.style = "background-image: linear-gradient(to bottom right, rgb(50, 50, 50), rgb(20, 20, 20)); border: 1px solid white"
    caption.id = "inventoryCaption" + index
    if (player.inventory[index].level < 5){
        caption.innerHTML = player.inventory[index].name + "<br/>Level: " + (player.inventory[index].level + 1)
        levelButton.innerHTML = "Lvl Up Weapon<br/>" + player.inventory[index].itemCost*3 + " Gold"
    }
    else{
        caption.innerHTML = player.inventory[index].name + "<br/>Level: 5"
        levelButton.innerHTML = "Lvl MAX"
    }
    caption.className = "itemText"
    caption.style = "font-size: 25px"
    levelButton.className = "mainButtonLayout"
    levelButton.id = "inventoryButton" + index    
    levelButton.onclick = function(){itemLevelUp(index), setSelected(index)}
    figure.appendChild(image)
    figure.appendChild(caption)
    cell.appendChild(figure)
    cell.appendChild(levelButton)
    document.getElementById("inventoryGrid").appendChild(cell);  
    document.getElementById("inventory" + index).onclick = function(){setSelected(index)}
}  

var options = {
    useEasing: false, 
    useGrouping: true, 
    separator: ',', 
    decimal: '.', 
    prefix: 'Training Points<br/><br/>', 
};

var optionsBattle = null
function createBattleOptions(enemy){
    optionsBattle = {
        useEasing: false, 
        useGrouping: true, 
        separator: ',', 
        decimal: '.', 
        prefix: enemy.name + "<br/>",
        suffix: "/" + enemy.maxHitPoints
    };
}

var optionsBattlePlayer = null
function createBattleOptionsPlayer(){
    optionsBattlePlayer = {
        useEasing: false, 
        useGrouping: true, 
        separator: ',', 
        decimal: '.', 
        prefix: player.name + "<br/>",
        suffix: "/" + player.maxHitPoints
    };
}

//document.getElementById("battleScreenEnemyName").innerHTML = enemy.name + "<br/>" + enemy.hitPoints + "/" + enemy.maxHitPoints

function printSuccess(){
    console.log("Success!")
}

function setSelected(i){
    var isEquipped = false
    if (player.equipment.includes(player.inventory[i])){
        isEquipped = true
        var equipIndex = player.equipment.indexOf(player.inventory[i])
        player.equipment.splice(equipIndex, 1)
        document.getElementById("inventory" + i).style.border="1px solid #ac9444"
    }
    if (!isEquipped){
        if (player.equipment.length < 8){  
            player.equipment.push(player.inventory[i])
            document.getElementById("inventory" + i).style.border="2px solid white"
        }
    }
    reloadEquipmentDisplay()
}

var selectedItems = []
function selectWeapon(equipID){
    if (player.equipment[equipID] !== undefined && fighting == true){
        document.getElementById("fightButton").disabled = false
        document.getElementById("fightButton").style = "min-width: 600px;"
        if (selectedItems[0] == null){
            selectedItems[0] = player.equipment[equipID]
            document.getElementById("equippedWeapon" + equipID).style.border="1px solid white"
        }
        else if (selectedItems[1] == null && player.equipment[equipID] !== selectedItems[0]){
            selectedItems[1] = player.equipment[equipID]
            document.getElementById("equippedWeapon" + equipID).style.border="1px solid white"
        }
        else if (player.equipment[equipID] == selectedItems[0]){
            if (selectedItems[1] !== null){
                selectedItems[0] = selectedItems[1]
                selectedItems[1] = null
                document.getElementById("equippedWeapon" + equipID).style.border=""
            }
            else{
                selectedItems[0] = null
                document.getElementById("fightButton").disabled = true
                document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
                document.getElementById("equippedWeapon" + equipID).style.border=""
            }
        }
        else if (player.equipment[equipID] == selectedItems[1]){
            selectedItems[1] = null
            document.getElementById("equippedWeapon" + equipID).style.border=""
        }
        else{
            tempItem = selectedItems[1]
            selectedItems[1] = player.equipment[equipID]
            selectedItems[0] = tempItem
            for (var i = 0; i < player.equipment.length; i++){
                if (player.equipment[i] == selectedItems[0] || player.equipment[i] == selectedItems[1]){
                    document.getElementById("equippedWeapon" + equipID).style.border="1px solid white"
                }
                else{
                    document.getElementById("equippedWeapon" + i).style.border=""
                }
            }
        }
    }
    else if (player.equipment[equipID] == undefined && fighting == true){
        document.getElementById("equippedWeapon" + equipID).style.border = "2px solid red"
    }
}

function reloadEquipmentDisplay(){
    clearIcons()
    for (var i = 0; i < 8; i++){
        if (player.equipment[i]){ 
            document.getElementById("table" + i).src = player.equipment[i].imagePath
            document.getElementById("equipmentName" + i).innerHTML = player.equipment[i].name
            loadAttackIcons("damage", i)    
            loadDefenseIcons("defense", i)
            loadAbilityIcons(player, i, false, false)
        }
        else {
            document.getElementById("table" + i).src = "/images/weapons/emptyEquipmentSlot.png"
            document.getElementById("equipmentName" + i).innerHTML = ""
            document.getElementById("damage" + i).innerHTML = ""
            document.getElementById("defense" + i).innerHTML = ""
            document.getElementById("ability" + i).innerHTML = ""     
            document.getElementById("abilityFreeze" + i).innerHTML = ""
        }
    }
}

function clearIcons(){
    for (var i = 0; i < player.equipment.length; i++){
        document.getElementById("damage" + i).innerHTML = ""
        document.getElementById("defense" + i).innerHTML = ""
        document.getElementById("ability" + i).innerHTML = ""
        document.getElementById("abilityFreeze" + i).innerHTML = ""
    }
}

function loadAttackIcons(type, i, isEnemy) {
    var iconCounter = 0
    var checker = false
    var inBattle = false
    if (document.getElementById("" + type + i)){
        if (document.getElementById("" + type + i).innerHTML == ""){
            checker = true
        }
    }
    else if (document.getElementById("" + type)){
        checker = true
        inBattle = true
        document.getElementById(type).innerHTML = ""
    }
    var loadedWeapon = null
    if (isEnemy){
        loadedWeapon = enemy.equipment[i]
    }
    else{
        loadedWeapon = player.equipment[i]
    }
    if (checker){
        for (var j = 0; j < loadedWeapon.fire; j++) {
            var image = new Image();
            image.src = "/images/icons/FireIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.air; j++) {
            var image = new Image();
            image.src = "/images/icons/AirIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.earth; j++) {
            var image = new Image();
            image.src = "/images/icons/EarthIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.water; j++) {
            var image = new Image();
            image.src = "/images/icons/WaterIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.melee; j++) {
            var image = new Image();
            image.src = "/images/icons/PhysIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.light; j++) {
            var image = new Image();
            image.src = "/images/icons/LightIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.dark; j++) {
            var image = new Image();
            image.src = "/images/icons/DarkIcon.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        if (iconCounter < 8){
            if (type == "damage"){
                document.getElementById("damageCell" + i).style = "vertical-align: center"
            }
            else if (type == "defense"){
                document.getElementById("defenseCell" + i).style = "vertical-align: center"
            }
        }
    }
}

function loadDefenseIcons(type, i, isEnemy) {
    var iconCounter = 0
    var checker = false
    var inBattle = false
    if (document.getElementById("" + type + i)){
        if (document.getElementById("" + type + i).innerHTML == ""){
            checker = true
        }
    }
    else if (document.getElementById("" + type)){
        checker = true
        inBattle = true
        document.getElementById(type).innerHTML = ""
    }
    var loadedWeapon = null
    if (isEnemy){
        loadedWeapon = enemy.equipment[i]
    }
    else{
        loadedWeapon = player.equipment[i]
    }
    if (checker){
        if (loadedWeapon.fireDef == 9999){
            
        }
        else{
            for (var j = 0; j < loadedWeapon.fireDef; j++) {
                var image = new Image();
                image.src = "/images/icons/FireIconBlock.png";
                image.width = 25;
                if (inBattle){
                    document.getElementById("" + type).appendChild(image);
                }
                else{
                    document.getElementById("" + type + i).appendChild(image);
                }
                iconCounter += 1
            }
        }
        for (var j = 0; j < loadedWeapon.airDef; j++) {
            var image = new Image();
            image.src = "/images/icons/AirIconBlock.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.earthDef; j++) {
            var image = new Image();
            image.src = "/images/icons/EarthIconBlock.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.waterDef; j++) {
            var image = new Image();
            image.src = "/images/icons/WaterIconBlock.png";
            image.width = 25;
            if (inBattle){
                document.getElementById("" + type).appendChild(image);
            }
            else{
                document.getElementById("" + type + i).appendChild(image);
            }
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.meleeDef; j++) {
            loadIconImage(type, i, "/images/icons/PhysIconBlock.png", inBattle)
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.lightDef; j++) {
            loadIconImage(type, i, "/images/icons/LightIconBlock.png", inBattle)
            iconCounter += 1
        }
        for (var j = 0; j < loadedWeapon.darkDef; j++) {
            loadIconImage(type, i, "/images/icons/DarkIconBlock.png", inBattle)
            iconCounter += 1
        }
        if (iconCounter < 8){
            if (type == "damage"){
                document.getElementById("damageCell" + i).style = "vertical-align: center"
            }
            else if (type == "defense"){
                document.getElementById("defenseCell" + i).style = "vertical-align: center"
            }
        }
    }
}

function loadIconImage(type, i, imagePath, inBattle){
    var image = new Image();
    image.src = imagePath;
    image.width = 25;
    if (inBattle){
        document.getElementById("" + type).appendChild(image);
    }
    else{
        document.getElementById("" + type + i).appendChild(image);            
    }
}

function loadAbilityIcons(actor, i, inBattle, isEnemy, first){
    if (actor.equipment[i].heal > 0){
        var image = new Image();
        image.src = "/images/icons/HealIcon.png";
        image.width = 25;
        if (!inBattle){
            document.getElementById("ability" + i).appendChild(image);
            document.getElementById("ability" + i).innerHTML += " " + actor.equipment[i].heal
        }
        else{
            if (isEnemy){
                if (first){
                    document.getElementById("enemyHealRow0").hidden = false
                    document.getElementById("enemyHealIcons0").innerHTML = " " + actor.equipment[i].heal + " "
                    document.getElementById("enemyHealIcons0").appendChild(image);
                    document.getElementById("enemyHealText0").innerHTML =  actor.name + " healed with " + actor.equipment[i].name + "!"    
                }
                else{
                    document.getElementById("enemyHealRow1").hidden = false
                    document.getElementById("enemyHealIcons1").innerHTML = " " + actor.equipment[i].heal
                    document.getElementById("enemyHealIcons1").appendChild(image);
                    document.getElementById("enemyHealText1").innerHTML =  actor.name + " healed with " + actor.equipment[i].name + "!"  
                }
            }
            else{
                if (first){
                    document.getElementById("playerHealRow0").hidden = false
                    document.getElementById("playerHealIcons0").innerHTML = ""
                    document.getElementById("playerHealIcons0").appendChild(image);
                    document.getElementById("playerHealIcons0").innerHTML += " " + actor.equipment[i].heal
                    document.getElementById("playerHealText0").innerHTML =  "You healed with " + actor.equipment[i].name + "!"  
                }
                else{
                    document.getElementById("playerHealRow1").hidden = false
                    document.getElementById("playerHealIcons1").innerHTML = ""
                    document.getElementById("playerHealIcons1").appendChild(image);
                    document.getElementById("playerHealIcons1").innerHTML += " " + actor.equipment[i].heal
                    document.getElementById("playerHealText1").innerHTML =  "You healed with " + actor.equipment[i].name + "!"
                }
            }
        }
    }
    if (actor.equipment[i].heal > 0 && actor.equipment[i].freeze == true){
        
    }
    if (actor.equipment[i].freeze == true && inBattle == false){
        var image = new Image();
        image.src = "/images/icons/FreezeIcon.png";
        image.width = 25;
        document.getElementById("abilityFreeze" + i).appendChild(image);
    }
}


document.addEventListener('keyup', (e) => {
    if (fighting == true || postFight == true){       
        if (e.keyCode === 82){
            startFight(currentEnemy)
        }
        else if (e.keyCode === 90){
            returnToEnemies()
        }
    }
    if (fighting == true){
        if (e.keyCode === 70){
            if (selectedItems[0] !== null && player.hitPoints > 0 && enemy.hitPoints > 0){
                fight()
            }
        }
        else if (e.keyCode === 87){
            selectStance("Wild")
        }
        else if (e.keyCode === 65){
            selectStance("Strong")
        }
        else if (e.keyCode === 83){
            selectStance("Steady")
        }
        else if (e.keyCode === 68){
            selectStance("Defensive")
        }
        else if (e.keyCode === 49){
            selectWeapon(0)
        }
        else if (e.keyCode === 50){
            selectWeapon(1)
        }
        else if (e.keyCode === 51){
            selectWeapon(2)
        }
        else if (e.keyCode === 52){
            selectWeapon(3)
        }
        else if (e.keyCode === 53){
            selectWeapon(4)
        }
        else if (e.keyCode === 54){
            selectWeapon(5)
        }
        else if (e.keyCode === 55){
            selectWeapon(6)
        }
        else if (e.keyCode === 56){
            selectWeapon(7)
        }
    }
});
var currentEnemy = 0
var postFight = false
var fighting = false
function initiateBattle(fightEnemyID){
    fighting = true
    document.getElementById("outcomeText").hidden = true
    document.getElementById("outcomeTextGold").hidden = true
    document.getElementById("outcomeTextExp").hidden = true
    document.getElementById("fightButton").disabled = true
    document.getElementById("playerHealRow0").hidden = true
    document.getElementById("playerHealRow1").hidden = true
    document.getElementById("enemyHealRow0").hidden = true
    document.getElementById("enemyHealRow1").hidden = true
    document.getElementById("attackOrder").innerHTML = ""
    document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
    if (fightEnemyID > 99){
        var enemy = secretEnemyList[fightEnemyID - 100]
    }
    else {
        var enemy = enemyList[fightEnemyID]
    }
    document.getElementById("enemyBattleImage").src = enemy.imagePath
    document.getElementById("playerBattleImage").src = player.imagePath
    if (player.hitPoints !== player.maxHitPoints){
        player.hitPoints = player.maxHitPoints
    }
    if (enemy.hitPoints !== enemy.maxHitPoints){
        enemy.hitPoints = enemy.maxHitPoints
    }
    enemy.frozen = false
    player.frozen = false
    updateHP(enemy)
    createBattleOptions(enemy)
    createBattleOptionsPlayer()
    loadEquipmentForBattle()
    selectStance("Steady")
    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 32 && e.target == document.body) {
          e.preventDefault();
        }
    });
    hideAllBattleRows()
    currentEnemy = fightEnemyID
    for (var i = 0; i < player.equipment.length; i++){
        document.getElementById("equippedWeapon" + i).style.border=""
    }
    selectedItems[0] = null
    selectedItems[1] = null
}

function updateHP(enemy){    
    document.getElementById("battleScreenEnemyName").innerHTML = enemy.name + "<br/>" + enemy.hitPoints + "/" + enemy.maxHitPoints
    document.getElementById("battleScreenPlayerName").innerHTML = player.name + "<br/>" + player.hitPoints + "/" + player.maxHitPoints
}

function loadEquipmentForBattle(){
    for (var i = 0; i < 8; i++){
        if (player.equipment[i]){
            document.getElementById("equippedWeapon" + i).style.opacity = "100%"
            document.getElementById("equippedWeapon" + i).src = player.equipment[i].imagePath
        }
        else{
            document.getElementById("equippedWeapon" + i).style.opacity = "0%"
        }
    }
}

function determineTier(stat){
    var statTier = 0
    if (stat < 5){
        statTier = 0.25
    }
    else if (stat > 4 && stat < 10){
        statTier = 0.5
    }
    else if (stat > 9 && stat < 20){
        statTier = 0.75
    }
    else if (stat > 19 && stat < 35){
        statTier = 1
    }
    else if (stat > 34 && stat < 55){
        statTier = 1.25
    }
    else if (stat > 54 && stat < 75){
        statTier = 1.5
    }
    else if (stat > 74 && stat < 100){
        statTier = 2
    }
    else if (stat > 99 && stat < 150){
        statTier = 2.5
    }
    else if (stat > 149 && stat < 200){
        statTier = 3
    }
    else if (stat > 199 && stat < 250){
        statTier = 3.5
    }
    else if (stat > 249 && stat < 300){
        statTier = 4
    }
    else if (stat > 299 && stat < 350){
        statTier = 5
    }
    else if (stat > 349 && stat < 400){
        statTier = 6
    }
    else if (stat > 399 && stat < 450){
        statTier = 7
    }
    else if (stat > 449 && stat < 500){
        statTier = 8
    }
    else if (stat > 499 && stat < 1000){
        statTier = 9
    }
    else if (stat > 999){
        statTier = stat / 100
    }
    return statTier;
}

function selectStance(stance){
    document.getElementById("stanceButton" + player.currentStance).style.border = ""
    player.currentStance = stance
    document.getElementById("stanceButton" + stance).style.border = "2px solid white"
}

function determineModifier(type){
    var multiplier = 1;
    if (type == "Wild"){
        multiplier = 1.5
    }
    else if (type == "Strong"){
        multiplier = 1.25
    }
    else if (type == "Defensive"){
        multiplier = 0.75
    }
    return multiplier
}

function getTotalIcons(weapon, isDefense){
    if (!isDefense){
        return weapon.fire + weapon.air + weapon.melee + weapon.water + weapon.earth + weapon.light + weapon.dark
    }
    else{
        return weapon.fireDef + weapon.airDef + weapon.meleeDef + weapon.waterDef + weapon.earthDef + weapon.lightDef + weapon.darkDef
    }
}

function preventNegative(damage){
    if (damage < 0){
        damage = 0
    }
    return damage
}

var enemyFreeze = false
function attack(enemy, playerItem1, playerItem2, enemyItemIndex1, enemyItemIndex2){
    var enemyItem1 = enemy.equipment[enemyItemIndex1]
    var enemyItem2 = enemy.equipment[enemyItemIndex2]
    if (enemyFreeze == true){
        enemyItem1 = enemyWeapons[64]
        enemyItem2 = enemyWeapons[64]
        enemyFreeze = false
    }
    if (player.frozen){
        playerItem1 = enemyWeapons[64]
        playerItem2 = enemyWeapons[64]
    }
    enemyWasFrozen = false
    if (!player.frozen){
        var playerStrength = determineTier(player.attackPoints);
        var enemyDefense = determineTier(enemy.defensePoints);
        var attackModifier = determineModifier(player.currentStance);
        var enemyDefenseModifier = determineModifier(enemyStance);
        var iconAtkModifier = playerStrength / enemyDefense
        if (iconAtkModifier > 1){
            iconAtkModifier = 1
        }
        var iconDefModifier = enemyDefense / playerStrength
        if (iconDefModifier > 1){
            iconDefModifier = 1
        }
        var totalHeal = 0;
        var totalDamage = 0;
        var playerItemIndex1 = player.equipment.indexOf(playerItem1)
        var playerItemIndex2 = player.equipment.indexOf(playerItem2)
        if (playerItem1 !== null && playerItem2 !== null){
            physDamage = preventNegative((playerItem1.melee*playerStrength + playerItem2.melee*playerStrength) - (enemyItem1.meleeDef*enemyDefense + enemyItem2.meleeDef*enemyDefense));
            fireDamage = preventNegative((playerItem1.fire*playerStrength + playerItem2.fire*playerStrength) - (enemyItem1.fireDef*enemyDefense + enemyItem2.fireDef*enemyDefense));
            waterDamage = preventNegative((playerItem1.water*playerStrength + playerItem2.water*playerStrength) - (enemyItem1.waterDef*enemyDefense + enemyItem2.waterDef*enemyDefense));
            earthDamage = preventNegative((playerItem1.earth*playerStrength + playerItem2.earth*playerStrength) - (enemyItem1.earthDef*enemyDefense + enemyItem2.earthDef*enemyDefense));
            airDamage = preventNegative((playerItem1.air*playerStrength + playerItem2.air*playerStrength) - (enemyItem1.airDef*enemyDefense + enemyItem2.airDef*enemyDefense));           
            lightDamage = preventNegative((playerItem1.light*playerStrength + playerItem2.light*playerStrength) - (enemyItem1.lightDef*enemyDefense + enemyItem2.lightDef*enemyDefense));
            darkDamage = preventNegative((playerItem1.dark*playerStrength + playerItem2.dark*playerStrength) - (enemyItem1.darkDef*enemyDefense + enemyItem2.darkDef*enemyDefense));
            totalDamage = Math.round((physDamage + fireDamage + waterDamage + earthDamage + airDamage + lightDamage + darkDamage) * attackModifier * enemyDefenseModifier);
            totalHeal = playerItem1.heal + playerItem2.heal
        }
        if (playerItem2 == null && playerItem1 !== null){
            physDamage = preventNegative((playerItem1.melee*playerStrength) - (enemyItem1.meleeDef*enemyDefense + enemyItem2.meleeDef*enemyDefense));
            fireDamage = preventNegative((playerItem1.fire*playerStrength) - (enemyItem1.fireDef*enemyDefense + enemyItem2.fireDef*enemyDefense));
            waterDamage = preventNegative((playerItem1.water*playerStrength) - (enemyItem1.waterDef*enemyDefense + enemyItem2.waterDef*enemyDefense));
            earthDamage = preventNegative((playerItem1.earth*playerStrength) - (enemyItem1.earthDef*enemyDefense + enemyItem2.earthDef*enemyDefense));
            airDamage = preventNegative((playerItem1.air*playerStrength) - (enemyItem1.airDef*enemyDefense + enemyItem2.airDef*enemyDefense));
            lightDamage = preventNegative((playerItem1.light*playerStrength) - (enemyItem1.lightDef*enemyDefense + enemyItem2.lightDef*enemyDefense));
            darkDamage = preventNegative((playerItem1.dark*playerStrength) - (enemyItem1.darkDef*enemyDefense + enemyItem2.darkDef*enemyDefense));
            totalDamage = Math.round((physDamage + fireDamage + waterDamage + earthDamage + airDamage + lightDamage + darkDamage) * attackModifier * enemyDefenseModifier);
            totalHeal = playerItem1.heal
        }
        if (totalDamage < 0){
            totalDamage = 0;
        }
        document.getElementById("damageRight").innerHTML = totalDamage + " DMG"
        var difference = enemy.hitPoints - totalDamage
        if (difference < 0){
            difference = 0
        }
        var hpAnimationEnemy = new CountUp("battleScreenEnemyName", enemy.hitPoints, difference, 0, 0.5, optionsBattle);
        hpAnimationEnemy.start()
        enemy.hitPoints = enemy.hitPoints - totalDamage
        if (playerItem2 !== null){
            if (playerItem2.freeze == true){
                if (firstAttack == "player"){
                    enemyFreeze = true
                }
                else{
                    enemy.frozen = true
                }
                document.getElementById("attackIconRow1").hidden = false
                loadAttackIcons("attackIconsRight1", playerItemIndex2, false)
                document.getElementById("attackText1").innerHTML = "You froze " + enemy.name + " with " + playerItem2.name + "!"
            }
        }
        if (playerItem1.freeze == true){
            if (player.speedPoints > enemy.speedPoints){
                enemyFreeze = true
            }
            else{
                enemy.frozen = true
            }
            document.getElementById("attackIconRow0").hidden = false
            loadAttackIcons("attackIconsRight0", playerItemIndex1, false)
            document.getElementById("attackText0").innerHTML = "You froze " + enemy.name + " with " + playerItem1.name + "!"
        }
        if (player.hitPoints + totalHeal > player.maxHitPoints){
            player.hitPoints = player.maxHitPoints;
        }
        else{
            player.hitPoints = player.hitPoints + totalHeal
        }
        if (enemy.hitPoints < 0){
            enemy.hitPoints = 0
            updateHP(enemy)
        }
        document.getElementById("playerHealRow0").hidden = true
        document.getElementById("playerHealRow1").hidden = true
        if (totalHeal > 0){
            loadAbilityIcons(player, playerItemIndex1, true, false, true)
            if (playerItem2 !== null){
                loadAbilityIcons(player, playerItemIndex2, true, false, false)
            }
        }
        if(playerItem1 !== null){
            if (getTotalIcons(playerItem1, false) > 0){
                document.getElementById("attackIconRow0").hidden = false
                loadAttackIcons("attackIconsRight0", playerItemIndex1, false)
                document.getElementById("attackText0").innerHTML = "You attacked with " + playerItem1.name + "!"
            }
            if (getTotalIcons(enemyItem1, true) > 0){
                document.getElementById("enemyDefenseIconRow0").hidden = false
                loadDefenseIcons("enemyDefenseIconsRight0", enemyItemIndex1, true)
                document.getElementById("enemyDefenseText0").innerHTML = enemy.name + " defended with " + enemyItem1.name + "!"
            }
            if (getTotalIcons(enemyItem2, true) > 0){
                document.getElementById("enemyDefenseIconRow1").hidden = false
                loadDefenseIcons("enemyDefenseIconsRight1", enemyItemIndex2, true)
                document.getElementById("enemyDefenseText1").innerHTML = enemy.name + " defended with " + enemyItem2.name + "!"
            }
        }
        if (playerItem2 !== null){
            if (getTotalIcons(playerItem2, false) > 0){
                document.getElementById("attackIconRow1").hidden = false
                loadAttackIcons("attackIconsRight1", playerItemIndex2, false)
                document.getElementById("attackText1").innerHTML = "You attacked with " + playerItem2.name + "!"
            }
        }
        if (playerFreeze == true){
            player.frozen = true
        }
        updateHP(enemy)
        document.getElementById("damageRow").hidden = false
    }
    else if (player.frozen == true){
        document.getElementById("playerFreezeRow").hidden = false
        document.getElementById("playerFreezeText").innerHTML = "You are frozen! You cannot attack this turn!"
        if (enemyItem1.freeze !== true && enemyItem2.freeze !== true){
            player.frozen = false
        }   
        if (firstAttack == "enemy"){
            if (enemyWasFrozen == true){
                player.frozen = false
                enemyWasFrozen == false
            }
        }
        updateHP(enemy)
        document.getElementById("damageRow").hidden = false
    }
}

var playerFreeze = false
var enemyWasFrozen = false
function enemyAttack(enemy, playerItem1, playerItem2, enemyItemIndex1, enemyItemIndex2){
    playerFreeze = false
    if (enemy.frozen == false){
        var enemyStrength = determineTier(enemy.attackPoints);
        var playerDefense = determineTier(player.defensePoints);
        var attackModifier = determineModifier(enemyStance);
        var playerDefenseModifier = determineModifier(player.currentStance);
        var iconAtkModifier = enemyStrength / playerDefense
        if (iconAtkModifier > 1){
            iconAtkModifier = 1
        }
        var iconDefModifier = playerDefense / enemyStrength
        if (iconDefModifier > 1){
            iconDefModifier = 1
        }
        var totalHeal = 0;
        var totalDamage = 0;
        var enemyItem1 = enemy.equipment[enemyItemIndex1]
        var enemyItem2 = enemy.equipment[enemyItemIndex2]
        var playerItemIndex1 = player.equipment.indexOf(playerItem1)
        var playerItemIndex2 = player.equipment.indexOf(playerItem2)
        if (playerItem1 == null){
            playerItem1 = enemyWeapons[64]
        }
        if (playerItem1 !== null && playerItem2 !== null){
            physDamage = preventNegative((enemyItem1.melee*enemyStrength + enemyItem2.melee*enemyStrength) - (playerItem1.meleeDef*playerDefense + playerItem2.meleeDef*playerDefense));
            fireDamage = preventNegative((enemyItem1.fire*enemyStrength + enemyItem2.fire*enemyStrength) - (playerItem1.fireDef*playerDefense + playerItem2.fireDef*playerDefense));
            waterDamage = preventNegative((enemyItem1.water*enemyStrength + enemyItem2.water*enemyStrength) - (playerItem1.waterDef*playerDefense + playerItem2.waterDef*playerDefense));
            earthDamage = preventNegative((enemyItem1.earth*enemyStrength + enemyItem2.earth*enemyStrength) - (playerItem1.earthDef*playerDefense + playerItem2.earthDef*playerDefense));
            airDamage = preventNegative((enemyItem1.air*enemyStrength + enemyItem2.air*enemyStrength) - (playerItem1.airDef*playerDefense + playerItem2.airDef*playerDefense));
            lightDamage = preventNegative((enemyItem1.light*enemyStrength + enemyItem2.light*enemyStrength) - (playerItem1.lightDef*playerDefense + playerItem2.lightDef*playerDefense));
            darkDamage = preventNegative((enemyItem1.dark*enemyStrength + enemyItem2.dark*enemyStrength) - (playerItem1.darkDef*playerDefense + playerItem2.darkDef*playerDefense));
            totalDamage = Math.round((physDamage + fireDamage + waterDamage + earthDamage + airDamage + lightDamage + darkDamage) * attackModifier * playerDefenseModifier);
            totalHeal = enemyItem1.heal + enemyItem2.heal
        }
        if (playerItem2 == null && playerItem1 !== null){
            physDamage = preventNegative((enemyItem1.melee*enemyStrength + enemyItem2.melee*enemyStrength) - (playerItem1.meleeDef*playerDefense));
            fireDamage = preventNegative((enemyItem1.fire*enemyStrength + enemyItem2.fire*enemyStrength) - (playerItem1.fireDef*playerDefense));
            waterDamage = preventNegative((enemyItem1.water*enemyStrength + enemyItem2.water*enemyStrength) - (playerItem1.waterDef*playerDefense));
            earthDamage = preventNegative((enemyItem1.earth*enemyStrength + enemyItem2.earth*enemyStrength) - (playerItem1.earthDef*playerDefense));
            airDamage = preventNegative((enemyItem1.air*enemyStrength + enemyItem2.air*enemyStrength) - (playerItem1.airDef*playerDefense));
            lightDamage = preventNegative((enemyItem1.light*enemyStrength + enemyItem2.light*enemyStrength) - (playerItem1.lightDef*playerDefense));
            darkDamage = preventNegative((enemyItem1.dark*enemyStrength + enemyItem2.dark*enemyStrength) - (playerItem1.darkDef*playerDefense));
            totalDamage = Math.round((physDamage + fireDamage + waterDamage + earthDamage + airDamage + lightDamage + darkDamage) * attackModifier * playerDefenseModifier);
            totalHeal = enemyItem1.heal + enemyItem2.heal
        }
        if (totalDamage < 0){
            totalDamage = 0;
        }
        document.getElementById("damageLeft").innerHTML = totalDamage + " DMG"
        var difference = player.hitPoints - totalDamage
        if (difference < 0){
            difference = 0
        }
        var hpAnimation = new CountUp("battleScreenPlayerName", player.hitPoints, difference, 0, 0.5, optionsBattlePlayer);
        hpAnimation.start()
        player.hitPoints = player.hitPoints - totalDamage
        if (enemyItem1.freeze == true || enemyItem2.freeze == true){
            if (firstAttack == "enemy"){
                playerFreeze = true
            }
            else{
                player.frozen = true
            }
            if (enemyItem1.freeze == true){
                document.getElementById("enemyAttackIconRow0").hidden = false
                loadAttackIcons("attackIconsLeft0", enemyItemIndex1, true)
                document.getElementById("enemyAttackText0").innerHTML = enemy.name + " froze you with " + enemyItem1.name + "!"
            }
            else if (enemyItem2.freeze == true){
                document.getElementById("enemyAttackIconRow1").hidden = false
                loadAttackIcons("attackIconsLeft1", enemyItemIndex2, true)
                document.getElementById("enemyAttackText1").innerHTML = enemy.name + " froze you with " + enemyItem2.name + "!"
            }
        }
        if (enemy.hitPoints + totalHeal > enemy.maxHitPoints){
            enemy.hitPoints = enemy.maxHitPoints;
        }
        else{
            enemy.hitPoints = enemy.hitPoints + totalHeal
        }
        if (player.hitPoints < 0){
            player.hitPoints = 0
            updateHP(enemy)
        }
        document.getElementById("enemyHealRow0").hidden = true
        document.getElementById("enemyHealRow1").hidden = true
        if (totalHeal > 0){
            loadAbilityIcons(enemy, enemyItemIndex1, true, true, true)
            loadAbilityIcons(enemy, enemyItemIndex2, true, true, false)
        }
        if(enemyItem1 !== null){
            if (getTotalIcons(enemyItem1, false) > 0){
                document.getElementById("enemyAttackIconRow0").hidden = false
                loadAttackIcons("attackIconsLeft0", enemyItemIndex1, true)
                document.getElementById("enemyAttackText0").innerHTML = enemy.name + " attacked with " + enemyItem1.name + "!"
            }
            if (getTotalIcons(enemyItem2, false) > 0){
                document.getElementById("enemyAttackIconRow1").hidden = false
                loadAttackIcons("attackIconsLeft1", enemyItemIndex2, true)
                document.getElementById("enemyAttackText1").innerHTML = enemy.name + " attacked with " + enemyItem2.name + "!"
            }
            if (getTotalIcons(playerItem1, true) > 0){
                document.getElementById("defenseIconRow0").hidden = false
                loadDefenseIcons("defenseIconsLeft0", playerItemIndex1, false)
                document.getElementById("defenseText0").innerHTML = "You defended with " + playerItem1.name + "!"
            }
        }
        if (playerItem2 !== null){
            if (getTotalIcons(playerItem2, true) > 0){
                document.getElementById("defenseIconRow1").hidden = false
                loadDefenseIcons("defenseIconsLeft1", playerItemIndex2, false)
                document.getElementById("defenseText1").innerHTML = "You defended with " + playerItem2.name + "!"
            }
        }
        if (enemyFreeze == true){
            enemy.frozen = true
        }
        updateHP(enemy)
        document.getElementById("damageRow").hidden = false
    }
    else if (enemy.frozen == true){
        document.getElementById("enemyFreezeRow").hidden = false
        document.getElementById("enemyFreezeText").innerHTML = enemy.name + " is frozen! They cannot attack this turn!"
        enemy.frozen = false
        enemyWasFrozen = true
        if (playerItem1 !== null){
            if (playerItem1.freeze == true){
                enemy.frozen = true
            }
            else if (playerItem2 !== null){
                if (playerItem2.freeze == true){
                    enemy.frozen = true
                }
            }
        }
        updateHP(enemy)
        document.getElementById("damageRow").hidden = false
    }
}

var enemyStanceArr = ["Wild", "Strong", "Steady", "Defensive"]
var enemyStance = "Steady"
var firstAttack = null
var secondAttack = null
function fight(){
    hideAllBattleRows()
    document.getElementById("damageLeft").innerHTML = "0 DMG"
    document.getElementById("damageRight").innerHTML = "0 DMG"
    if (fightEnemyID > 99){
        enemy = secretEnemyList[fightEnemyID - 100]
    }
    else {
        enemy = enemyList[fightEnemyID]
    }
    var enemyWeaponIndexOne = Math.floor(Math.random() * enemy.equipment.length)
    var enemyWeaponIndexTwo = Math.floor(Math.random() * enemy.equipment.length)
    var playerItem1 = selectedItems[0]
    var playerItem2 = null
    enemyStance = enemyStanceArr[Math.floor(Math.random() * enemyStanceArr.length)]
    if (selectedItems[1] !== null){
        playerItem2 = selectedItems[1]
    }
    while (enemyWeaponIndexOne == enemyWeaponIndexTwo){
        enemyWeaponIndexTwo = Math.floor(Math.random() * enemy.equipment.length)
    }
    if (player.frozen){
        playerItem1 = null
        playerItem2 = null
    }
    if (player.speedPoints > enemy.speedPoints){
        firstAttack = "player"
        secondAttack = "enemy"
        document.getElementById("attackOrder").innerHTML = "You have the edge! You attack first!"
        attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        if (enemy.hitPoints > 0){
            enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        }
    }
    else if (player.speedPoints < enemy.speedPoints){
        firstAttack = "enemy"
        secondAttack = "player"
        document.getElementById("attackOrder").innerHTML = enemy.name + " has the edge! " + enemy.name + " attacks first!"
        enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        if (player.hitPoints > 0){
            attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        }
    }
    else{
        var coinFlip = Math.floor(Math.random() * 2);
        if (coinFlip == 0){       
            firstAttack = "enemy"
            secondAttack = "player" 
            document.getElementById("attackOrder").innerHTML = enemy.name + " has the edge! " + enemy.name + " attacks first!"
            enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            if (player.hitPoints > 0){
                attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            }
        }
        else{   
            firstAttack = "player"
            secondAttack = "enemy"     
            document.getElementById("attackOrder").innerHTML = "You have the edge! You attack first!"
            attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            if (enemy.hitPoints > 0){
                enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            }
        }
    }
    checkIfBreakableItems(playerItem1, playerItem2, enemy.equipment[enemyWeaponIndexOne], enemy.equipment[enemyWeaponIndexTwo])
    if (player.hitPoints <= 0){
        document.getElementById("fightButton").disabled = true
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
        document.getElementById("outcomeText").hidden = false
        document.getElementById("outcomeText").innerHTML = "You have been defeated!"
        fighting = false
        postFight = true
        if (fightEnemyID > 99){
            secretEnemyList[fightEnemyID - 100].timesLostTo += 1
            player.secretEnemySaveList[fightEnemyID - 100].timesLostTo += 1
        }
        else{
            enemyList[fightEnemyID].timesLostTo += 1
            player.enemySaveList[fightEnemyID].timesLostTo += 1
            player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = enemyList[fightEnemyID]
        }
        returnBrokenItems()
        returnEnemyBrokenItems(enemy)
        updateEnemyDisplay(enemy)
    }
    else if (enemy.hitPoints <= 0){
        document.getElementById("fightButton").disabled = true
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
        player.exp += enemy.maxHitPoints * (1 + enemy.ID)
        document.getElementById("outcomeText").hidden = false
        document.getElementById("outcomeText").innerHTML = "You are victorious!"
        fighting = false
        if (fightEnemyID > 99){
            secretEnemyList[fightEnemyID - 100].timesDefeated += 1
            player.secretEnemySaveList[fightEnemyID - 100].timesDefeated += 1
            ladderIncrement(secretEnemyList[fightEnemyID - 100])
        }
        else{
            enemyList[fightEnemyID].timesDefeated += 1
            player.enemySaveList[fightEnemyID].timesDefeated += 1
            ladderIncrement(enemyList[fightEnemyID])
            player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = enemyList[fightEnemyID]
        }
        var goldEarned = Math.floor(Math.random() * (enemy.dropMax - enemy.dropMin + 1) + enemy.dropMin) * player.goldGeneratorMulti
        player.gold += goldEarned
        displayGold()
        document.getElementById("outcomeTextGold").hidden = false
        document.getElementById("outcomeTextExp").hidden = false
        document.getElementById("outcomeTextGold").innerHTML = "You earned " + goldEarned + " gold by defeating " + enemy.name + "! You now have " + player.gold + " gold!"
        document.getElementById("outcomeTextExp").innerHTML = "You earned " + enemy.maxHitPoints * (1 + enemy.ID) + " EXP by defeating " + enemy.name + "! You now have " + player.exp + " EXP!"
        returnBrokenItems()
        returnEnemyBrokenItems(enemy)
        updateEnemyDisplay(enemy)
        zoneButtonChecker()
        if (enemy.timesDefeated == 1){
            player.imagePathList.push(enemy.imagePath)
        }
        postFight = true
        if (fightEnemyID >= 100 && secretEnemyList[fightEnemyID - 100].timesDefeated == 2){
            player.inventory.push(player.secretItems[fightEnemyID - 99])
            pushInventoryDisplay(player.inventory.length - 1)
        }
        if (fightEnemyID < 100){
            if ((fightEnemyID + 1) % 3 == 0){
                if (enemyList[fightEnemyID - 1].timesDefeated > 0 && enemyList[fightEnemyID - 2].timesDefeated > 0){
                    if (player.zoneMax == player.currentZone){
                        player.zoneMax += 1
                    }
                }
            }
            else if ((fightEnemyID + 1) % 3 == 2){
                if (enemyList[fightEnemyID - 1].timesDefeated > 0 && enemyList[fightEnemyID + 1].timesDefeated > 0){
                    if (player.zoneMax == player.currentZone){
                        player.zoneMax += 1
                    }
                }
            }
            else if ((fightEnemyID + 1) % 3 == 1){
                if (player.currentZone !== 6){
                    if (enemyList[fightEnemyID + 1].timesDefeated > 0 && enemyList[fightEnemyID + 2].timesDefeated > 0){
                        if (player.zoneMax == player.currentZone){
                            player.zoneMax += 1
                        }
                    }
                }
            }
        }
    }
}

function checkIfBreakableItems(item1, item2, enemyItem1, enemyItem2){
    if (item1 !== null){
        if (item1.oncePerBattle == true){
            breakItemForBattle(item1, false)
        }
    }
    if (item2 !== null){
        if (item2.oncePerBattle == true){
            breakItemForBattle(item2, false)
        }
    }
    if (enemyItem1.oncePerBattle == true){
        breakItemForBattle(enemyItem1, true)
    }
    if (enemyItem2.oncePerBattle == true){
        breakItemForBattle(enemyItem2, true)
    }
}

var brokenItemStorage = []
var enemyItemStorage = []
function breakItemForBattle(item, isEnemy){
    if (!isEnemy){
        var index = player.equipment.indexOf(item)
        brokenItemStorage.push(item)
        selectWeapon(index)
        player.equipment.splice(index, 1)
        document.getElementById("equippedWeapon" + index).style.border = ""
        loadEquipmentForBattle()
    }
    else{
        var index = enemy.equipment.indexOf(item)
        enemyItemStorage.push(item)
        enemy.equipment.splice(index, 1)
    }
}

function returnBrokenItems(){
    for (var i = 0; i < brokenItemStorage.length; i++){
        player.equipment[player.equipment.length] = brokenItemStorage[i]
    }
    brokenItemStorage = []
}

function returnEnemyBrokenItems(enemy){
    for (var i = 0; i < enemyItemStorage.length; i++){
        enemy.equipment[enemy.equipment.length] = enemyItemStorage[i]
    }
    enemyItemStorage = []
}

function ladderIncrement(enemy){
    enemy.maxHitPoints += enemy.ladderValue
    enemy.attackPoints += enemy.ladderValue
    enemy.defensePoints += enemy.ladderValue
    enemy.speedPoints += enemy.ladderValue
}


var tempEnemyList = []
function loadLadderFromWinLoss(){    
    tempEnemyList.length = 0
    for (var i = 0; i < player.enemySaveList.length; i++){
        tempEnemyList.push(enemyList[i])
    }
    clearEnemyList()
    createEnemyList()
    for (var j = 0; j < player.enemySaveList.length; j++){
        if (j < 13){ 
            secretEnemyList[j].timesDefeated = player.secretEnemySaveList[j].timesDefeated
            secretEnemyList[j].timesLostTo = player.secretEnemySaveList[j].timesLostTo
            secretEnemyList[j].discovered = player.secretEnemySaveList[j].discovered
            secretEnemyList[j].maxHitPoints += (secretEnemyList[j].timesDefeated * secretEnemyList[j].ladderValue)
            secretEnemyList[j].attackPoints += (secretEnemyList[j].timesDefeated * secretEnemyList[j].ladderValue)
            secretEnemyList[j].defensePoints += (secretEnemyList[j].timesDefeated * secretEnemyList[j].ladderValue)
            secretEnemyList[j].speedPoints += (secretEnemyList[j].timesDefeated * secretEnemyList[j].ladderValue)
        }
        enemyList[j].timesDefeated = player.enemySaveList[j].timesDefeated
        enemyList[j].timesLostTo = player.enemySaveList[j].timesLostTo
        enemyList[j].discovered = player.enemySaveList[j].discovered
        enemyList[j].maxHitPoints += (enemyList[j].timesDefeated * enemyList[j].ladderValue)
        enemyList[j].attackPoints += (enemyList[j].timesDefeated * enemyList[j].ladderValue)
        enemyList[j].defensePoints += (enemyList[j].timesDefeated * enemyList[j].ladderValue)
        enemyList[j].speedPoints += (enemyList[j].timesDefeated * enemyList[j].ladderValue)
    }
}

function updateEnemyDisplay(enemy){
    displayID = enemy.ID % 3
    if (enemy.discovered == false){
        document.getElementById("enemyDiv" + displayID).style.display = "none"
    }
    else {
        document.getElementById("enemyDiv" + displayID).style.display = "inline-block"
        document.getElementById("enemyScreenHelpText").hidden = false
    }
    document.getElementById("enemy" + displayID).onclick = function(){setupFight(enemy.ID)}
    document.getElementById("enemy" + displayID).src = ""
    document.getElementById("enemy" + displayID).src = enemy.imagePath
    document.getElementById("enemyName" + displayID).innerHTML = enemy.name
    document.getElementById("enemyHitPoints" + displayID).innerHTML = "HP: " + enemy.maxHitPoints   
    document.getElementById("enemyAttack" + displayID).innerHTML = "ATT: " + enemy.attackPoints   
    document.getElementById("enemyDefense" + displayID).innerHTML = "DEF: " + enemy.defensePoints   
    document.getElementById("enemySpeed" + displayID).innerHTML = "SPE: " + enemy.speedPoints
    document.getElementById("enemyWins" + displayID).innerHTML = "WIN: " + enemy.timesDefeated   
    document.getElementById("enemyLosses" + displayID).innerHTML = "LOSS: " + enemy.timesLostTo
}

function hideAllBattleRows(){
    document.getElementById("playerFreezeRow").hidden = true
    document.getElementById("enemyFreezeRow").hidden = true
    document.getElementById("attackIconRow0").hidden = true
    document.getElementById("attackIconRow1").hidden = true
    document.getElementById("enemyAttackIconRow0").hidden = true
    document.getElementById("enemyAttackIconRow1").hidden = true
    document.getElementById("defenseIconRow0").hidden = true
    document.getElementById("defenseIconRow1").hidden = true
    document.getElementById("enemyDefenseIconRow0").hidden = true
    document.getElementById("enemyDefenseIconRow1").hidden = true
    document.getElementById("playerHealRow0").hidden = true
    document.getElementById("playerHealRow1").hidden = true
    document.getElementById("enemyHealRow0").hidden = true
    document.getElementById("enemyHealRow1").hidden = true
    document.getElementById("damageRow").hidden = true
}


function zoneUp(){
    if (player.currentZone < player.zoneMax){
        player.currentZone += 1
    }
    if (player.currentZone == 6){
        document.getElementById("enemyDiv1").style.display = "none"
        document.getElementById("enemyDiv2").style.display = "none"
    }
    loadZone(player.currentZone)
    animateZoneChange()
    var zoneChecker = false
    for (var i = 0; i < 3; i++){
        if (enemyList[(player.currentZone - 1) * 3 + i] !== undefined){
            if (enemyList[(player.currentZone - 1) * 3 + i].discovered == true){
                zoneChecker = true
            }
        }
    }
    if (zoneChecker == true){
        document.getElementById("enemyScreenHelpText").hidden = false
    }
    else {
        document.getElementById("enemyScreenHelpText").hidden = true
    }
}

function zoneDown(){
    if (player.currentZone == 6){
        document.getElementById("enemyDiv1").style.display = "inline-block"
        document.getElementById("enemyDiv2").style.display = "inline-block"
    }
    if (player.currentZone > 1){
        player.currentZone -= 1
    }
    loadZone(player.currentZone)
    animateZoneChange()
}


function loadZone(zone){
    var zoneLoader = player.zones[zone - 1]
    for (var i = 0; i < zoneLoader.enemies.length; i++){
        updateEnemyDisplay(zoneLoader.enemies[i])
    }
    document.getElementById("zoneNumber").innerHTML = "Zone " + (zoneLoader.ID + 1)     
    document.getElementById("zoneName").innerHTML = zoneLoader.name
    document.getElementById("zoneNumberMap").innerHTML = "Zone " + (zoneLoader.ID + 1)     
    document.getElementById("zoneNameMap").innerHTML = zoneLoader.name
    zoneButtonChecker()
}

function zoneButtonChecker(){
    if (player.currentZone == player.zoneMax){
        document.getElementById("ascendButton").className = "mainButtonLayoutDisabled"
        document.getElementById("ascendButton").disabled = true
    }
    else{
        document.getElementById("ascendButton").className = "mainButtonLayout"
        document.getElementById("ascendButton").disabled = false
    }
    if (player.currentZone == 1){
        document.getElementById("descendButton").className = "mainButtonLayoutDisabled"
        document.getElementById("descendButton").disabled = true

    }
    else{
        document.getElementById("descendButton").className = "mainButtonLayout"
        document.getElementById("descendButton").disabled = false
    }
}

updateHTML()

var fightEnemyID = 0
var goldAnimation = null
var expAnimation = null
function setupFight(ID){
    fightEnemyID = ID
    if (ID > 99){
        enemy = secretEnemyList[ID - 100]
    }
    else {
        enemy = enemyList[ID]
        player.enemySaveList[ID].discovered = true
    }
    if (goldAnimation !== null){
        goldAnimation.reset()
    }
    if (expAnimation !== null){
        expAnimation.reset()
    }

        document.getElementById("battleTab").style.display='none'
        document.getElementById("mapTab").style.display='none'
        document.getElementById("fightSetupScreen").style.display='block'    
        document.getElementById("enemyFightImage").src = enemy.imagePath
        document.getElementById("playerFightImage").src = player.imagePath
        document.getElementById("fightScreenEnemyName").innerHTML = enemy.name
        document.getElementById("fightScreenPlayerName").innerHTML = player.name
        if (getEnemyAutoBattleScore(enemy) > getPlayerAutoBattleScore() || enemy.timesDefeated == 0){
            document.getElementById("autoBattleButton").disabled = true
            document.getElementById("autoBattleButton").className = "mainButtonLayoutDisabled"
        }
        else{
            document.getElementById("autoBattleButton").disabled = false
            document.getElementById("autoBattleButton").className = "mainButtonLayout"
        }
        document.getElementById("autoBattlePlayerScore").innerHTML = Number(getPlayerAutoBattleScore()).toFixed(0)
        document.getElementById("autoBattleEnemyScore").innerHTML = getEnemyAutoBattleScore(enemy)
        document.getElementById("autoBattleVictories").innerHTML = "You've won " + enemy.autoBattleVictories + " times!"
        document.getElementById("autoBattleGold").innerHTML = "You've earned " + enemy.autoBattleTotalGold + " gold!"
        document.getElementById("autoBattleExp").innerHTML = "You've earned " + enemy.autoBattleTotalExp + " EXP!"

}

function getEnemyAutoBattleScore(enemy){
    var enemyDamageIcons = 0
    var enemyDefenseIcons = 0
    for (var i = 0; i < enemy.equipment.length; i++){
        enemyDamageIcons += getTotalIcons(enemy.equipment[i], false)
        enemyDefenseIcons += getTotalIcons(enemy.equipment[i], true)
    }
    var enemyTotalStats = enemy.attackPoints + enemy.defensePoints + enemy.maxHitPoints + enemy.speedPoints
    var enemyScore = enemyTotalStats + (enemyDamageIcons * 5) + (enemyDefenseIcons * 5)
    return enemyScore
}

function getPlayerAutoBattleScore(){
    var totalDamageIcons = 0
    var totalDefenseIcons = 0
    for (var i = 0; i < player.equipment.length; i++){
        totalDamageIcons += getTotalIcons(player.equipment[i], false)
        totalDefenseIcons += getTotalIcons(player.equipment[i], true)
    }
    var playerTotalStats = player.attackPoints + player.defensePoints + player.maxHitPoints + player.speedPoints
    var playerScore = playerTotalStats + (totalDamageIcons * 5) + (totalDefenseIcons * 5)
    return playerScore
}

var isLoading = false
function autoBattle(enemy){
    var playerScore = getPlayerAutoBattleScore()
    var enemyScore = getEnemyAutoBattleScore(enemy)
    if (playerScore > enemyScore && isLoading == false){
        enemy.timesDefeated += 1
        player.enemySaveList[enemy.ID].timesDefeated += 1
        var goldEarned = Math.floor(Math.random() * (enemy.dropMax - enemy.dropMin + 1) + enemy.dropMin) * player.goldGeneratorMulti
        player.gold += goldEarned
        displayGold()
        var expEarned = enemy.maxHitPoints * (1 + enemy.ID)
        player.exp += expEarned
        updateHTML()
        enemy.autoBattleVictories += 1
        enemy.autoBattleTotalGold += goldEarned
        enemy.autoBattleTotalExp += expEarned
        ladderIncrement(enemy)
        if (enemy.ID == fightEnemyID){
            document.getElementById("autoBattleVictories").innerHTML = "You've won " + enemy.autoBattleVictories + " times!"
            goldAnimation = new CountUp("autoBattleGold", enemy.autoBattleTotalGold - goldEarned, enemy.autoBattleTotalGold, 0, 1, optionsGold);
            expAnimation = new CountUp("autoBattleExp", enemy.autoBattleTotalExp - expEarned, enemy.autoBattleTotalExp, 0, 1, optionsExp);
            goldAnimation.start()
            expAnimation.start()
            document.getElementById("autoBattleEnemyScore").innerHTML = getEnemyAutoBattleScore(enemy)
        }
        if (Math.floor((enemy.ID ) / 3).toFixed(0) == player.currentZone - 1){
            updateEnemyDisplay(enemy)
        }
        player.zones[Math.floor(enemy.ID / 3)].enemies[enemy.ID % 3] = enemyList[enemy.ID]
        setTimeout(function(){
            if (getEnemyAutoBattleScore(enemy) > getPlayerAutoBattleScore()){
                document.getElementById("autoBattleButton").disabled = true
                document.getElementById("autoBattleButton").className = "mainButtonLayoutDisabled"
            }
            autoBattle(enemy)
        }, 1000)
    }
}

var optionsGold = {
    useEasing: false, 
    useGrouping: true, 
    separator: ',', 
    decimal: '.', 
    prefix: "You've earned ", 
    suffix: " gold!"
};

var optionsExp = {
    useEasing: false, 
    useGrouping: true, 
    separator: ',', 
    decimal: '.', 
    prefix: "You've earned ",
    suffix: " EXP!" 
};

function upgradeGoldGenerator(){
    if (player.availableAP >= player.goldGeneratorUpgradeCost && powerTrainCooldown == false && player.goldGeneratorLevel < 5){   
        player.availableAP -= player.goldGeneratorUpgradeCost
        player.goldGeneratorUpgradeCost += 1
        player.goldGeneratorLevel += 1
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("goldGeneratorLevelCurrent").innerHTML = "Current Gold Generator Level: " + numberWithCommas(player.goldGeneratorLevel)
        if (player.goldGeneratorLevel < 5){
            document.getElementById("upgradeGoldGeneratorButton").innerHTML = "+1 Gold Generator Level: " + player.goldGeneratorUpgradeCost + " AP"
        }
        else{
            document.getElementById("upgradeGoldGeneratorButton").innerHTML = "Gold Generator Level Maxed"
            document.getElementById("upgradeGoldGeneratorButton").className = "mainButtonLayoutDisabled"
            document.getElementById("upgradeGoldGeneratorButton").disabled = true
        }
    }
}

function upgradeGoldGeneratorMulti(){
    if (player.availableAP >= player.goldGeneratorMultiUpgradeCost && powerTrainCooldown == false){   
        player.availableAP -= player.goldGeneratorMultiUpgradeCost
        player.goldGeneratorMultiUpgradeCost += 5
        player.goldGeneratorMulti += 1
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("goldGeneratorMultiCurrent").innerHTML = "Current Gold Multiplier: " + numberWithCommas(player.goldGeneratorMulti)
        document.getElementById("upgradeGoldGeneratorMultiButton").innerHTML = "+1x Gold Generator Multiplier: " + player.goldGeneratorMultiUpgradeCost + " AP"
    }
}

var overpowered = false
function godMode(){
    if (!overpowered){
        player.gold = 10000000
        player.maxHitPoints = 100000
        player.attackPoints = 10000
        player.defensePoints = 10000
        player.speedPoints = 10000
        player.statPoints = 10000
        player.maxStatPoints = 10000
        player.zoneMax = 6
        player.secretItems[0].heal = Math.round(player.maxHitPoints / 10)
        player.secretItems[11].heal = Math.round(player.maxHitPoints / 20)
        player.secretItems[12].heal = Math.round(player.maxHitPoints /20)
        player.secretItems[13].heal = player.maxHitPoints
        for (var i = 0; i < player.allItems.length; i++){
            buyItem(i)
        }
        for (var j = 0; j < player.secretItems.length; j++){
            player.inventory.push(player.secretItems[j])
            pushInventoryDisplay(player.inventory.length - 1)
        }
        for (var i = player.inventory.length - 8; i < player.inventory.length; i++){
            setSelected(i)
        }
        updateHTML()
        overpowered = true
        console.log("Way to ruin the game, hotshot.")
    }
    else{
        console.log("Aren't you overpowered enough?")
    }
}

function enterMinigame(){
    return show('minigameTab','mapTab','shopTab','trainingTab','battleTab','fightSetupScreen','playerTab')
}

function populateMapGrid(){
    for (var i = 0; i < 60; i++){
        var cell = document.createElement("div");
        cell.style = "background-color: green"
        cell.src = ""
        cell.id = "mapGrid" + i
        if (i % 10 == 0 || i % 10 == 9){
            if (i !== 20 && i !== 30 && i !== 29 && i !== 39){
                cell.style = "background-image: linear-gradient(to bottom right, grey, black"
            }
        }
        var image = document.createElement("img");
        image.id = "imageGrid" + i
        image.style = "width: 60px; height: 60px"
        image.src = "/images/icons/transparent.png"
        cell.appendChild(image)
        document.getElementById("mapGrid").appendChild(cell)
    }
    for (var j = 0; j < 10; j++){
        var cellUp = document.createElement("div");
        cellUp.style = "background-image: linear-gradient(to bottom right, grey, black"
        cellUp.id = "zoneUpGrid" + j
        document.getElementById("zoneUpGrid").appendChild(cellUp)
        var cellDown = document.createElement("div");
        cellDown.style = "background-image: linear-gradient(to bottom right, grey, black"
        cellDown.id = "zoneDownGrid" + j
        document.getElementById("zoneDownGrid").appendChild(cellDown)
    }
}
populateMapGrid()

var currentX = 1
var currentY = 0
var leftFacing = false
function placeOnGrid(){
    if (leftFacing == true){
        document.getElementById("imageGrid" + ((5 - currentY) * 10 + currentX)).style = "width: 60px; height: 60px; -webkit-transform: scaleX(-1); transform: scaleX(-1);"
    }
    else{
        document.getElementById("imageGrid" + ((5 - currentY) * 10 + currentX)).style = "width: 60px; height: 60px;"
    }
    document.getElementById("imageGrid" + ((5 - currentY) * 10 + currentX)).src = player.imagePath
}
placeOnGrid()

function clearCurrentGridSpace(){
    document.getElementById("imageGrid" + ((5 - currentY) * 10 + currentX)).src = "/images/icons/transparent.png"
}

var onMap = false
function enableMove(){
    onMap = true
    if (player.currentZone < player.zoneMax){
        document.getElementById("zoneUpGrid4").style = player.zones[player.currentZone - 1].color
        document.getElementById("zoneUpGrid5").style = player.zones[player.currentZone - 1].color
    }
}

function move(direction){
    if (direction == "up"){
        if (player.currentZone < player.zoneMax && currentY == 5 && (currentX == 4 || currentX == 5)){
            clearCurrentGridSpace()
            currentY = 0
            zoneUp()
        }
        else if (currentY < 5){
            clearCurrentGridSpace()
            currentY += 1
            placeOnGrid()
        }
    }
    if (direction == "left"){
        if (currentX == 1){
            if (currentY == 2 || currentY == 3){
                clearCurrentGridSpace()
                currentX = 8
                animateZoneChange()
            }
        }
        else if (currentX > 1){      
            clearCurrentGridSpace()
            currentX -= 1
            leftFacing = true
            placeOnGrid() 
        }
    }
    if (direction == "down"){
        if (player.currentZone > 1 && currentY == 0 && (currentX == 4 || currentX == 5)){
            clearCurrentGridSpace()
            currentY = 5
            zoneDown()
        }
        else if (currentY > 0){
            clearCurrentGridSpace()
            currentY -= 1
            placeOnGrid()
        }
    }
    if (direction == "right"){
        if (currentX == 8){
            if (currentY == 2 || currentY == 3){
                clearCurrentGridSpace()
                currentX = 1
                animateZoneChange()
            }
        }
        else if (currentX < 8){
            clearCurrentGridSpace()
            currentX += 1
            leftFacing = false
            placeOnGrid()
        }
    }
    for (var i = 0; i < mapEnemies.length; i++){
        if (((5 - currentY) * 10 + currentX) == mapEnemies[i].location){
            setupFight(mapEnemies[i].ID)
            if (mapEnemies[i].ID < 100){
                enemyList[mapEnemies[i].ID].discovered = true
                updateEnemyDisplay(enemyList[mapEnemies[i].ID])
            }
            mapEnemies.splice(i, 1)
            if (mapEnemies.length == 0){
                respawnEnemies()
            }
            onMap = false
        }
    }
}

var mapEnemies = []
function addMapEnemyData(location, ID){
    var mapEnemyData = {
        location: location,
        ID: ID
    }
    mapEnemies.push(mapEnemyData)
}

function spawnEnemy(enemy){
    var startingX = Math.floor(Math.random() * 8) + 1
    var startingY = Math.floor(Math.random() * 6) 
    while (startingX == currentX && startingY == currentY){
        startingX = Math.floor(Math.random() * 8) + 1
        startingY = Math.floor(Math.random() * 6) 
    }
    var location = (5-startingY) * 10 + startingX
    if (mapEnemies[0] !== undefined && mapEnemies[1] == undefined){
        while (mapEnemies[0].location == location){
            startingX = Math.floor(Math.random() * 8) + 1
            startingY = Math.floor(Math.random() * 6)   
            location = (5-startingY) * 10 + startingX
        }
    }
    else if (mapEnemies[0] !== undefined && mapEnemies[1] !== undefined && mapEnemies[2] == undefined){
        while (mapEnemies[0].location == location || mapEnemies[1].location == location){
            startingX = Math.floor(Math.random() * 8) + 1
            startingY = Math.floor(Math.random() * 6)    
            location = (5-startingY) * 10 + startingX
        }
    }
    else if (mapEnemies[0] !== undefined && mapEnemies[1] !== undefined && mapEnemies[2] !== undefined){
        while (mapEnemies[0].location == location || mapEnemies[1].location == location || mapEnemies[2].location == location){
            startingX = Math.floor(Math.random() * 8) + 1
            startingY = Math.floor(Math.random() * 6)    
            location = (5-startingY) * 10 + startingX
        }
    }
    document.getElementById("imageGrid" + location).src = enemy.imagePath
    addMapEnemyData(location, enemy.ID)
}

function despawnEnemies(){
    mapEnemies.length = 0
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < 6; j++){
            if ((5-j) * 10 + i !== (5-currentY) * 10 + currentX){
                document.getElementById("imageGrid" + ((5 - j) * 10 + i)).src = "/images/icons/transparent.png"
            }
        }
    }
}

function respawnEnemies(){
    despawnEnemies()
    for (var i = 0; i < player.zones[player.currentZone - 1].enemies.length; i++){
        enemy = player.zones[player.currentZone - 1].enemies[i]
        spawnEnemy(enemy)
    }
}

function spawnRandom(){
    enemyOne = secretEnemyList[2 * player.currentZone - 1]
    enemyTwo = secretEnemyList[2 * player.currentZone - 2]
    if (Math.floor(Math.random() * (1 * enemyOne.rarity)) == 0){
        spawnEnemy(enemyOne)
    }
    if (Math.floor(Math.random() * (1 * enemyTwo.rarity)) == 0){
        spawnEnemy(enemyTwo)
    }
    if (player.currentZone == 6 && enemyOne.timesDefeated > 0 && enemyTwo.timesDefeated > 0){
        enemyThree = secretEnemyList[2 * player.currentZone]
        if (Math.floor(Math.random() * (1 * enemyThree.rarity)) == 0){
            spawnEnemy(enemyThree)
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (onMap == true){
        if (e.keyCode === 87){
            move("up")
        }
        else if (e.keyCode === 65){
            move("left")
        }
        else if (e.keyCode === 83){
            move("down")
        }
        else if (e.keyCode === 68){
            move("right")
        }
    }
})

function animateZoneChange(){
    if (player.currentZone == player.zoneMax){
        document.getElementById("zoneUpGrid4").style = "background-image: linear-gradient(to bottom right, grey, black"
        document.getElementById("zoneUpGrid5").style = "background-image: linear-gradient(to bottom right, grey, black"
    }
    else if (player.currentZone == 1){
        document.getElementById("zoneDownGrid4").style = "background-image: linear-gradient(to bottom right, grey, black"
        document.getElementById("zoneDownGrid5").style = "background-image: linear-gradient(to bottom right, grey, black"
    }
    onMap = false
    despawnEnemies()
    setTimeout(function(){
        for (var j = 0; j < 10; j++){
            document.getElementById("zoneUpGrid" + j).style = "background-color: black"
        }
    }, 25)
    setTimeout(function(){
        for (var i = 0; i < 10; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 50)
    setTimeout(function(){
        for (var i = 10; i < 20; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 75)
    setTimeout(function(){
        for (var i = 20; i < 30; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 100)
    setTimeout(function(){
        for (var i = 30; i < 40; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 125)
    setTimeout(function(){
        for (var i = 40; i < 50; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 150)
    setTimeout(function(){
        for (var i = 50; i < 60; i++){
            document.getElementById("mapGrid" + i).style = "background-color: black"
        }
    }, 175)
    setTimeout(function(){
        for (var j = 0; j < 10; j++){
            document.getElementById("zoneDownGrid" + j).style = "background-color: black"
        }
    }, 200)
    setTimeout(function(){
        for (var j = 0; j < 10; j++){
            document.getElementById("zoneUpGrid" + j).style = "background-image: linear-gradient(to bottom right, grey, black"
        }
        if (player.currentZone !== player.zoneMax){
            document.getElementById("zoneUpGrid4").style = player.zones[player.currentZone - 1].color
            document.getElementById("zoneUpGrid5").style = player.zones[player.currentZone - 1].color
        }
    }, 225)
    setTimeout(function(){
        for (var i = 0; i < 10; i++){
            if (i == 0 || i == 9){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            else{
                document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
            }
        }
    }, 250)
    setTimeout(function(){
        for (var i = 10; i < 20; i++){
            if (i == 10 || i == 19){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            else{
                document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
            }
        }
    }, 275)
    setTimeout(function(){
        for (var i = 20; i < 30; i++){
            if (i == 20 || i == 29){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
        }
    }, 300)
    setTimeout(function(){
        for (var i = 30; i < 40; i++){
            if (i == 30 || i == 39){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
        }
    }, 325)
    setTimeout(function(){
        for (var i = 40; i < 50; i++){
            if (i == 40 || i == 49){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            else{
                document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
            }
        }
    }, 350)
    setTimeout(function(){
        for (var i = 50; i < 60; i++){
            if (i == 50 || i == 59){
                document.getElementById("mapGrid" + i).style = "background-image: linear-gradient(to bottom right, grey, black"
            }
            else{
                document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
            }
        }
    }, 375)
    setTimeout(function(){
        for (var i = 30
            ; i < 36; i++){
            document.getElementById("mapGrid" + i).style = player.zones[player.currentZone - 1].color
        }
    }, 400)
    setTimeout(function(){
        for (var j = 0; j < 10; j++){
            document.getElementById("zoneDownGrid" + j).style = "background-image: linear-gradient(to bottom right, grey, black"
        }
        if (player.currentZone !== 1){
            document.getElementById("zoneDownGrid4").style = player.zones[player.currentZone - 1].color
            document.getElementById("zoneDownGrid5").style = player.zones[player.currentZone - 1].color
        }
        placeOnGrid()
        onMap = true        
        respawnEnemies()
        spawnRandom()
    }, 425)
}

function generateMinigameGrid(){
    for (var i = 0; i < 192; i++){
        var cell = document.createElement("div")
        cell.style = "height: 10px; width: 75px"
        cell.id = "minigameGrid" + i
        document.getElementById("minigameGrid").appendChild(cell)
    }
}
generateMinigameGrid()

var currentValuesColumnOne = []
var currentValuesColumnTwo = []
var currentValuesColumnThree = []
var currentValuesColumnFour = []
var currentValuesArray = [currentValuesColumnOne, currentValuesColumnTwo, currentValuesColumnThree, currentValuesColumnFour]
function animateSquareDrop(rowCounter, minigameColumn){
    setTimeout(function(){            
        if (rowCounter > 3){
            
            document.getElementById("minigameGrid" + (((rowCounter - 4) * 4) + minigameColumn)).style = "height: 10px; width: 75px; background-color: rgb(10, 10, 10)"
            currentValuesArray[minigameColumn].shift()
        }
        if (rowCounter < 49){
            document.getElementById("minigameGrid" + ((rowCounter * 4) + minigameColumn)).style = "height: 10px; width: 75px; background-color: rgb(60, 60, 60)"
            currentValuesArray[minigameColumn].push((rowCounter * 4) + minigameColumn)
        }
    }, 50 * rowCounter / minigameSpeed)   
}

function minigameColumnOne(){
    var rowCounterOne = 0
    while(rowCounterOne * 4 < 212){
        animateSquareDrop(rowCounterOne, 0)
        rowCounterOne+= 1
    }
}

function minigameColumnTwo(){
    var rowCounterTwo = 0
    while(rowCounterTwo * 4 < 212){
        animateSquareDrop(rowCounterTwo, 1)
        rowCounterTwo+= 1
    }
}

function minigameColumnThree(){
    var rowCounterThree = 0
    while(rowCounterThree * 4 < 212){
        animateSquareDrop(rowCounterThree, 2)
        rowCounterThree+= 1
    }
}

function minigameColumnFour(){
    var rowCounterFour = 0
    while(rowCounterFour * 4 < 212){
        animateSquareDrop(rowCounterFour, 3)
        rowCounterFour+= 1
    }
}

function chooseColumn(column){
    if (column == 0){
        minigameColumnOne()
    }
    if (column == 1){
        minigameColumnTwo()
    }
    if (column == 2){
        minigameColumnThree()
    }
    if (column == 3){
        minigameColumnFour()
    }
}

var minigameLimit = 0
function recursiveRandomColumn(newBlockSpeed){
    if (minigameLimit < 100){
        var column = Math.floor(Math.random() * 4)
        chooseColumn(column)
        minigameLimit += 1
        setTimeout(function(){
            recursiveRandomColumn(newBlockSpeed)
        }, newBlockSpeed)
    }
}

function resetMinigame(start, newBlockSpeed){
    endMinigame()
    setTimeout(function(){
        resetMinigameLimit()
        if (start == true && newBlockSpeed !== undefined){
            recursiveRandomColumn(newBlockSpeed)
        }
    }, 500)
}

var minigameRunning = false
function runMinigame(){
    resetCurrentMinigameScore()
    endMinigame()
    minigameRunning = true
    document.getElementById("minigameSpeedButton").disabled = true
    setTimeout(function(){
        var newBlockSpeed = document.getElementById("minigameSpeedBox").value
        if (newBlockSpeed > 249){
            resetMinigame(true, newBlockSpeed)
        }
    }, 500)
    setTimeout(function(){
        document.getElementById("minigameSpeedButton").disabled = false
    }, 1000)
}

function endMinigame(){
    minigameLimit = 999
}

function resetMinigameLimit(){
    minigameLimit = 0
}

function checkIfTimedCorrectly(minigameColumn){
    if (currentValuesArray[minigameColumn].includes(180 + minigameColumn)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    else if (currentValuesArray[minigameColumn].includes(180 + minigameColumn - 4)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    else if (currentValuesArray[minigameColumn].includes(180 + minigameColumn + 4)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    else if (currentValuesArray[minigameColumn].includes(180 + minigameColumn + 8)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    else if (currentValuesArray[minigameColumn].includes(180 + minigameColumn + 12)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    else if (currentValuesArray[minigameColumn].includes(180 + minigameColumn + 16)){
        currentScore += 1
        document.getElementById("currentMinigameScore").innerHTML = currentScore
        return true
    }
    return false
}

var currentScore = 0
function resetCurrentMinigameScore(){
    currentScore = 0
    document.getElementById("currentMinigameScore").innerHTML = currentScore
}

var columnColours = ["rgb(0, 200, 0", "rgb(200, 100, 200)", "rgb(50, 100, 200)", "rgb(200, 100, 0)"]
function setColumnColoursOnPress(column){
    for (var i = 0; i < 3; i++){
        document.getElementById("minigameGrid" + ((180 + column) + (i*4))).style.backgroundColor = columnColours[column]
    }
    setTimeout(function(){
        for (var i = 0; i < 3; i++){
            document.getElementById("minigameGrid" + ((180 + column) + (i*4))).style = "height: 10px; width: 75px; background-color: rgb(200, 200, 200); border-right: 1px solid white; border-left: 1px solid white"
        }
    }, 100)
}

document.addEventListener('keyup', (e) => {
    if (minigameRunning == true){        
        if (e.keyCode === 72){
            setColumnColoursOnPress(0)
            if (!checkIfTimedCorrectly(0)){
                currentScore -= 1
                document.getElementById("currentMinigameScore").innerHTML = currentScore
            }
        }
        else if (e.keyCode === 74){
            setColumnColoursOnPress(1)
            if (!checkIfTimedCorrectly(1)){
                currentScore -= 1
                document.getElementById("currentMinigameScore").innerHTML = currentScore
            }        
        }
        else if (e.keyCode === 75){
            setColumnColoursOnPress(2)
            if (!checkIfTimedCorrectly(2)){
                currentScore -= 1
                document.getElementById("currentMinigameScore").innerHTML = currentScore
            }  
        }
        else if (e.keyCode === 76){
            setColumnColoursOnPress(3)
            if (!checkIfTimedCorrectly(3)){
                currentScore -= 1
                document.getElementById("currentMinigameScore").innerHTML = currentScore
            }
        }
    }
})

var minigameSpeed = 1
var minigameCounter = 0
var minigameModulus = 5
function runSimMinigame(minigameSpeed, minigameModulus){
    minigameCounter = 0
    simulateMinigame(minigameSpeed, minigameModulus)
}

function simulateMinigame(minigameSpeed, minigameModulus){
    setTimeout(function(){
        if (minigameCounter % minigameModulus == 0){
            document.getElementById("minigameGrid" + minigameCounter * 4).style = "height: 10px; width: 75px; background-color: rgb(30, 30, 30)"
        }
        else{
            document.getElementById("minigameGrid" + minigameCounter * 4).style = "height: 10px; width: 75px; background-color: rgb(10, 10, 10)" 
        }
        if ((minigameCounter + 1) % minigameModulus == 0){
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 1)).style = "height: 10px; width: 75px; background-color: rgb(30, 30, 30)"
        }
        else{
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 1)).style = "height: 10px; width: 75px; background-color: rgb(10, 10, 10)" 
        }
        if ((minigameCounter + 2) % minigameModulus == 0){
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 2)).style = "height: 10px; width: 75px; background-color: rgb(30, 30, 30)"
        }
        else{
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 2)).style = "height: 10px; width: 75px; background-color: rgb(10, 10, 10)" 
        }
        if ((minigameCounter + 3) % minigameModulus == 0){
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 3)).style = "height: 10px; width: 75px; background-color: rgb(30, 30, 30)"
        }
        else{
            document.getElementById("minigameGrid" + (minigameCounter * 4 + 3)).style = "height: 10px; width: 75px; background-color: rgb(10, 10, 10)" 
        }
        minigameCounter += 1
        if (minigameCounter < 48){
            simulateMinigame(minigameSpeed, minigameModulus)
        }
    }, minigameSpeed)
}