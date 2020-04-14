import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConsoleComponent } from './test-console.component';

describe('TestConsoleComponent', () => {
  let component: TestConsoleComponent;
  let fixture: ComponentFixture<TestConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
