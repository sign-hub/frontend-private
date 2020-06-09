import { DomSanitizer } from '@angular/platform-browser';
import {
  AfterViewInit, Component, OnInit, ComponentFactoryResolver, HostListener
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../share/base.component';
import { TestPlayerService } from '../_services/testPlayer.service';
import { Question, TransitionType } from '../../../models/question';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { SComponent, SSlide, SComp, SlideComponent, SlideType, SCompType, TestResult, QuestionResult } from '../../../models/component';
import { ResizeEvent } from 'angular-resizable-element';
import { UserInfoComponent } from '../_controller/userInfo.component';
import { FileUploader } from 'ng2-file-upload';
import { UploadsDialogComponent } from '../_controller/uploadsDialog.component';
import { forEach } from '@angular/router/src/utils/collection';
import { ProfileSerivce } from '../../../profile/_service/profile.service';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../../media/_model/photo';
import { MediaService } from '../../media/_services/media.service';
import { Grammar, GrammarStatus } from '../../testedit/_model/grammar';
import { GrammarPart } from '../../testedit/_model/grammarpart';

declare var jQuery: any;

@Component({
  selector: 'app-question',
  templateUrl: '../_views/testPlayer.component.html',
  styleUrls: ['../_views/testPlayer.component.scss', '../../../share/e-home.scss']
})
export class TestPlayerComponent extends BaseComponent implements OnInit {

  hieghtQuestion: string;
  heightTestEdit: string;
  isLoading: boolean;
  medias: Array<Photo>;
  selectedTab: string;
  allMedias: Array<Photo>;
  mediaLoading: boolean;
  preview: boolean;
  currentBlock: string;
  toc: any;
  grammar: Grammar;
  grammarPart: GrammarPart;
  grammarTitle: string;

  private uploader: FileUploader = new FileUploader({ url: Baseconst.getCompleteBaseUrl() });
  private hasBaseDropZoneOver = false;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private testPlayerService: TestPlayerService,
    private location: Location,
    public dialog: MdDialog,
    private sanitizer: DomSanitizer) {
    super(router, mdSnackBar);
    this.hieghtQuestion = this.height + 'px';
    this.heightTestEdit = this.height + 'px';

  }


  ngOnInit() {
    this.allMedias = new Array();
    this.init();
  }


  init() {
    this.grammar = new Grammar();
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      if (params == undefined || params == null ||
        params.id == undefined || params.id == null || params.id == '') {
        const navigationExtras: NavigationExtras = {
        };
        this.router.navigate(['/home/grammar_tool/grammarlist'], navigationExtras);
        return;
      }
      this.testPlayerService.requestGetGrammar(params.id).subscribe(res => {
        if (res.status === 'OK') {
          this.grammar = res.response;
          this.grammarTitle = this.grammar.grammarName;
          if (params.link != undefined && params != null &&
            params.link != undefined && params.link != null && params.link != '') {
            this.getGrammarPart({ uuid: params.link });
          }
        } else {
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    });
  }

  getGrammarPart(grammar) {

    const uuid = grammar.uuid;
    this.grammarPart = new GrammarPart();
    this.isLoading = true;
    this.route.queryParams.subscribe(grammar => {
      this.testPlayerService.requestGetGrammarPart(uuid).subscribe(res => {
        if (res.status === 'OK') {
          res.response.html = this.sanitizer.bypassSecurityTrustHtml(res.response.html);
          this.grammarPart = res.response;
          this.grammarTitle = this.grammarPart.name;
        } else {
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    });
  }

  @HostListener('click', ['$event.target']) hyperlink(event) {
    const attributes = event.attributes;
    if (event.hasAttribute('data')) {
      if (event.offsetParent.className === 's-center') {
        this.getGrammarPart({ 'uuid': attributes[1].value });
      }
    }
  }



}
