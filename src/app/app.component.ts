import { Component, OnInit, ViewChild } from '@angular/core';
import { StudyService, QuestionData } from './study.service';
import { TestConsole } from './test-console/test-console.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  questionList: QuestionData[];
  selectName: string;
  executeFlag: boolean;

  @ViewChild("console") testConsole: TestConsole;

  constructor(private studyService: StudyService) {
    // 
  }

  ngOnInit(): void {
    this.questionList = this.studyService.getQuestionList();
    this.selectName = this.questionList[0].name;
    this.studyService.setTestConsole(this.testConsole);
    this.studyService.getSourceMap();
  }

  onExecute(): void {
    this.executeFlag = true;
    this.studyService.execute(this.selectName).subscribe(res => {
      this.testConsole.println('"' + this.selectName + '"が終了しました。');
      if (res !== undefined) {
        this.testConsole.println("result=" + res);
      }
      this.executeFlag = false;
    }, err => {
      this.testConsole.println("エラーが発生しました。\n" + err);
      this.executeFlag = false;
    });
  }
}
