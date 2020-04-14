import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Q001 } from './q001';
import { Q002 } from './q002';
import { Q003 } from './q003';
import { Q004 } from './q004';
import { Q005 } from './q005';
import { Q006 } from './q006';
import { Q007 } from './q007';
import { Q008 } from './q008';
import { Q009 } from './q009';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    { provide: Q001 },
    { provide: Q002 },
    { provide: Q003 },
    { provide: Q004 },
    { provide: Q005 },
    { provide: Q006 },
    { provide: Q007 },
    { provide: Q008 },
    { provide: Q009 }
  ]
})
export class StudyModule { }
