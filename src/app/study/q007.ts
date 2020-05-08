import { IQuestion, TestConsole, Question } from '../study.service';

/**
 * Q007 最短経路探索
 *
 * 壁を 'X' 通路を ' ' 開始を 'S' ゴールを 'E' で表現された迷路で、最短経路を通った場合に
 * 何歩でゴールまでたどり着くかを出力するプログラムを実装してください。
 * もし、ゴールまで辿り着くルートが無かった場合は -1 を出力してください。
 * なお、1歩は上下左右のいずれかにしか動くことはできません（斜めはNG）。
 *
 * 迷路の横幅と高さは毎回異なりますが、必ず長方形（あるいは正方形）となっており、外壁は全て'X'で埋まっています。
 *

[迷路の例]
XXXXXXXXX
XSX    EX
X XXX X X
X   X X X
X X XXX X
X X     X
XXXXXXXXX

[答え]
14
 */
@Question("迷路の最短距離検索")
export class Q007 implements IQuestion {
    private testConsole: TestConsole;

    /**
     * コンストラクタ
     * 実行時に自動生成される際、testConsoleが渡されてくる
     * @param testConsole コンソール操作用のオブジェクト
     */
    constructor(testConsole: TestConsole) {
        this.testConsole = testConsole;
    }
    async main() {
        // TestConsoleを使って出力してください
        let maze = this.makeMaze();
        console.log(maze);
        for (let str of maze) {
            this.testConsole.println(str);
        }
        // TODO 迷路の最短距離を探す
    }

    /**
     * 迷路を作成する
     */
    private makeMaze(): string[] {
        let data: string[] = [];
        let width = Math.floor(Math.random() * 5) + 5;
        let height = Math.floor(Math.random() * 5) + 5;

        for (let y = 0; y < height * 2 + 3; y++) {
            data.push("");
        }
        for (let x = 0; x < width * 2 + 3; x++) {
            data[0] += "X";
            data[height * 2 + 3 - 1] += "X";
        }

        for (let y = 1; y < data.length - 1; y++) {
            data[y] += 'X';
            for (let x = 1; x < width * 2 + 3 - 1; x++) {
                data[y] += ' ';
            }
            data[y] += 'X';
        }
        let setChar = (x: number, y: number, ch: string) => data[y] = data[y].substring(0, x) + ch + data[y].substr(x + 1);
        let startX = Math.floor(Math.random() * (width + 1)) * 2 + 1;
        let startY = Math.floor(Math.random() * (height + 1)) * 2 + 1;
        setChar(startX, startY, 'S');
        while (true) {
            let endX = Math.floor(Math.random() * (width + 1)) * 2 + 1;
            let endY = Math.floor(Math.random() * (height + 1)) * 2 + 1;
            if (Math.abs(startX - endX) + Math.abs(startY - endY) > 10) {
                setChar(endX, endY, 'E');
                break;
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let xx = x * 2 + 2;
                let yy = y * 2 + 2;
                setChar(xx, yy, 'X');
                switch (Math.floor(Math.random() * 4)) {
                    case 0:
                        setChar(xx, yy - 1, 'X');
                        break;
                    case 1:
                        setChar(xx, yy + 1, 'X');
                        break;
                    case 2:
                        setChar(xx - 1, yy, 'X');
                        break;
                    case 3:
                        setChar(xx + 1, yy, 'X');
                        break;
                }
            }
        }
        return data;
    }
}
// 完成までの時間: xx時間 xx分
