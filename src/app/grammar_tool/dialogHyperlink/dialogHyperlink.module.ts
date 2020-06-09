import { TestEditService } from './../../testedit/_services/testEdit.service';
import { BaseService } from 'app/share/base.service';
import { SharedModule } from './../../share/shared.module';
import { DialogHyperlinkComponent } from './_controller/dialog-hyperlink.component';
import { NgModule } from '@angular/core';




@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [],
  exports: [],
  providers: [TestEditService],
  entryComponents: []
})
export class DialogHyperlinkModule {
}
