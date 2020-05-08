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

    public get getNumber(): string {
        return this.number;
    }

    public get getPosition(): string {
        return this.position;
    }

    public get getPCode(): string{
        return this.pCode;
    }

    public get getWorkTime(): number {
        return this.workTime;
    }

    constructor(number: string, department: string, position: string, pCode: string, workTime: number) {
        this.number = number;
        this.department = department;
        this.position = position;
        this.pCode = pCode;
        this.workTime = workTime;
    }
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
    private testConsole: TestConsole;

    @TestFile("q005.txt")
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
        const tmpList = this.fileData.content.split('\n');  // fileDataを1行ごとに配列に格納
        const dataList: WorkData[] = [];
        for(let i = 1; i < tmpList.length; i++) {
            let tmpLine = tmpList[i].split(',')
            dataList.push(new WorkData(tmpLine[0], tmpLine[1], tmpLine[2], tmpLine[3], parseInt(tmpLine[4])));
        }

        const byPosition: Map<string, number> = new Map();
        const byPCode: Map<string, number> = new Map();
        const byEmployeeNumbre: Map<string, number> = new Map();
        dataList.forEach(workData => {
            const workTime = workData.getWorkTime;

            // 役職別の合計作業時間
            const position = workData.getPosition;
            byPosition.set(position, byPosition.has(position) ? byPosition.get(position) + workTime : workTime);

            // Pコード別の合計作業時間
            const pCode = workData.getPCode;
            byPCode.set(pCode, byPCode.has(pCode) ? byPCode.get(pCode) + workTime : workTime);

            // 社員番号別の合計作業時間
            const employeeNumber = workData.getNumber;
            byEmployeeNumbre.set(employeeNumber, byEmployeeNumbre.has(employeeNumber) ? byEmployeeNumbre.get(employeeNumber) + workTime : workTime);

        });

        // (1) 役職別の合計作業時間
        byPosition.forEach((value, key) => this.testConsole.println(key + ':' + Math.floor(value / 60) + '時間' + value % 60 + '分'));
        // (2) Pコード別の合計作業時間
        byPCode.forEach((value, key) => this.testConsole.println(key + ':' + Math.floor(value / 60) + '時間' + value % 60 + '分'));
        // (3) 社員番号別の合計作業時間
        byEmployeeNumbre.forEach((value, key) => this.testConsole.println(key + ':' + Math.floor(value / 60) + '時間' + value % 60 + '分'));

    }
}
// 完成までの時間: 5時間
