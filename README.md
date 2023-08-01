# 自走棋遊戲

九宮格自走棋遊戲，使用 HTML CSS Javascript 製作，遊戲簡單易上手

功能:
- 棋盤布置棋子
- 戰鬥流程
- 戰鬥加速
- 戰鬥結束事件
- 多國語系
- 售出棋子事件

基礎設定:
- 總共有九種兵種棋子
- 兵種之間有相剋，相剋時傷害雙倍
- 戰鬥時棋子陣亡，則移出棋盤
- 戰鬥結束時棋盤上棋子，可恢復所受到傷害的50%
- 三種相同等級的兵種可以升級，最高三級(每級為前一級的1.6倍血量與傷害)
- 棋子售出1級為原價售出(2級以上，合成所需的棋子總價*0.8)
- 刺客、醫療兵、戰鼓者非攻擊單位
- 總計20關
- 每次通過可以得到金幣

往後計畫:
- 線上多人對戰模式
- 單人模式關卡隨機性

## [DEMO](https://auto-chess.vercel.app/)

本地運行

NPM

```bash
npm i
npm run dev
```

http://127.0.0.1:81

下載最新檔案:

```bash
git clone https://github.com/cingfong/auto-chess.git
```

或 [download archive](https://github.com/cingfong/auto-chess/archive/refs/heads/main.zip)

# Auto Chess Game


