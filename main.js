var player = {
    name: "",
    attackPoints: 1,
    defensePoints: 1,
    hitPoints: 10,
    maxHitPoints: 10,
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
    statGain()
}

function statGain(){
    if (player.allocatedHP > 0 && player.level > (player.maxHitPoints / 15)){         
        if (document.getElementById("progressBarHP").value >= document.getElementById("progressBarHP").max){
            document.getElementById("progressBarHP").value = 0
            document.getElementById("progressBarHP").max = 10000 * (1.05**Math.sqrt(player.maxHitPoints - 10)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
            player.maxHitPoints += 1 * player.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarHP").value += 10 * player.allocatedHP
        player.currentProgressHP = document.getElementById("progressBarHP").value
    }
    if (player.allocatedAtt > 0 && player.level > (player.attackPoints / 10)){        
        if (document.getElementById("progressBarAttack").value >= document.getElementById("progressBarAttack").max){
            document.getElementById("progressBarAttack").value = 0
            document.getElementById("progressBarAttack").max = 10000 * (1.05**Math.sqrt(player.attackPoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
            player.attackPoints += 1 * player.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarAttack").value += 10 * player.allocatedAtt
        player.currentProgressAtt = document.getElementById("progressBarAttack").value
    }
    if (player.allocatedDef > 0 && player.level > (player.defensePoints / 10)){        
        if (document.getElementById("progressBarDefense").value >= document.getElementById("progressBarDefense").max){
            document.getElementById("progressBarDefense").value = 0
            document.getElementById("progressBarDefense").max = 10000 * (1.05**Math.sqrt(player.defensePoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
            player.defensePoints += 1 * player.statPointUpgradeMultiplier
            updateHTML()
        }
        document.getElementById("progressBarDefense").value += 10 * player.allocatedDef
        player.currentProgressDef = document.getElementById("progressBarDefense").value
    }
    if (player.allocatedSpe > 0 && player.level > (player.speedPoints / 10)){        
        if (document.getElementById("progressBarSpeed").value >= document.getElementById("progressBarSpeed").max){
            document.getElementById("progressBarSpeed").value = 0
            document.getElementById("progressBarSpeed").max = 10000 * (1.05**Math.sqrt(player.speedPoints)) / (player.progressDivider * Math.log2(2 + ((player.level - 1)/20)))
            player.speedPoints += 1 * player.statPointUpgradeMultiplier
            updateHTML()
        }        
        document.getElementById("progressBarSpeed").value += 10 * player.allocatedSpe
        player.currentProgressSpe = document.getElementById("progressBarSpeed").value
    }
}

function allocateHP(increase){
    if (player.statPoints > 0 && increase){
        player.statPoints -= 1
        player.allocatedHP += 1
    }
    else if (player.allocatedHP > 0 && !increase){
        player.statPoints += 1
        player.allocatedHP -= 1
    }
    updateHTML()
}

function allocateAttack(increase){
    if (player.statPoints > 0 && increase){
        player.statPoints -= 1
        player.allocatedAtt += 1
    }
    else if (player.allocatedAtt > 0 && !increase){
        player.statPoints += 1
        player.allocatedAtt -= 1
    }
    updateHTML()
}

function allocateDefense(increase){
    if (player.statPoints > 0 && increase){
        player.statPoints -= 1
        player.allocatedDef += 1
    }
    else if (player.allocatedDef > 0 && !increase){
        player.statPoints += 1
        player.allocatedDef -= 1
    }
    updateHTML()
}

function allocateSpeed(increase){
    if (player.statPoints > 0 && increase){
        player.statPoints -= 1
        player.allocatedSpe += 1
    }
    else if (player.allocatedSpe > 0 && !increase){
        player.statPoints += 1
        player.allocatedSpe -= 1
    }
    updateHTML()
}

var powerTrainCooldown = false;
function powerTrain(){
    if (powerTrainCooldown == false){
        var originalTrainingPerClick = player.trainingPerClick
        player.trainingPerClick *= 2
        powerTrainCooldown = true
        updateHTML()
        document.getElementById("powerTrainButton").disabled = true
        document.getElementById("powerTrainButton").style = "background-color: #474646; color: #373636"
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
            document.getElementById("buyAPButton").style = "background-color: rgb(6, 128, 128); color: black"
            document.getElementById("powerTrainButton").innerHTML = "Power Train"
            document.getElementById("powerTrainButton").disabled = false
            document.getElementById("powerTrainButton").style = "background-color: rgb(6, 128, 128); color: black"    
            document.getElementById("saveButton").disabled = false
            document.getElementById("saveButton").style = "background-color: rgb(6, 128, 128); color: black"
            document.getElementById("loadButton").disabled = false
            document.getElementById("loadButton").style = "background-color: rgb(6, 128, 128); color: black"
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
    mainGameLoop = window.setInterval(function (){
        update();
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
            document.getElementById("progressBarHP").value = player.currentProgressHP
            document.getElementById("progressBarAttack").value = player.currentProgressAtt
            document.getElementById("progressBarDefense").value = player.currentProgressDef
            document.getElementById("progressBarSpeed").value = player.currentProgressSpe
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
    document.getElementById("statPointsDisplay").innerHTML = "Stat Points<br/><br/>" + player.statPoints + "/" + player.maxStatPoints
    document.getElementById("currentEXP").innerHTML = "EXP<br/><br/>" + player.exp + "/" + player.levelUpCost
    document.getElementById("currentLevel").innerHTML = "Level<br/><br/>" + player.level
    document.getElementById("currentHPStat").innerHTML = player.maxHitPoints + " HP"
    document.getElementById("currentAttackStat").innerHTML = player.attackPoints + " Attack"
    document.getElementById("currentDefenseStat").innerHTML = player.defensePoints + " Defense"
    document.getElementById("currentSpeedStat").innerHTML = player.speedPoints + " Speed"
    document.getElementById("statPointsOnHP").innerHTML = player.allocatedHP
    document.getElementById("statPointsOnAttack").innerHTML = player.allocatedAtt
    document.getElementById("statPointsOnDefense").innerHTML = player.allocatedDef
    document.getElementById("statPointsOnSpeed").innerHTML = player.allocatedSpe
    document.getElementById("currentGold").innerHTML = "You have " + numberWithCommas(goldShown) + " Gold."
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
        dropMax: dropMax
    }
    player.enemyList[player.enemyList.length] = enemy
    return enemy;
}

function createItem(name, ID, fire, air, earth, water, melee, light, dark, fireDef, airDef, earthDef, waterDef, meleeDef, lightDef, darkDef, heal, oncePerBattle, freeze, imagePath, itemCost){
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
        itemCost: itemCost
    }
    player.allItems[item.ID] = item
    var cell = document.createElement("div");
    var figure = document.createElement("figure")
    var caption = document.createElement("figcaption")
    var image = document.createElement("img")
    cell.style = "width: 180px"
    cell.id = "goldShopItem" + item.ID
    image.src = item.imagePath
    image.className = "itemImages"
    caption.id = "goldShopItemCaption" + item.ID
    caption.className = "itemText"
    caption.style = "width: 120px; align-content: center"
    figure.appendChild(image)
    figure.appendChild(caption)
    cell.appendChild(figure)
    document.getElementById("goldShopGrid").appendChild(cell);
    document.getElementById("goldShopItem" + item.ID).onclick = function(){buyItem(item.ID)}
    document.getElementById("goldShopItemCaption" + item.ID).innerHTML = item.name  + "<br/>" + item.itemCost + " Gold"
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
createEnemyWeapon("Snek Fangs", 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Snek Hide", 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 3, 0, 0, 0, false, false)
createEnemyWeapon("Venom Spit", 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Bad Breath", 3, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Sloim Cannon", 4, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Super Sloim Transform", 5, 0, 2, 0, 0, 2, 3, 0, 5, 0, 0, 0, 5, 0, 0, 0, false, false)
createEnemyWeapon("Regenerate Sloim", 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, false, false)
createEnemyWeapon("Expand-o-sloim", 7, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, false, false)
createEnemyWeapon("Coro Fangs", 8, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Bat Wings", 9, 0, 0, 7, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Neurotoxin", 10, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 8, 0, 0, 0, false, false)
createEnemyWeapon("Eyes of Rage", 11, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Training Sword", 12, 0, 0, 0, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, false, false)
createEnemyWeapon("Training Sword", 13, 0, 0, 0, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, false, false)


function buyItem(ID){
    var buyItem = player.allItems[ID]
    if (player.gold >= buyItem.itemCost){
        player.gold -= buyItem.itemCost
        document.getElementById("goldShopItem" + ID).onclick = ""
        document.getElementById("goldShopItemCaption" + ID).innerHTML = buyItem.name  + "<br/>" + "Bought"
        player.inventory.push(buyItem)
        pushInventoryDisplay(player.inventory.length - 1)
        updateHTML()
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


createItem("Dank Sword", 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false, "/images/weapons/Sword_02.png", 0)
createItem("Nomad Blade", 1, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false, "/images/weapons/Dagger_32.png", 20)
createItem("Grim Gavel", 2, 0, 0, 0, 0, 3, 0, 4, 0, 0, 0, 0, 7, 0, 0, 0, false, false, "/images/weapons/Hammer_23.png", 60)
createItem("Aura Spear", 3, 0, 0, 0, 5, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, false, false, "/images/weapons/Spear_35.png", 40)
createItem("Staff of the Mountain Bear", 4, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, false, false, "/images/weapons/staff_12.png", 100)
createItem("Wand of Embers", 5, 5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 0, 3, 0, false, false, "/images/weapons/staff_33.png", 100)
createItem("Solaire Halberd", 6, 0, 0, 0, 0, 3, 7, 0, 0, 0, 0, 0, 0, 0, 3, 0, false, false, "/images/weapons/staff_34.png", 125)
createItem("Buckler", 7, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, false, false, "/images/weapons/shield_05.png", 0)
createItem("Silver Shield", 8, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 3, 0, 0, 0, false, false, "/images/weapons/shield_07.png", 50)
createItem("Golden Kite", 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 2, 5, 0, false, false, "/images/weapons/shield_08.png", 100)
createItem("It Without Implement", 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, true, "/images/weapons/shield_43.png", 50000)

createEnemy(0, "Snek", 10, 1, 1, 1, "/images/enemies/pipo-enemy003b.png", 1, 0, 0, [enemyWeapons[0], enemyWeapons[1], enemyWeapons[2], enemyWeapons[3]], 2, 5)
createEnemy(1, "Sloim", 10, 1, 1, 1, "/images/enemies/pipo-enemy009b.png", 3, 0, 0, [enemyWeapons[4], enemyWeapons[5], enemyWeapons[6], enemyWeapons[7]], 4, 8)
createEnemy(2, "Coro", 25, 5, 5, 5, "/images/enemies/pipo-enemy001.png", 5, 0, 0, [enemyWeapons[8], enemyWeapons[9], enemyWeapons[10], enemyWeapons[11]], 7, 11)
createEnemy(3, "John", 40, 15, 15, 15, "/images/enemies/pipo-enemy003b.png", 5, 0, 0, [player.allItems[2], player.allItems[5], player.allItems[0], player.allItems[3]], 15, 23)
createEnemy(4, "Jim", 85, 20, 20, 20, "/images/enemies/pipo-enemy009b.png", 7, 0, 0, [player.allItems[1], player.allItems[7], player.allItems[4], player.allItems[6]], 20, 28)
createEnemy(5, "Joe", 60, 35, 35, 35, "/images/enemies/pipo-enemy001.png", 10, 0, 0, [player.allItems[0], player.allItems[8], player.allItems[7]], 30, 37)
createEnemy(6, "Johntwo", 100, 40, 40, 40, "/images/enemies/pipo-enemy003b.png", 10, 0, 0, [player.allItems[2], player.allItems[5], player.allItems[0], player.allItems[3]], 40, 54)
createEnemy(7, "Jimtwo", 135, 45, 45, 45, "/images/enemies/pipo-enemy009b.png", 15, 0, 0, [player.allItems[1], player.allItems[7], player.allItems[4], player.allItems[6]], 50, 62)
createEnemy(8, "Joetwo", 175, 55, 55, 55, "/images/enemies/pipo-enemy001.png", 20, 0, 0, [player.allItems[0], player.allItems[8], player.allItems[7]], 59, 100)
createZone(0, "The Outer Forest", [player.enemyList[0], player.enemyList[1], player.enemyList[2]])
createZone(1, "The Inner Forest", [player.enemyList[3], player.enemyList[4], player.enemyList[5]])
createZone(2, "The Super Forest", [player.enemyList[6], player.enemyList[7], player.enemyList[8]])

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
        document.getElementById("fightButton").style = "min-width: 194px;"
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
                document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 194px;"
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

var currentEnemy = 0
var fighting = false
function initiateBattle(fightEnemyID){
    fighting = true
    document.getElementById("outcomeButton").hidden = true
    document.getElementById("outcomeText").hidden = true
    document.getElementById("fightButton").disabled = true
    document.getElementById("playerHealRow0").hidden = true
    document.getElementById("playerHealRow1").hidden = true
    document.getElementById("enemyHealRow0").hidden = true
    document.getElementById("enemyHealRow1").hidden = true
    document.getElementById("attackOrder").innerHTML = ""
    document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 194px;"
    var enemy = player.enemyList[fightEnemyID]
    document.getElementById("enemyBattleImage").src = enemy.imagePath
    if (player.hitPoints !== player.maxHitPoints){
        player.hitPoints = player.maxHitPoints
    }
    if (enemy.hitPoints !== enemy.maxHitPoints){
        enemy.hitPoints = enemy.maxHitPoints
    }
    updateHP(enemy)
    createBattleOptions(enemy)
    createBattleOptionsPlayer()
    loadEquipmentForBattle()
    selectStance("Steady")
    document.getElementById("attackIconRow0").hidden = true
    document.getElementById("defenseIconRow0").hidden = true
    document.getElementById("attackIconRow1").hidden = true
    document.getElementById("defenseIconRow1").hidden = true
    document.getElementById("enemyAttackIconRow0").hidden = true
    document.getElementById("enemyDefenseIconRow0").hidden = true
    document.getElementById("enemyAttackIconRow1").hidden = true
    document.getElementById("enemyDefenseIconRow1").hidden = true
    document.getElementById("damageRow").hidden = true
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

function attack(enemy, playerItem1, playerItem2, enemyItemIndex1, enemyItemIndex2){
    if (!player.frozen){
        var playerStrength = determineTier(player.attackPoints);
        var enemyDefense = determineTier(enemy.defensePoints);
        var attackModifier = determineModifier(player.currentStance);
        var enemyDefenseModifier = determineModifier(enemyStance);
        var totalHeal = 0;
        var totalDamage = 0;
        var enemyItem1 = enemy.equipment[enemyItemIndex1]
        var enemyItem2 = enemy.equipment[enemyItemIndex2]
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
    }
    else{
        player.frozen = false
    }
    updateHP(enemy)
    document.getElementById("damageRow").hidden = false
}

function enemyAttack(enemy, playerItem1, playerItem2, enemyItemIndex1, enemyItemIndex2){
    if (!enemy.frozen){
        var enemyStrength = determineTier(enemy.attackPoints);
        var playerDefense = determineTier(player.defensePoints);
        var attackModifier = determineModifier(enemyStance);
        var playerDefenseModifier = determineModifier(player.currentStance);
        var totalHeal = 0;
        var totalDamage = 0;
        var enemyItem1 = enemy.equipment[enemyItemIndex1]
        var enemyItem2 = enemy.equipment[enemyItemIndex2]
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
    }
    else{
        player.frozen = false
    }
    updateHP(enemy)
    document.getElementById("damageRow").hidden = false
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
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 194px;"
        document.getElementById("outcomeButton").hidden = false
        document.getElementById("outcomeButton").innerHTML = "You lose! Click here."
        fighting = false
        player.enemyList[fightEnemyID].timesLostTo += 1
        player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = player.enemyList[fightEnemyID]
        updateEnemyDisplay(enemy)
    }
    else if (enemy.hitPoints <= 0){
        document.getElementById("fightButton").disabled = true
        document.getElementById("fightButton").style = "background-color: #474646; color: #373636; min-width: 194px;"
        player.exp += enemy.maxHitPoints * (1 + enemy.ID)
        ladderIncrement(player.enemyList[fightEnemyID])
        document.getElementById("outcomeButton").hidden = false
        document.getElementById("outcomeButton").innerHTML = "You win! Click here."
        fighting = false
        player.enemyList[fightEnemyID].timesDefeated += 1
        var goldEarned = Math.floor(Math.random() * (enemy.dropMax - enemy.dropMin + 1) + enemy.dropMin)
        player.gold += goldEarned
        document.getElementById("outcomeText").hidden = false
        document.getElementById("outcomeText").innerHTML = "You earned " + goldEarned + " gold by defeating " + enemy.name + "! You now have " + player.gold + " gold!"
        player.zones[player.currentZone - 1].enemies[fightEnemyID % 3] = player.enemyList[fightEnemyID]
        updateEnemyDisplay(enemy)
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
    document.getElementById("attackIconRow0").hidden = true
    document.getElementById("attackIconRow1").hidden = true
    document.getElementById("enemyAttackIconRow0").hidden = true
    document.getElementById("enemyAttackIconRow1").hidden = true
    document.getElementById("defenseIconRow0").hidden = true
    document.getElementById("defenseIconRow1").hidden = true
    document.getElementById("enemyDefenseIconRow0").hidden = true
    document.getElementById("enemyDefenseIconRow1").hidden = true
    document.getElementById("damageRow").hidden = true
}

function zoneUp(){
    if (player.currentZone < 3){
        player.currentZone += 1
    }
    loadZone(player.currentZone)
}

function zoneDown(){
    if (player.currentZone > 1){
        player.currentZone -= 1
    }
    loadZone(player.currentZone)
}

loadZone(1)
function loadZone(zone){
    var zoneLoader = player.zones[zone - 1]
    for (var i = 0; i < zoneLoader.enemies.length; i++){
        updateEnemyDisplay(zoneLoader.enemies[i])
    }
    document.getElementById("zoneNumber").innerHTML = "Zone " + (zoneLoader.ID + 1)     
    document.getElementById("zoneName").innerHTML = zoneLoader.name
}