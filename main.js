var player = {
    name: "",
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
    gold: 0,
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
    enemyList: [],
    allItems: [],
    currentZone: 1,
    zoneMax: 1,
    zones: []
}

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
                player.maxHitPoints += 1
                player.allItems[14].heal = Math.round(player.maxHitPoints / 20)
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
                player.attackPoints += 1
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
                player.defensePoints += 1
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
                player.speedPoints += 1
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
        powerTrainCooldown = true
        updateHTML()
        document.getElementById("powerTrainButton").disabled = true
        document.getElementById("powerTrainButton").style = "background-color: #474646; color: #373636; height: 75px; width: 300px; font-size: 40px"
        document.getElementById("buyAPButton").disabled = true
        document.getElementById("buyAPButton").style = "background-color: #474646; color: #373636"
        document.getElementById("saveButton").disabled = true
        document.getElementById("saveButton").style = "background-color: #474646; color: #373636"   
        document.getElementById("loadButton").disabled = true
        document.getElementById("loadButton").style = "background-color: #474646; color: #373636"
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
            player.upgradesBought = 0
            document.getElementById("buyAPButton").disabled = false
            document.getElementById("buyAPButton").style = "color: #ac9444; background-color: #335C81"
            document.getElementById("powerTrainButton").innerHTML = "Power Train"
            document.getElementById("powerTrainButton").disabled = false
            document.getElementById("powerTrainButton").style = "color: #ac9444; background-color: #335C81; height: 75px; width: 300px; font-size: 40px"    
            document.getElementById("saveButton").disabled = false
            document.getElementById("saveButton").style = "color: #ac9444; background-color: #335C81"
            document.getElementById("loadButton").disabled = false
            document.getElementById("loadButton").style = "color: #ac9444; background-color: #335C81"
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
        player.training -= player.buyAPCost
        player.availableAP += 1
        player.totalAP += 1
        player.buyAPCost *= 1.2
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
    if (player.availableAP > 9 && player.autoUpgrade == false){  
        player.availableAP -= 10
        player.autoUpgrade = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Purchased"
        document.getElementById("toggleAutoUpgradeButton").hidden = false
    }
}

function buyAutoPurchaseAP(){
    if (player.availableAP > 9 && player.autoPurchaseAP == false){
        player.availableAP -= 10
        player.autoPurchaseAP = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase AP Purchased"
        document.getElementById("toggleAutoPurchaseAPButton").hidden = false
    }
}

function buyAutoPurchaseStatPoints(){
    if (player.availableAP > 9 && player.autoPurchaseStatPoints == false){
        player.availableAP -= 10
        player.autoPurchaseStatPoints = true
        document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
        document.getElementById("buyAutoPurchaseStatPointsButton").innerHTML = "Auto Purchase Stat Points Purchased"
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
        player.trainingPointBoostCost *= 2
        player.idleUpgradeMultiplier += 1
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

        setTimeout(function(){
            updateHTML()
            document.getElementById("trainingTab").hidden = false
            document.getElementById("battleTab").hidden = false
            document.getElementById("shopTab").hidden = false
            document.getElementById("loadingText").hidden = true
            if (player.autoUpgrade == true){
                document.getElementById("buyAutoUpgradeButton").innerHTML = "Auto Upgrade Purchased"
                document.getElementById("toggleAutoUpgradeButton").hidden = false
            }
            if (player.autoPurchaseAP == true){
                document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase AP Purchased"
                document.getElementById("toggleAutoPurchaseAPButton").hidden = false
            }
            if (player.autoPurchaseStatPoints == true){
                document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Auto Purchase Stat Points Purchased"
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
            }
            player.equipment = []
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
    var costOfAPShown = Number(player.buyAPCost).toFixed(0)
    var statPointCostShown = Number(player.statPointCost).toFixed(0)
    var goldShown = Number(player.gold).toFixed(0)
    if (!powerTrainCooldown){
        document.getElementById("battlePowerPerSecond").innerHTML = numberWithCommas(trainingPerSecondShown) + " Training Points per second!"   
    }
    if (player.autoPurchaseAP == false){
        document.getElementById("buyAutoPurchaseAPButton").innerHTML = "Buy AutoPurchase for AP: 10 AP"
    }
    if (player.autoUpgrade == false){
        document.getElementById("buyAutoUpgradeButton").innerHTML = "Buy Auto Upgrade: 10 AP"
    }
    document.getElementById("currentTrainingPoints").innerHTML = "Training Points<br/><br/>" + numberWithCommas(trainingShown)
    document.getElementById("textAPTotal").innerHTML = "AP Total: " + numberWithCommas(player.totalAP)
    document.getElementById("textAPAvailable").innerHTML = "AP Available: " + numberWithCommas(player.availableAP)
    document.getElementById("buyAPButton").innerHTML = "Prestige to get 1 AP<br/>" + numberWithCommas(costOfAPShown) + " Training Points" 
    document.getElementById("buyStatPointButton").innerHTML = "Buy Stat Point<br/>" + numberWithCommas(statPointCostShown) + " Training Points"
    document.getElementById("perClickUpgrade").innerHTML = "Increase Training Level<br/>" + numberWithCommas(player.trainingPerClickCost) + " Training Points"
    document.getElementById("buyLevelUpButton").innerHTML = "EXP Level Up<br/>" + numberWithCommas(player.levelUpCost) + " EXP"
    document.getElementById("currentEXP").innerHTML = "EXP<br/><br/>" + player.exp + "/" + player.levelUpCost
    document.getElementById("currentLevel").innerHTML = "Level<br/><br/>" + player.level
    document.getElementById("currentHPStat").innerHTML = player.maxHitPoints + " HP"
    document.getElementById("currentAttackStat").innerHTML = player.attackPoints + " Attack"
    document.getElementById("currentDefenseStat").innerHTML = player.defensePoints + " Defense"
    document.getElementById("currentSpeedStat").innerHTML = player.speedPoints + " Speed"
    document.getElementById("currentGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
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

function createEnemy(ID, name, hitPoints, attackPoints, defensePoints, speedPoints, imagePath, ladderValue, timesDefeated, timesLostTo, equipment, dropMin, dropMax) {
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
        frozen: false
    }
    player.enemyList[player.enemyList.length] = enemy
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
    return item;
}

function createZone(ID, name, enemies){
    var zone = {
        ID: ID,
        name: name,
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

function itemLevelUp(item){
    item.level += 1
    var iconTotal = getTotalIcons(item)
    var divider = iconTotal / 5
    if (item.fire > 0){
        var percentageFire = item.fire / iconTotal
        item.fire += Math.round(divider * percentageFire)
    }
    if (item.air > 0){
        var percentageAir = item.air / iconTotal
        item.air += Math.round(divider * percentageAir)
    }
    if (item.earth > 0){
        var percentageEarth = item.earth / iconTotal
        item.earth += Math.round(divider * percentageEarth)
    }
    if (item.water > 0){
        var percentageWater = item.water / iconTotal
        item.water += Math.round(divider * percentageWater)
    }
    if (item.melee > 0){
        var percentageMelee = item.melee / iconTotal
        item.melee += Math.round(divider * percentageMelee)
    }
    if (item.light > 0){
        var percentageLight = item.light / iconTotal
        item.light += Math.round(divider * percentageLight)
    }
    if (item.dark > 0){
        var percentageDark = item.dark / iconTotal
        item.dark += Math.round(divider * percentageDark)
    }
}

function pushInventoryDisplay(index){ 
    var cell = document.createElement("div");
    var figure = document.createElement("figure")
    var caption = document.createElement("figcaption")
    var image = document.createElement("img")
    cell.style = "width: 180px"
    cell.id = "inventory" + index
    image.src = player.inventory[index].imagePath
    image.className = "itemImages"
    caption.innerHTML = player.innerHTML = player.inventory[index].name  
    caption.className = "itemText"
    caption.style = "width: 100px; align-content: center"
    figure.appendChild(image)
    figure.appendChild(caption)
    cell.appendChild(figure)
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
        prefix: "Player<br/>",
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
        document.getElementById("inventory" + i).style.border=""
    }
    if (!isEquipped){
        if (player.equipment.length < 8){  
            player.equipment.push(player.inventory[i])
            document.getElementById("inventory" + i).style.border="1px solid white"
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
    var enemy = player.enemyList[fightEnemyID]
    document.getElementById("enemyBattleImage").src = enemy.imagePath
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
    document.getElementById("battleScreenPlayerName").innerHTML = "Player <br/>" + player.hitPoints + "/" + player.maxHitPoints
}

function loadEquipmentForBattle(){
    for (var i = 0; i < 8; i++){
        if (player.equipment[i]){
            document.getElementById("equippedWeapon" + i).src = player.equipment[i].imagePath
        }
        else{
            document.getElementById("equippedWeapon" + i).src = " "
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
    if (enemy.frozen){
        enemyItem1 = enemyWeapons[64]
        enemyItem2 = enemyWeapons[64]
    }
    if (player.frozen){
        playerItem1 = enemyWeapons[64]
        playerItem2 = enemyWeapons[64]
    }
    enemyFreeze = false
    if (!player.frozen){
        var playerStrength = determineTier(player.attackPoints);
        var enemyDefense = determineTier(enemy.defensePoints);
        var attackModifier = determineModifier(player.currentStance);
        var enemyDefenseModifier = determineModifier(enemyStance);
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
                if (player.speedPoints > enemy.speedPoints){
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
            if (getTotalIcons(playerItem1, true) > 0){
                document.getElementById("defenseIconRow0").hidden = false
                loadDefenseIcons("defenseIconsLeft0", playerItemIndex1, false)
                document.getElementById("defenseText0").innerHTML = "You defended with " + playerItem1.name + "!"
            }
        }
        if (playerItem2 !== null){
            if (getTotalIcons(playerItem2, false) > 0){
                document.getElementById("attackIconRow1").hidden = false
                loadAttackIcons("attackIconsRight1", playerItemIndex2, false)
                document.getElementById("attackText1").innerHTML = "You attacked with " + playerItem2.name + "!"
            }
            if (getTotalIcons(playerItem2, true) > 0){
                document.getElementById("defenseIconRow1").hidden = false
                loadDefenseIcons("defenseIconsLeft1", playerItemIndex2, false)
                document.getElementById("defenseText1").innerHTML = "You defended with " + playerItem2.name + "!"
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
        updateHP(enemy)
        document.getElementById("damageRow").hidden = false
    }
}

var playerFreeze = false
function enemyAttack(enemy, playerItem1, playerItem2, enemyItemIndex1, enemyItemIndex2){
    playerFreeze = false
    if (enemy.frozen == false){
        var enemyStrength = determineTier(enemy.attackPoints);
        var playerDefense = determineTier(player.defensePoints);
        var attackModifier = determineModifier(enemyStance);
        var playerDefenseModifier = determineModifier(player.currentStance);
        var totalHeal = 0;
        var totalDamage = 0;
        var enemyItem1 = enemy.equipment[enemyItemIndex1]
        var enemyItem2 = enemy.equipment[enemyItemIndex2]
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
            if (enemy.speedPoints > player.speedPoints){
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
            if (getTotalIcons(enemyItem1, true) > 0){
                document.getElementById("enemyDefenseIconRow0").hidden = false
                loadDefenseIcons("enemyDefenseIconsRight0", enemyItemIndex1, true)
                document.getElementById("enemyDefenseText0").innerHTML = enemy.name + " defended with " + enemyItem1.name + "!"
            }
        }
        if (enemyItem2 !== null){
            if (getTotalIcons(enemyItem2, false) > 0){
                document.getElementById("enemyAttackIconRow1").hidden = false
                loadAttackIcons("attackIconsLeft1", enemyItemIndex2, true)
                document.getElementById("enemyAttackText1").innerHTML = enemy.name + " attacked with " + enemyItem2.name + "!"
            }
            if (getTotalIcons(enemyItem2, true) > 0){
                document.getElementById("enemyDefenseIconRow1").hidden = false
                loadDefenseIcons("enemyDefenseIconsRight1", enemyItemIndex2, true)
                document.getElementById("enemyDefenseText1").innerHTML = enemy.name + " defended with " + enemyItem2.name + "!"
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
function fight(){
    hideAllBattleRows()
    document.getElementById("damageLeft").innerHTML = "0 DMG"
    document.getElementById("damageRight").innerHTML = "0 DMG"
    enemy = player.enemyList[fightEnemyID]
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
        document.getElementById("attackOrder").innerHTML = "You have the edge! You attack first!"
        attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        if (enemy.hitPoints > 0){
            enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        }
    }
    else if (player.speedPoints < enemy.speedPoints){
        document.getElementById("attackOrder").innerHTML = enemy.name + " has the edge! " + enemy.name + " attacks first!"
        enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        if (player.hitPoints > 0){
            attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
        }
    }
    else{
        var coinFlip = Math.floor(Math.random() * 2);
        if (coinFlip == 0){        
            document.getElementById("attackOrder").innerHTML = enemy.name + " has the edge! " + enemy.name + " attacks first!"
            enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            if (player.hitPoints > 0){
                attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            }
        }
        else{        
            document.getElementById("attackOrder").innerHTML = "You have the edge! You attack first!"
            attack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            if (enemy.hitPoints > 0){
                enemyAttack(enemy, playerItem1, playerItem2, enemyWeaponIndexOne, enemyWeaponIndexTwo, "Berserk", "Berserk")
            }
        }
    }
    if (player.hitPoints <= 0){
        document.getElementById("fightButton").disabled = true
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
        document.getElementById("outcomeText").hidden = false
        document.getElementById("outcomeText").innerHTML = "You have been defeated!"
        fighting = false
        postFight = true
        player.enemyList[fightEnemyID].timesLostTo += 1
        player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = player.enemyList[fightEnemyID]
        updateEnemyDisplay(enemy)
    }
    else if (enemy.hitPoints <= 0){
        document.getElementById("fightButton").disabled = true
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 600px;"
        player.exp += enemy.maxHitPoints * (1 + enemy.ID)
        document.getElementById("outcomeText").hidden = false
        document.getElementById("outcomeText").innerHTML = "You are victorious!"
        fighting = false
        player.enemyList[fightEnemyID].timesDefeated += 1
        var goldEarned = Math.floor(Math.random() * (enemy.dropMax - enemy.dropMin + 1) + enemy.dropMin)
        player.gold += goldEarned
        document.getElementById("outcomeTextGold").hidden = false
        document.getElementById("outcomeTextExp").hidden = false
        document.getElementById("outcomeTextGold").innerHTML = "You earned " + goldEarned + " gold by defeating " + enemy.name + "! You now have " + player.gold + " gold!"
        document.getElementById("outcomeTextExp").innerHTML = "You earned " + enemy.maxHitPoints * (1 + enemy.ID) + " EXP by defeating " + enemy.name + "! You now have " + player.exp + " EXP!"
        ladderIncrement(player.enemyList[fightEnemyID])
        player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = player.enemyList[fightEnemyID]
        updateEnemyDisplay(enemy)
        postFight = true
        if ((fightEnemyID + 1) % 3 == 0){
            if (player.enemyList[fightEnemyID - 1].timesDefeated > 0 && player.enemyList[fightEnemyID - 2].timesDefeated > 0){
                if (player.zoneMax == player.currentZone){
                    player.zoneMax += 1
                }
            }
        }
    }
}

function ladderIncrement(enemy){
    enemy.maxHitPoints += enemy.ladderValue
    enemy.attackPoints += enemy.ladderValue
    enemy.defensePoints += enemy.ladderValue
    enemy.speedPoints += enemy.ladderValue
}

function updateEnemyDisplay(enemy){
    displayID = enemy.ID % 3
    document.getElementById("enemy" + displayID).onclick = function(){setupFight(enemy.ID)}
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
}


function loadZone(zone){
    var zoneLoader = player.zones[zone - 1]
    for (var i = 0; i < zoneLoader.enemies.length; i++){
        updateEnemyDisplay(zoneLoader.enemies[i])
    }
    document.getElementById("zoneNumber").innerHTML = "Zone " + (zoneLoader.ID + 1)     
    document.getElementById("zoneName").innerHTML = zoneLoader.name
}
updateHTML()

var fightEnemyID = 0
var goldAnimation = null
var expAnimation = null
function setupFight(ID){
    fightEnemyID = ID
    enemy = player.enemyList[ID]
    if (goldAnimation !== null){
        goldAnimation.reset()
    }
    if (expAnimation !== null){
        expAnimation.reset()
    }
        document.getElementById("battleTab").style.display='none';
        document.getElementById("fightSetupScreen").style.display='block';
        document.getElementById("enemyFightImage").src = enemy.imagePath;
        document.getElementById("fightScreenEnemyName").innerHTML = enemy.name;
        document.getElementById("autoBattleVictories").innerHTML = "You've won " + enemy.autoBattleVictories + " times!"
        document.getElementById("autoBattleGold").innerHTML = "You've earned " + enemy.autoBattleTotalGold + " gold!"
        document.getElementById("autoBattleExp").innerHTML = "You've earned " + enemy.autoBattleTotalExp + " EXP!"
}

function autoBattle(enemy){
    var playerTotalStats = player.attackPoints + player.defensePoints + player.maxHitPoints + player.speedPoints
    var totalDamageIcons = 0
    var totalDefenseIcons = 0
    for (var i = 0; i < player.equipment.length; i++){
        totalDamageIcons += getTotalIcons(player.equipment[i], false)
        totalDefenseIcons += getTotalIcons(player.equipment[i], true)
    }
    var playerScore = playerTotalStats + (totalDamageIcons * 5) + (totalDefenseIcons * 5)
    var enemyTotalStats = enemy.attackPoints + enemy.defensePoints + enemy.maxHitPoints + enemy.speedPoints
    var enemyDamageIcons = 0
    var enemyDefenseIcons = 0
    for (var i = 0; i < enemy.equipment.length; i++){
        enemyDamageIcons += getTotalIcons(enemy.equipment[i], false)
        enemyDefenseIcons += getTotalIcons(enemy.equipment[i], true)
    }
    var enemyScore = (enemyTotalStats + (enemyDamageIcons * 5) + (enemyDefenseIcons * 5)) * 1.25
    console.log("Player: " + playerScore + " vs. Enemy: " + enemyScore)
    if (playerScore > enemyScore){
        enemy.timesDefeated += 1
        var goldEarned = Math.floor(Math.random() * (enemy.dropMax - enemy.dropMin + 1) + enemy.dropMin)
        player.gold += goldEarned
        var expEarned = enemy.maxHitPoints * (1 + enemy.ID)
        player.exp += expEarned
        updateHTML()
        enemy.autoBattleVictories += 1
        enemy.autoBattleTotalGold += goldEarned
        enemy.autoBattleTotalExp += expEarned
        if (enemy.ID == fightEnemyID){
            document.getElementById("autoBattleVictories").innerHTML = "You've won " + enemy.autoBattleVictories + " times!"
            goldAnimation = new CountUp("autoBattleGold", enemy.autoBattleTotalGold - goldEarned, enemy.autoBattleTotalGold, 0, 1, optionsGold);
            expAnimation = new CountUp("autoBattleExp", enemy.autoBattleTotalExp - expEarned, enemy.autoBattleTotalExp, 0, 1, optionsExp);
            goldAnimation.start()
            expAnimation.start()
        }
        ladderIncrement(enemy)
        console.log(Math.floor((enemy.ID + 1) / 3))
        if (Math.floor((enemy.ID ) / 3).toFixed(0) == player.currentZone - 1){
            updateEnemyDisplay(enemy)
        }
        setTimeout(function(){
            autoBattle(enemy)
        }, 1000)
    }
    else{
        console.log("You lose!")
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
        player.allItems[14].heal = Math.round(player.maxHitPoints / 20)
        for (var i = 0; i < player.allItems.length; i++){
            buyItem(i)
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
