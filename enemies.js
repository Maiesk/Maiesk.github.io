function createEnemyList(){
    //Main enemies
    createEnemy(0, "Snek", 10, 1, 1, 1, "/images/enemies/pipo-enemy003b.png", 1, 0, 0, [enemyWeapons[0], enemyWeapons[1], enemyWeapons[2], enemyWeapons[3]], 4, 7, 0, 0)
    createEnemy(1, "Sloim", 10, 1, 1, 1, "/images/enemies/pipo-enemy009b.png", 3, 0, 0, [enemyWeapons[4], enemyWeapons[5], enemyWeapons[6], enemyWeapons[7]], 8, 12, 0, 0)
    createEnemy(2, "Coro", 25, 5, 5, 5, "/images/enemies/pipo-enemy001.png", 5, 0, 0, [enemyWeapons[8], enemyWeapons[9], enemyWeapons[10], enemyWeapons[11]], 10, 15, 0, 0)
    createEnemy(3, "Iron Fox", 40, 15, 15, 15, "/images/enemies/pipo-enemy014b.png", 5, 0, 0, [enemyWeapons[12], enemyWeapons[13], enemyWeapons[14], enemyWeapons[15]], 15, 23, 0, 0)
    createEnemy(4, "Wallfiend", 100, 20, 100, 1, "/images/enemies/pipo-enemy033.png", 10, 0, 0, [enemyWeapons[16], enemyWeapons[17], enemyWeapons[18], enemyWeapons[19]], 20, 28, 0, 0)
    createEnemy(5, "Bizarro Seto", 60, 35, 35, 35, "/images/enemies/pipo-enemy030b.png", 10, 0, 0, [enemyWeapons[20], enemyWeapons[21], enemyWeapons[22], enemyWeapons[23]], 30, 37, 0, 0)
    createEnemy(6, "Fodder Knight", 100, 40, 40, 40, "/images/enemies/pipo-enemy018a.png", 10, 0, 0, [enemyWeapons[24], enemyWeapons[25], enemyWeapons[26], enemyWeapons[27]], 40, 54, 0, 0)
    createEnemy(7, "Mimic", 500, 50, 1, 1, "/images/enemies/pipo-enemy032.png", 50, 0, 0, [enemyWeapons[28], enemyWeapons[29], enemyWeapons[30], enemyWeapons[31]], 1250, 1250, 0, 0)
    createEnemy(8, "Seto, Imp of Angst", 175, 55, 55, 55, "/images/enemies/pipo-enemy040b.png", 20, 0, 0, [enemyWeapons[32], enemyWeapons[33], enemyWeapons[34], enemyWeapons[35]], 59, 100, 0, 0)
    createEnemy(9, "Phantom Uzoro", 220, 85, 85, 200, "/images/enemies/pipo-enemy025.png", 20, 0, 0, [enemyWeapons[36], enemyWeapons[37], enemyWeapons[38], enemyWeapons[39]], 59, 100, 0, 0)
    createEnemy(10, "Skulltan", 350, 100, 100, 100, "/images/enemies/pipo-enemy026.png", 35, 0, 0, [enemyWeapons[40], enemyWeapons[41], enemyWeapons[42], enemyWeapons[43]], 59, 100, 0, 0)
    createEnemy(11, "Seto Immanis", 500, 125, 125, 75, "/images/enemies/pipo-enemy021b.png", 50, 0, 0, [enemyWeapons[44], enemyWeapons[45], enemyWeapons[46], enemyWeapons[47]], 59, 100, 0, 0)
    createEnemy(12, "Skulltan Unbound", 800, 250, 250, 250, "/images/enemies/pipo-boss001.png", 70, 0, 0, [enemyWeapons[48], enemyWeapons[49], enemyWeapons[50], enemyWeapons[51]], 1500, 2000, 0, 0)
    createEnemy(13, "Uzoro", 1750, 300, 500, 1250, "/images/enemies/pipo-boss002.png", 100, 0, 0, [enemyWeapons[52], enemyWeapons[53], enemyWeapons[54], enemyWeapons[55]], 5000, 7000, 0, 0)
    createEnemy(14, "Seto Skull Fused", 3000, 500, 500, 100, "/images/enemies/pipo-boss004.png", 125, 0, 0, [enemyWeapons[56], enemyWeapons[57], enemyWeapons[58], enemyWeapons[59]], 4000, 6000, 0, 0)
    createEnemy(15, "Uzoro's Will", 5000, 1000, 300, 1000, "/images/enemies/pipo-boss003.png", 200, 0, 0, [enemyWeapons[60], enemyWeapons[61], enemyWeapons[62], enemyWeapons[63]], 10000, 10000, 0, 0)
    
    //Secret enemies
    createEnemy(100, "Encroaching Roots", 50, 10, 10, 1, "/images/enemies/secret/pipo-enemy006.png", 10, 0, 0, [enemyWeapons[100],enemyWeapons[101],enemyWeapons[102],enemyWeapons[103]], 250, 300, 5, 0)
    createEnemy(101, "The Mushman", 30, 10, 10, 10, "/images/enemies/secret/pipo-enemy008.png", 10, 0, 0, [enemyWeapons[104],enemyWeapons[105],enemyWeapons[106],enemyWeapons[107]], 350, 400, 5, 0)
    createEnemy(102, "Enraged Wallfiend", 100, 50, 50, 50, "/images/enemies/secret/pipo-enemy033b.png", 10, 0, 0, [enemyWeapons[108],enemyWeapons[109],enemyWeapons[110],enemyWeapons[111]], 400, 500, 6, 0)
    createEnemy(103, "Faded Ghost", 1, 1, 1, 1, "/images/enemies/secret/pipo-enemy010.png", 1, 0, 0, [enemyWeapons[112],enemyWeapons[113],enemyWeapons[114],enemyWeapons[115]], 500, 500, 6, 0)
    createEnemy(104, "Dark Fodder Knight", 100, 40, 40, 40, "/images/enemies/secret/pipo-enemy018b.png", 10, 0, 0, [enemyWeapons[116],enemyWeapons[117],enemyWeapons[118],enemyWeapons[119]], 500, 600, 7, 0)
    createEnemy(105, "Persistent Weed", 200, 85, 20, 20, "/images/enemies/secret/pipo-enemy007b.png", 10, 0, 0, [enemyWeapons[120],enemyWeapons[121],enemyWeapons[122],enemyWeapons[123]], 600, 700, 7, 0)
    createEnemy(106, "Oojara", 220, 85, 85, 200, "/images/enemies/secret/pipo-enemy025b.png", 50, 0, 0, [enemyWeapons[124],enemyWeapons[125],enemyWeapons[126],enemyWeapons[127]], 800, 800, 8, 0)
    createEnemy(107, "Gleaming Ghost", 1, 1, 1, 1, "/images/enemies/secret/pipo-enemy010b.png", 1, 0, 0, [enemyWeapons[128],enemyWeapons[129],enemyWeapons[130],enemyWeapons[131]], 1000, 1000, 8, 0)
    createEnemy(108, "Fawkes of Ra", 500, 500, 500, 500, "/images/enemies/secret/pipo-enemy022a.png", 500, 0, 0, [enemyWeapons[132],enemyWeapons[133],enemyWeapons[134],enemyWeapons[135]], 5000, 5000, 9, 0)
    createEnemy(109, "Jester", 1000, 800, 0, 0, "/images/enemies/secret/pipo-enemy017.png", 0, 0, 0, [enemyWeapons[136],enemyWeapons[137],enemyWeapons[138],enemyWeapons[139]], 3000, 3000, 9, 0)
    createEnemy(110, "Arcafford", 2500, 1000, 250, 1250, "/images/enemies/secret/pipo-enemy023.png", 250, 0, 0, [enemyWeapons[140],enemyWeapons[141],enemyWeapons[142],enemyWeapons[143]], 10000, 10000, 10, 0)
    createEnemy(111, "Xenrir", 3000, 750, 500, 1250, "/images/enemies/secret/pipo-enemy023a.png", 250, 0, 0, [enemyWeapons[144],enemyWeapons[145],enemyWeapons[146],enemyWeapons[147]], 20000, 20000, 10, 0)
    createEnemy(112, "Cirrurberus", 7200, 1200, 1200, 1200, "/images/enemies/secret/pipo-enemy023b.png", 1200, 0, 0, [enemyWeapons[148],enemyWeapons[149],enemyWeapons[150],enemyWeapons[151]], 100000, 100000, 0, 0)
}

createEnemyList()

function clearEnemyList(){
    enemyList.length = 0
    secretEnemyList.length = 0
}

createZone(0, "The Inner Forest", "background-color: green", [enemyList[0], enemyList[1], enemyList[2]])
createZone(1, "The Castle Walls", "background-color: grey", [enemyList[3], enemyList[4], enemyList[5]])
createZone(2, "The Dungeon Gate", "background-color: rgb(50, 50, 150)", [enemyList[6], enemyList[7], enemyList[8]])
createZone(3, "The Hall of Seto", "background-color: rgb(60, 20, 60)", [enemyList[9], enemyList[10], enemyList[11]])
createZone(4, "The Falling Hall", "background-color: rgb(120, 50, 50)", [enemyList[12], enemyList[13], enemyList[14]])
createZone(5, "The Final Breath", "background-color: rgb(10, 10, 60)", [enemyList[15]])

loadZone(1)


