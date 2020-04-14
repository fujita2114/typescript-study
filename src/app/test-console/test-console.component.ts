import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Observer, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * コンソールインタフェース
 */
export interface TestConsole {
  readLine(): Promise<string>;
  readLines(lines: number): Promise<string[]>;
  print(text: string): TestConsole;
  println(text: string): TestConsole;
  clear(): void;
  // 入力をリセットする
  reset(): void;
}

class InputCache {
  lines: number;
  observer: Observer<string[]>;
  result: string[];

  constructor(observer: Observer<string[]>, lines: number = 1) {
    this.observer = observer;
    this.lines = lines;
    this.result = [];
  }

  /**
   * trueで完了
   * @param text 入力行
   */
  addLine(text: string): boolean {
    this.result.push(text);
    if (this.result.length >= this.lines) {
      // 終了
      this.observer.next(this.result);
      this.observer.complete();
      return true;
    }
    return false;
  }
}

@Component({
  selector: 'app-test-console',
  templateUrl: './test-console.component.html',
  styleUrls: ['./test-console.component.css']
})
export class TestConsoleComponent implements OnInit, TestConsole {
  @ViewChild("inputArea") inputArea: ElementRef;
  @ViewChild("contentTop") contentTop: ElementRef;
  @ViewChild("inputTop") inputTop: ElementRef;

  outputList: string[];
  prefixText: string;
  inputLeft: string;
  inputSelection: string;
  inputRight: string;
  divStyle: any;
  focusFlag: boolean;
  @Input("style") parentStyle: string;

  private inputList: InputCache[] = [];
  // inputListの前に入力された文字列群
  private inputLineList: string[] = [];

  constructor() {
    this.outputList = [];
    this.prefixText = "";
  }

  ngOnInit() {
    if (this.parentStyle) {
      let obj = {};
      for (let css of this.parentStyle.split(";")) {
        let ix = css.indexOf(":");
        if (ix > 0) {
          obj[css.substring(0, ix).trim()] = css.substr(ix + 1).trim();
        }
      }
      this.divStyle = obj;
    }
  }

  onSelChange($event): void {
    this.focusFlag = true;
    setTimeout(() => this.checkInput($event != null));
  }
  private checkInput(resizeFlag?: boolean): void {
    let text: string = this.inputArea.nativeElement.value;
    let flag = false
    let ix = text.lastIndexOf("\n");
    if (ix >= 0) {
      let result = text.substring(0, ix);
      this.outputList.push(this.prefixText + result);
      text = text.substr(ix + 1);
      this.inputArea.nativeElement.value = text;
      this.inputArea.nativeElement.setSelectionRange(text.length, text.length);
      this.prefixText = "";
      result.split("\n").forEach(v => this.newLine(v));
    }
    let st = this.inputArea.nativeElement.selectionStart;
    let ed = this.inputArea.nativeElement.selectionEnd;
    this.inputLeft = text.substring(0, st);
    this.inputRight = text.substr(ed);
    this.inputSelection = text.substring(st, ed);
    if (resizeFlag) {
      setTimeout(() => {
        this.contentTop.nativeElement.scrollTop = this.contentTop.nativeElement.scrollHeight;
        this.inputArea.nativeElement.style.marginTop = (-this.contentTop.nativeElement.scrollTop) + "px";
        //this.inputArea.nativeElement.style.offsetLeft = this.inputTop.nativeElement.offsetLeft + "px";
        this.inputArea.nativeElement.style.width = (this.contentTop.nativeElement.offsetWidth - this.inputArea.nativeElement.offsetLeft) + "px";
      });
    }
  }

  onRequestFocus($event): void {
    if (window.getSelection().isCollapsed) {
      setTimeout(() => {
        this.inputArea.nativeElement.focus();
        this.onSelChange(null);
      });
    }
  }

  /**
   * 新しい行が入力された
   * @param text 
   */
  private newLine(text: string): void {
    if (this.inputList.length > 0) {
      if (this.inputList[0].addLine(text)) {
        this.inputList.splice(0, 1);
      }
    } else {
      this.inputLineList.push(text);
    }
  }

  /**
   * 既に入力済みの行をチェックする
   */
  private inputLineCheck(): void {
    if (this.inputLineList.length > 0) {
      let back = this.inputLineList;
      this.inputLineList = [];
      back.forEach(v => this.newLine(v));
    }
  }

  readLine(): Promise<string> {
    return new Observable(observer => {
      this.inputList.push(new InputCache(observer));
      this.inputLineCheck();
    }).pipe(map(str => str[0])).toPromise();
  }
  readLines(lines: number): Promise<string[]> {
    return Observable.create(observer => {
      this.inputList.push(new InputCache(observer, lines));
      this.inputLineCheck();
    }).toPromise();
  }
  print(text: string): TestConsole {
    let ix = text.lastIndexOf("\n");
    if (ix < 0) {
      this.prefixText += text;
      return;
    }
    this.outputList.push(this.prefixText + text.substring(0, ix));
    this.prefixText = text.substr(ix + 1);
    this.checkInput(true);
    return this;
  }
  println(text: string): TestConsole {
    this.outputList.push(this.prefixText + text);
    this.prefixText = "";
    this.checkInput(true);
    return this;
  }
  clear(): void {
    this.outputList = [];
    this.prefixText = "";
    this.inputArea.nativeElement.value = "";
    this.checkInput();
  }
  reset(): void {
    this.inputList = [];
    this.inputLineList = [];
  }
}