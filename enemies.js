
createEnemy(0, "Snek", 10, 1, 1, 1, "/images/enemies/pipo-enemy003b.png", 1, 0, 0, [enemyWeapons[0], enemyWeapons[1], enemyWeapons[2], enemyWeapons[3]], 2, 5)
createEnemy(1, "Sloim", 10, 1, 1, 1, "/images/enemies/pipo-enemy009b.png", 3, 0, 0, [enemyWeapons[4], enemyWeapons[5], enemyWeapons[6], enemyWeapons[7]], 4, 8)
createEnemy(2, "Coro", 25, 5, 5, 5, "/images/enemies/pipo-enemy001.png", 5, 0, 0, [enemyWeapons[8], enemyWeapons[9], enemyWeapons[10], enemyWeapons[11]], 7, 11)
createEnemy(3, "Mr. Pain, Bodyguard", 40, 15, 15, 15, "/images/enemies/pipo-enemy014b.png", 5, 0, 0, [enemyWeapons[12], enemyWeapons[13], enemyWeapons[14], enemyWeapons[15]], 15, 23)
createEnemy(4, "Wallfiend", 100, 20, 100, 1, "/images/enemies/pipo-enemy033.png", 10, 0, 0, [enemyWeapons[16], enemyWeapons[17], enemyWeapons[18], enemyWeapons[19]], 20, 28)
createEnemy(5, "Bizarro Seto", 60, 35, 35, 35, "/images/enemies/pipo-enemy030b.png", 10, 0, 0, [enemyWeapons[20], enemyWeapons[21], enemyWeapons[22], enemyWeapons[23]], 30, 37)
createEnemy(6, "Fodder Knight", 100, 40, 40, 40, "/images/enemies/pipo-enemy018a.png", 10, 0, 0, [enemyWeapons[24], enemyWeapons[25], enemyWeapons[26], enemyWeapons[27]], 40, 54)
createEnemy(7, "Mimic", 2000, 200, 1, 1, "/images/enemies/pipo-enemy032.png", 100, 0, 0, [enemyWeapons[28], enemyWeapons[29], enemyWeapons[30], enemyWeapons[31]], 2000, 2000)
createEnemy(8, "Seto, Imp of Angst", 175, 55, 55, 55, "/images/enemies/pipo-enemy040b.png", 20, 0, 0, [enemyWeapons[32], enemyWeapons[33], enemyWeapons[34], enemyWeapons[35]], 59, 100)
createEnemy(9, "Phantom Uzoro", 220, 85, 85, 200, "/images/enemies/pipo-enemy025.png", 20, 0, 0, [enemyWeapons[36], enemyWeapons[37], enemyWeapons[38], enemyWeapons[39]], 59, 100)
createEnemy(10, "Skulltan", 350, 100, 100, 100, "/images/enemies/pipo-enemy026.png", 35, 0, 0, [enemyWeapons[40], enemyWeapons[41], enemyWeapons[42], enemyWeapons[43]], 59, 100)
createEnemy(11, "Seto Immanis", 500, 125, 125, 75, "/images/enemies/pipo-enemy021b.png", 50, 0, 0, [enemyWeapons[44], enemyWeapons[45], enemyWeapons[46], enemyWeapons[47]], 59, 100)
createEnemy(12, "Skulltan Unbound", 800, 250, 250, 250, "/images/enemies/pipo-boss001.png", 70, 0, 0, [enemyWeapons[48], enemyWeapons[49], enemyWeapons[50], enemyWeapons[51]], 1500, 2000)
createEnemy(13, "Uzoro", 1750, 300, 500, 10000, "/images/enemies/pipo-boss002.png", 100, 0, 0, [enemyWeapons[52], enemyWeapons[53], enemyWeapons[54], enemyWeapons[55]], 5000, 7000)
createEnemy(14, "Seto Skull Fused", 3000, 700, 700, 100, "/images/enemies/pipo-boss004.png", 125, 0, 0, [enemyWeapons[56], enemyWeapons[57], enemyWeapons[58], enemyWeapons[59]], 4000, 6000)
createEnemy(15, "Uzoro's Will", 10000, 1000, 1000, 100000, "/images/enemies/pipo-boss003.png", 2400, 0, 0, [enemyWeapons[60], enemyWeapons[61], enemyWeapons[62], enemyWeapons[63]], 10000, 10000)


createZone(0, "The Inner Forest", [player.enemyList[0], player.enemyList[1], player.enemyList[2]])
createZone(1, "The Castle Walls", [player.enemyList[3], player.enemyList[4], player.enemyList[5]])
createZone(2, "The Dungeon Gate", [player.enemyList[6], player.enemyList[7], player.enemyList[8]])
createZone(3, "The Hall of Seto", [player.enemyList[9], player.enemyList[10], player.enemyList[11]])
createZone(4, "The Falling Hall", [player.enemyList[12], player.enemyList[13], player.enemyList[14]])
createZone(5, "The Final Breath", [player.enemyList[15]])

loadZone(1)


