import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './_controller/home.component';
import { AuthenGuard } from '../login/_guard/authen.guard';
import { PlatformGuard } from '../login/_guard/platform.guard';
import { AtlasGuard } from '../login/_guard/atlas.guard';
import { TranslationModule } from '../translation.module';
import { HomeService } from './_service/home.service';
import { SharedModule } from '../share/shared.module';
import { ProfileSerivce } from '../profile/_service/profile.service';
import { TestEventService } from './_service/testEvent.service';
import { TestingToolGuard } from 'app/login/_guard/testingtool.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslationModule,
    SharedModule
  ],
  declarations: [HomeComponent],
  exports: [],
  providers: [AuthenGuard, HomeService, ProfileSerivce, TestEventService, AtlasGuard, TestingToolGuard, PlatformGuard],
  entryComponents: []
})
export class HomeModule {
}
