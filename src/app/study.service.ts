import { Injectable } from '@angular/core';
import { TestConsole } from './test-console/test-console.component';
import { Observable, of, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
export { TestConsole } from './test-console/test-console.component';

// 問題データ
export type QuestionData = { name: string, title: string };

// ファイルのデータ
export type FileData = { fileName: string, content: string };

// プロパティへのファイルアタッチ
const FILE_ATTACH_KEY = "__test_file_attach__";

// プロパティへのソースマップアタッチ
const SOURCE_MAP_KEY = "__source_map_attach__";

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  private static classMap: { [key: string]: { title: string, constructor: Function } } = {};

  private testConsole: TestConsole;

  constructor(private http: HttpClient) { }

  public static entryQuestion(name: string, title: string, constructor: Function) {
    this.classMap[name] = { title: title, constructor: constructor };
  }

  public setTestConsole(cons: TestConsole): void {
    this.testConsole = cons;
  }

  public getQuestionList(): QuestionData[] {
    let result: QuestionData[] = [];
    Object.keys(StudyService.classMap).sort().forEach(key => {
      result.push({ name: key, title: StudyService.classMap[key].title });
    });
    return result;
  }

  /**
   * 実行する
   * @param name 
   */
  public execute(name: string): Observable<any> {
    return Observable.create(observer => {
      this.testConsole.reset();
      this.testConsole.clear();
      this.createQuestion(name).subscribe(obj => {
        this.testConsole.println('"' + name + '"を開始します。');
        let result = obj.main();
        if (result instanceof Promise) {
          let promise = result as Promise<any>;
          promise.then(val => {
            observer.next(val);
            observer.complete();
            this.testConsole.reset();
          }, err => {
            observer.error(err);
            this.testConsole.reset();
          });
        } else {
          observer.next(result);
          observer.complete();
          this.testConsole.reset();
        }
      }, err => observer.error(err));
    });
  }

  /**
   * 問題を作成する
   * @param name 
   */
  private createQuestion(name: string): Observable<IQuestion> {
    let data = StudyService.classMap[name];
    if (!data) {
      return Observable.create(observer => observer.error("不明な名前:" + name));
    }
    let obj = new data.constructor.prototype.constructor(this.testConsole) as IQuestion;
    return Observable.create(observer => {
      let reader = [];
      if (data.constructor.prototype[FILE_ATTACH_KEY]) {
        let files: { [key: string]: string } = data.constructor.prototype[FILE_ATTACH_KEY];
        // ファイルの読み込みが必要
        for (let key in files) {
          let fname = "assets/" + files[key];
          reader.push(this.http.get(fname, {
            responseType: 'text'
          }).pipe(
            map(res => {
              obj[key] = { fileName: fname, content: res };
              return res;
            }),
            catchError(err => {
              throw "ファイルが見つかりません:" + files[key];
            })
          ));
        }
      }
      if (data.constructor.prototype[SOURCE_MAP_KEY]) {
        // ソースマップをアタッチする
        let keyList: string[] = data.constructor.prototype[SOURCE_MAP_KEY];
        reader.push(this.getSourceMap().pipe(
          map(res => {
            keyList.forEach(key => obj[key] = res);
          }),
          catchError(err => {
            throw "main.js.mapの読み込みに失敗しました。";
          })
        ));
      }
      if (reader.length == 0) {
        observer.next(obj);
        observer.complete();
      } else {
        merge.apply(null, reader).subscribe(v => {
          observer.next(obj);
          observer.complete();
        }, err => {
          observer.error(err);
        });
      }
    });
  }

  /**
   * ソースマップを読み込む
   */
  public getSourceMap(): Observable<FileData[]> {
    return this.http.get("main.js.map").pipe(map(res => {
      let result: FileData[] = [];
      let srcMap: { sources: string[], sourcesContent: string[] } = res as any;
      for (let i = 0; i < srcMap.sources.length; i++) {
        if (srcMap.sources[i].endsWith(".ts")) {
          result.push({ fileName: srcMap.sources[i].substr("webpack:///".length), content: srcMap.sourcesContent[i] });
        }
      }
      return result;
    }));
  }
}

/**
 * 問題クラス
 */
export interface IQuestion {
  main();
}

/**
 * 問題のデコレータ
 * @param title 問題名称 
 */
export function Question(title: string) {
  return function (constructor: Function) {
    StudyService.entryQuestion(constructor.name, title, constructor);
  }
}

/**
 * テストファイル用のデコレータ
 * @param fileName ファイル名
 */
export function TestFile(fileName: string) {
  return function (target, name: string) {
    if (!target[FILE_ATTACH_KEY]) {
      target[FILE_ATTACH_KEY] = {};
    }
    target[FILE_ATTACH_KEY][name] = fileName;
  }
}

/**
 * ソースマップ連携用のデコレータ
 */
export function SourceMap(target, name: string) {
  if (!target[SOURCE_MAP_KEY]) {
    target[SOURCE_MAP_KEY] = [];
  }
  target[SOURCE_MAP_KEY].push(name);
}
