import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*import {FlexLayoutModule} from '@angular/flex-layout';*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../translation.module';
import { LoadImageDirective, LoadVideoDirective, PasswordConfirm } from './directives';
import { FileUploadModule, FileSelectDirective } from 'ng2-file-upload';
import { RolePipe } from './pipe/role.pipe';
import { StatusPippe } from './pipe/status.pipe';
import { DndModule } from 'ng2-dnd';
import { SafeUrlPipe } from './pipe/safeUrl.pipe';
import { EscapeHtmlPipe } from './pipe/keep-html.pipe';

import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import { MiniJoditComponent } from './jodit';

@NgModule({
  declarations: [LoadImageDirective,
    LoadVideoDirective,
    RolePipe,
    StatusPippe,
    SafeUrlPipe,
    EscapeHtmlPipe,
    PasswordConfirm,
    MiniJoditComponent
  ],
  imports: [
    /*FlexLayoutModule,*/
    TranslationModule,
    FileUploadModule,
    DndModule],
  exports: [MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    /*FlexLayoutModule,*/
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdNativeDateModule,
    TranslationModule,
    LoadImageDirective,
    LoadVideoDirective,
    FileSelectDirective,
    RolePipe,
    SafeUrlPipe,
    StatusPippe,
    EscapeHtmlPipe,
    PasswordConfirm,
    DndModule,
    MiniJoditComponent
  ],
  providers: []
})
export class SharedModule {
}
