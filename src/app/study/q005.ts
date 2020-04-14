import { IQuestion, TestConsole, Question, TestFile, FileData } from '../study.service';

/**
 * 作業時間管理クラス
 * 自由に修正してかまいません
 */
class WorkData {
    /** 社員番号 */
    private number: string;

    /** 部署 */
    private department: string;

    /** 役職 */
    private position: string;

    /** Pコード */
    private pCode: string;

    /** 作業時間(分) */
    private workTime: number;
}

/**
 * Q005 データクラスと様々な集計
 *
 * 以下のファイルを読み込んで、WorkDataクラスのインスタンスを作成してください。
 * assets/q005.txt
 * (先頭行はタイトルなので読み取りをスキップする)
 *
 * 読み込んだデータを以下で集計して出力してください。
 * (1) 役職別の合計作業時間
 * (2) Pコード別の合計作業時間
 * (3) 社員番号別の合計作業時間
 * 上記項目内での出力順は問いません。
 *
 * 作業時間は "xx時間xx分" の形式にしてください。
 * また、WorkDataクラスは自由に修正してください。
 *
[出力イメージ]
部長: xx時間xx分
課長: xx時間xx分
一般: xx時間xx分
Z-7-31100: xx時間xx分
I-7-31100: xx時間xx分
T-7-30002: xx時間xx分
（省略）
194033: xx時間xx分
195052: xx時間xx分
195066: xx時間xx分
（省略）
 */
@Question("様々なフィールドで集計")
export class Q005 implements IQuestion {
    @TestFile("q005.txt")
    private fileData: FileData;

    async main() {
        // TestConsoleを使って出力してください
    }
}
// 完成までの時間: xx時間 xx分