import { NgModule } from '@angular/core';
import { ManagementComponent } from './_controller/management.component';
import { ManagementRouting } from './management.routing';
import { SharedModule } from 'app/share/shared.module';
import { ManagementService } from './_services/management.service';

@NgModule({
  imports: [
    ManagementRouting,
    SharedModule
  ],
  declarations: [ManagementComponent],
  exports: [],
  providers: [ManagementService],
  entryComponents: [ManagementComponent]
})
export class ManagementModule { }
