class ChessPiece {
    constructor({ name, race, attack, health, counter }) {
        this.name = name;
        this.race = race;
        this.attack = attack;
        this.health = health;
        this.counter = counter;
        this.level = 1
    }

    // 攻擊對手棋子
    attackPiece(opponentPiece) {
        opponentPiece.health -= this.attack;
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
        // 假設加成是攻擊力的 10%
        return this.attack * 0.1;
    }
    levelUp() {
        this.level++
    }
}

const chessList = {
    cavalry: { name: '騎兵', race: 'cavalry', attack: 25, health: 150, counter: 'shield' },
    shield: { name: '盾兵', race: 'shield', attack: 25, health: 150, counter: 'spearman' },
    spearman: { name: '槍兵', race: 'spearman', attack: 25, health: 150, counter: 'cavalry' },
    archer: { name: '弓兵', race: 'archer', attack: 40, health: 75, counter: 'handCannoneer' },
    handCannoneer: { name: '火槍兵', race: 'handCannoneer', attack: 40, health: 75, counter: 'horseArcher' },
    horseArcher: { name: '弓騎兵', race: 'horseArcher', attack: 40, health: 75, counter: 'archer' }
}

// 創建一個自走棋棋子
const piece = new ChessPiece(chessList[race]);

// 攻擊一個對手棋子
// const opponentPiece = new ChessPiece("Orc Warrior", "Orc", 30, 80, "None");
// piece.attackPiece(opponentPiece);

// // 獲取種族和效果
// console.log(piece.getRace()); // Output: Human
// console.log(piece.getEffect()); // Output: None

// // 獲取加成
// console.log(piece.getBonus()); // Output: 5
