class ChessPiece {
    constructor(chessName) {
        const chessList = {
            cavalry: { name: '騎兵', race: 'cavalry', attack: 25, health: 150, counter: 'shield', price: 20 },
            shield: { name: '盾兵', race: 'shield', attack: 25, health: 150, counter: 'spearman', price: 20 },
            spearman: { name: '槍兵', race: 'spearman', attack: 25, health: 150, counter: 'cavalry', price: 20 },
            archer: { name: '弓兵', race: 'archer', attack: 40, health: 75, counter: 'handCannoneer', price: 20 },
            handCannoneer: { name: '火槍兵', race: 'handCannoneer', attack: 40, health: 75, counter: 'horseArcher', price: 20 },
            horseArcher: { name: '弓騎兵', race: 'horseArcher', attack: 40, health: 75, counter: 'archer', price: 20 }
        }
        const chess = chessList[chessName]
        Object.assign(this, chess)
    }

    // 攻擊對手棋子
    attackPiece(opponentPiece) {
        if (opponentPiece.race === this.getCounter()) {
            opponentPiece.health -= this.attack * 1.5;
        } else {
            opponentPiece.health -= this.attack;
        }
        if (opponentPiece.health <= 0) {
            opponentPiece.health = 0;
            console.log(`${opponentPiece.name} was defeated.`);
        } else {
            console.log(
                `${this.name} attacked ${opponentPiece.name}. ${opponentPiece.name}'s health is now ${opponentPiece.health}.`
            );
        }
    }

    // 獲取種族
    getRace() {
        return this.race;
    }

    // 獲取效果
    getCounter() {
        return this.counter;
    }

    // 獲取加成
    getBonus() {
        const levelBonusList = [1, 1.6, 1.5, 1.4, 1.3, 1.5]
        // 假設加成是攻擊力的 10%
        this.attack = this.attack * levelBonusList[this.level + 1]
        this.health = this.health * this.levelBonusList[this.level + 1]
    }
    levelUp() {
        this.level++
        this.getBonus()
    }
}

export default ChessPiece
// 創建一個自走棋棋子
// const piece = new ChessPiece(chessList[race]);

// 攻擊一個對手棋子
// const opponentPiece = new ChessPiece("Orc Warrior", "Orc", 30, 80, "None");
// piece.attackPiece(opponentPiece);
