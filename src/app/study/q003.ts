import { IQuestion, TestConsole, Question, TestFile, FileData } from '../study.service';

/**
 * Q003 集計と並べ替え
 *
 * 以下のデータファイルを読み込んで、出現する単語ごとに数をカウントし、アルファベット辞書順に並び変えて出力してください。
 * assets/q003.txt
 * 単語の条件は以下となります
 * - "I"以外は全て小文字で扱う（"My"と"my"は同じく"my"として扱う）
 * - 単数形と複数形のように少しでも文字列が異れば別単語として扱う（"dream"と"dreams"は別単語）
 * - アポストロフィーやハイフン付の単語は1単語として扱う（"isn't"や"dead-end"）
 *
 * 出力形式:単語=数
 *
[出力イメージ]
（省略）
highest=1
I=3
if=2
ignorance=1
（省略）

 * 参考
 * http://eikaiwa.dmm.com/blog/4690/
 */
@Question("単語のカウントを表示する")
export class Q003 implements IQuestion {
    private testConsole: TestConsole;

    /**
     * 以下の記述で assets/q003.txt の内容が入る
     */
    @TestFile("q003.txt")
    private fileData: FileData;

    /**
     * コンストラクタ
     * 実行時に自動生成される際、testConsoleが渡されてくる
     * @param testConsole コンソール操作用のオブジェクト
     */
    constructor(testConsole: TestConsole) {
        this.testConsole = testConsole;
    }

    async main() {
        // 連想配列
        let strCountList: { [key: string]: number; } = {};
        let arrayStrig = this.fileData.content.toLowerCase().split(" ");

        for (let item of arrayStrig) {
            if(strCountList[item]) {
                strCountList[item] = strCountList[item] + 1;
            } else {
                strCountList[item] = 1;
            }
        }

        for (let str in strCountList) {
            this.testConsole.println(str + "=" + strCountList[str]);
        }
    }
}
// 完成までの時間: 15分
