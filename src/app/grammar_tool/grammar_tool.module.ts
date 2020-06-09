import { DialogHyperlinkComponent } from './dialogHyperlink/_controller/dialog-hyperlink.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GrammarToolRouting } from './grammar_tool.routing';

import { GrammarToolComponent } from './_controller/grammar_tool.component';

import { SharedModule } from '../share/shared.module';



@NgModule({
  imports: [

    CommonModule,
    SharedModule,
    GrammarToolRouting
  ],
  declarations: [
    GrammarToolComponent,
    DialogHyperlinkComponent
  ],
  entryComponents: [DialogHyperlinkComponent]

})

export class GrammarToolModule { }
