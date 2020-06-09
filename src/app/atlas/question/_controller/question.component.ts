import {
  AfterViewInit, Component, OnInit, ComponentFactoryResolver, ElementRef, ViewChild, HostListener, OnDestroy
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../share/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { MediaService } from '../../media/_services/media.service';
import { Photo } from '../../media/_model/photo';
import { QuestionService } from '../_services/question.service';
import { Question, TransitionType } from '../../../models/question';
import { SComponent, SSlide, SComp, SlideComponent, SlideType } from '../../../models/component';
import { InputFieldComponent } from '../_controller/inputField.component';
import { RangeComponent } from '../_controller/range.component';
import { TextAreaComponent } from './textArea.component';
import { TextBlockComponent } from './textblock.component';
import { ResizeEvent } from 'angular-resizable-element';
import { ConfigSlideComponent } from './configSlide.component';
import { CheckboxComponent } from './checkbox.component';
import { RadioComponent } from './radio.component';
import { ClickareaComponent } from './clickarea.component';
import { ImageComponent } from './image.component';
import { ButtonComponent } from './button.component';
import { DeleteSlideComponent } from './delSlide.component';
import { ImportSlideComponent } from './importSlide.component';
import { VideoComponent } from './video.component';

import { TableComponent } from './table.component';
import { UploadsComponent } from './uploads.component';
import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';

import { TooltipPosition } from '@angular/material';
import { Subject } from 'rxjs';


declare var jQuery: any;

@Component({
  selector: 'app-question',
  templateUrl: '../_views/question.component.html',
  styleUrls: ['../../../share/e-home.scss', '../_views/question.component.scss']
})
export class QuestionComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  hieghtQuestion: string;
  heightQuestionCenter: string;
  heightQuestionCenterContent: string;
  heightContentTab: string;
  widthQuestionCenter: string;
  medias: Array<Photo>;
  selectedTab: string;
  allMedias: Array<Array<Photo>>;
  mediaLoading: boolean;
  testId: string;
  question: Question;
  questionLoading: boolean;
  components: Array<Array<SComponent>>;
  currentSlideId: string;
  currentSlide: SSlide;
  currentSlideName: string;
  currentQuestionName: string;
  mouving: boolean;
  draggingId: string;
  saveOnChange: boolean;
  step: number;
  backgroundColor: string;
  componentsBackup: Array<any>;
  componentsBackupNum: number;
  timer: any;
  rtime;
  timeout: any;
  delta = 200;
  grid: boolean;
  listView = false;
  gridView = true;
  target: any;
  tableComponents: any[] = [];
  allMediasContainer: Array<Array<Photo>>;
  aspectRatio = true;
  private _unsubscribeAll: Subject<any>;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private questionService: QuestionService,
    private location: Location,
    public elemRef: ElementRef,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this._unsubscribeAll = new Subject();
    this.height = (window.innerHeight);
    this.width = (window.innerWidth);
    this.height = this.height - 100 + 30; //dimensione meno il menù + di quanto è spostato il titolo
    let v = this.width - 470; //right = 200; left=250; margin centrale 10+10;
    let h = this.height;
    if ((this.width - 470) < ((this.height - 110) * 1.77)) {
      v = this.width - 470;
      h = v / 1.77;
      h = Math.round(h);
      this.heightQuestionCenterContent = h  + 'px';
      this.heightQuestionCenter = (h+30) + 'px';
    } else {
      v = (this.height-110) * 1.77;
      v = Math.round(v);
      h = v / 1.77;
      h = Math.round(h);
      /*this.heightQuestionCenter = (h - 60) + 'px';
      this.heightQuestionCenterContent = (h - 110) + 'px';*/
      this.heightQuestionCenterContent = h  + 'px';
      this.heightQuestionCenter = (h+30) + 'px';
    }


    this.hieghtQuestion = (h - 100) + 'px';
    this.heightContentTab = (h - 150) + 'px';
    // this.heightQuestionCenter = (h - 80) + 'px';
    // this.heightQuestionCenterContent = (h - 110) + 'px';
    this.widthQuestionCenter = '' + v + 'px';
    this.step = Math.round(Math.round(v) / 40);
    this.draggingId = null;
    this.saveOnChange = false;
    this.backgroundColor = '#fff';
    this.currentSlideName = '';
    this.currentQuestionName = '';
    this.componentsBackupNum = 5; //numero massimo di backup contemporanei
    this.componentsBackup = new Array();
    // console.log(parseFloat(this.widthQuestionCenter)/parseFloat(this.heightQuestionCenterContent));

  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    //this.loadMedia('PHOTO');
    this.allMedias = new Array();
    this.initQuestion();
    this.initInputDefault();
    this.loadMedias().then(() => {
      this.loadQuesionInfo();
    });
  }

  initQuestion() {
    this.question = new Question();
    this.question.slides = [];
  }

  loadQuesionInfo() {
    this.route.queryParams
      .takeUntil(this._unsubscribeAll)
      .subscribe(params => {
        this.testId = params.id;
        if (localStorage.getItem('grid_' + params.id) == null || localStorage.getItem('grid_' + params.id) == undefined) {
          this.grid = false;
          localStorage.setItem('grid_' + this.testId, String(this.grid));
        } else {
          this.grid = localStorage.getItem('grid_' + this.testId) == 'false' ? false : true;
        }
        this.questionService.requestGetQuestionInfo(params.id)
          .takeUntil(this._unsubscribeAll)
          .subscribe(res => {
            if (res.status === 'OK') {
              this.question = res.response;
              this.currentQuestionName = this.question.name;
              if (this.question.slides == undefined || this.question.slides == null || this.question.slides.length <= 0) {
                this.addSlide();
              } else {
                this.changeSlide(this.question.slides[0].slideId);
              }
              this.initSlides();
              this.configureResizableObjects();
              this.mediaLoading = false;
              this.saveOnChange = true;
            } else {
              this.processStatusError(res.errors);
              console.error('Server error');
            }
          });
      });
  }


  loadMedias() {
    const promise = new Promise((resolve, reject) => {
      this.loadMedia('PHOTO').then(() => {
        this.loadMedia('VIDEO').then(() => {
          this.selectedTab = 'PHOTO';
          resolve();
        });
      });

      //this.loadMedia('AUDIO');
      //this.loadMedia('TEXT');
      //this.selectedTab = 'PHOTO';
      //resolve();
    });
    return promise;
  }

  loadMedia(type: string) {
    this.mediaLoading = true;
    this.medias = [];
    const promise = new Promise((resolve, reject) => {
      if (this.allMedias[type] != undefined && this.allMedias[type] != null) {
        //this.medias = this.allMedias[type];
        return;
      }

      this.mediaService.getMedia(type)
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            //this.medias = res.response;
            this.allMedias[type] = res.response;
          } else {
            console.log('Server error');
            this.processStatusError(res.errors);
          }
          this.allMediasContainer = this.allMedias;
          resolve();
        });
    });
    return promise;
  }


  changeTab(index) {
    //this.loadMedia(this.getTabIndex(index));
    this.selectedTab = this.getTabIndex(index);
  }

  getTabIndex(index) {
    let tab: string = null;
    switch (index) {
      case 1:
        tab = 'VIDEO';
        break;
      case 0:
        tab = 'PHOTO';
        break;
      case 2:
        tab = 'AUDIO';
        break;
      case 3:
        tab = 'TEXT';
        break;
      default:
        tab = null;
    }
    return tab;
  }

  addSlide() {
    this.questionLoading = true;
    this.questionService.requestAddSlide(this.question.questionId)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          //this.loadQuesionInfo();
          if (this.question.transitionType !== undefined && this.question.transitionType !== null) {
            res.response.transitionType = new Array();
            for (const tt of this.question.transitionType) {
              res.response.transitionType.push(tt);
            }
          }
          this.question.slides.push(res.response);
          this.components[res.response.slideId] = [];
          this.changeSlide(res.response.slideId);
        } else {
          this.processStatusError(res.errors);
          console.error('Server errors');
        }
        this.questionLoading = false;
      });
  }

  changeSlide(slideId) {
    if (this.saveOnChange === true) {
      this.saveCurrentSlide();
    }
    this.currentSlideId = slideId;
    this.getCurrentSlide();
    if (this.currentSlide.options !== undefined && this.currentSlide.options !== null &&
      this.currentSlide.options.color !== undefined && this.currentSlide.options.color !== null) {
      this.backgroundColor = this.currentSlide.options.color;
    } else {
      this.backgroundColor = '#fff';
    }
    if (this.currentSlide.options !== undefined && this.currentSlide.options !== null &&
      this.currentSlide.options.name !== undefined && this.currentSlide.options.name !== null) {
      this.currentSlideName = this.currentSlide.options.name;
    } else {
      this.currentSlideName = '';
    }
    this.configureResizableObjects();
  }

  private configureResizableObjects() {
    setTimeout(() => {
      if (this.components == undefined || this.components == null ||
        this.components[this.currentSlideId] == undefined || this.components[this.currentSlideId] == null) {
        return;
      }
      for (let i = 0; i < this.components[this.currentSlideId].length; i++) {
        const component = this.components[this.currentSlideId][i];
        this.configureResizableObject(component);
      }
    }, 500);
  }

  configureResizableObject(component) {
    if (component === undefined || component === null) {
      return;
    }
    setTimeout(() => {
      if (component.isResizable == true && !component.keepAspectRatio) {
        jQuery('#' + component.id).resizable({
          containment: '#s-content',
          custom: false
        });
        jQuery('#' + component.id).parent().on('resizestop', (e) => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.backupComponents();
            this.resizeComponent(e, component);
          }, 200);
        });
      } else if (component.keepAspectRatio == true) {
        jQuery('#' + component.id).resizable({
          containment: '#s-content',
          custom: true
        });
        jQuery('#' + component.id).parent()
          .on('resize', (e, ui) => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.backupComponents();
              this.resizeComponent(e);
            }, 200);
          });
      }
      setTimeout(() => {
        this.calcScale();
      }, 2000);
    }, 100);
  }

  toggleGrid(event) {
    this.grid = event.checked;
    localStorage.setItem('grid_' + this.testId, String(this.grid));
  }

  initInputDefault() {
    this.components = [];
  }

  initSlides() {
    for (let i = 0; i < this.question.slides.length; i++) {
      this.components[this.question.slides[i].slideId] = this.convertComponents(this.question.slides[i]);
    }
  }

  convertComponents(slide) {
    if (slide == undefined || slide == null ||
      slide.slideContent == undefined || slide.slideContent == null ||
      slide.slideContent.componentArray == undefined || slide.slideContent.componentArray == null) {
      return new Array<SComponent>();
    }
    const ret = new Array<SComponent>();
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();
    const clickAreaArray = new Array<SComponent>();

    for (let i = 0; i < slide.slideContent.componentArray.length; i++) {
      const comp = new SComponent();
      comp.fromSComp(slide.slideContent.componentArray[i], sw, sh, this.step);
      if (comp.mediaId != undefined && comp.mediaId != null && comp.mediaId.trim() != '') {
        comp.url = this.getMediaUrlFromId(comp.componentType, comp.mediaId);
      }
      if (comp.componentType == 'RANGE') {
        this.getLabels(comp);
        this.getTicks(comp);
      }

      if (comp.componentType == 'CHECKABLETABLE') {
        this.tableComponents.push(comp);
      }
      if (comp.componentType == 'CLICK_AREA') {
        clickAreaArray.push(comp);
      } else {
        ret.push(comp);
      }
      //ret.push(comp);
    }
    for (let y = 0; y < clickAreaArray.length; y++) {
      ret.push(clickAreaArray[y]);
    }
    return ret;
  }

  private getMediaUrlFromId(type, mediaId) {
    if (mediaId == undefined || mediaId == null ||
      type == undefined || type == null) {
      return null;
    }
    let g = '';
    if (type === 'IMAGE') {
      g = 'PHOTO';
    }
    if (type === 'VIDEO') {
      g = 'VIDEO';
    }
    if (this.allMedias[g] == undefined || this.allMedias[g] == null) {
      return;
    }
    for (const media of this.allMedias[g]) {
      if (media.mediaId == mediaId) {
        return media.mediaThumbPath;
      }
    }
  }

  private updatePosition(index, x, y) {
    const c: SComponent = this.components[this.currentSlideId][index];
    c.posX = this.calcPosition(x);
    c.posY = this.calcPosition(y);
  }

  addComponent1(e) {
    console.log(e);
  }

  calcPosition(x) {

    x = Math.round(x);
    const mx = x % this.step;
    if (mx >= (this.step / 2)) {
      x = x + (this.step - mx);
    } else {
      x = x - mx;
    }
    return x;
  }

  addComponent(e) {
    console.log(e)
    this.mouving = false;
    let x: number = e.mouseEvent.offsetX;
    let y: number = e.mouseEvent.offsetY;
    const obj: any = e.dragData;
    const component: SComponent = new SComponent();
    if (obj.type !== 'CLICK_AREA') {
      x = this.calcPosition(x);
      y = this.calcPosition(y);
    }
    component.posX = x;
    component.posY = y;
    component.pos = x + ',' + y;
    component.id = 'input_' + new Date().getTime();
    component.isResizable = false;

    if (obj.updated) {
      this.updatePosition(obj.index, x, y);
    } else {
      component.componentType = obj.type;
      switch (obj.type) {
        case 'TEXT':
          component.dimHeight = 40;
          component.dimWidth = 100;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.name = 'input' + new Date().getTime();
          component.chars = 20;
          component.transition = false;
          component.isResizable = true;
          break;
        case 'TEXTAREA':
          component.name = 'textArea' + new Date().getTime();
          component.cols = 50;
          component.rows = 4;
          component.dimHeight = 50;
          component.dimWidth = 100;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.isResizable = true;
          break;
        case 'RADIO':
          component.groupName = 'radio';
          break;
        case 'CHECKBOX':
          component.dimHeight = 15;
          component.dimWidth = 15;
          component.isResizable = false;
          component.groupName = 'checkbox' + new Date().getTime();
          break;
        case 'RANGE':
          component.name = 'range';
          component.isResizable = true;
          component.min = 0;
          component.max = 100;
          component.step = 1;
          component.dimHeight = 40;
          component.dimWidth = 180;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.options = { labelNum: 0 };
          break;
        case 'IMAGE':
        case 'VIDEO':
          if (!!this.target) {
            component.dimHeight = this.target.clientHeight;
            component.dimWidth = this.target.clientWidth;
            component.dim = this.target.clientWidth + ',' + this.target.clientHeight;
          } else {
            component.dimHeight = 80;
            component.dimWidth = 80;
            component.dim = 80 + ',' + 80;
          }
          component.mediaId = obj.mediaId;
          component.url = obj.url;
          component.keepAspectRatio = true;
          component.isResizable = false;
          component.options = { commands: false, slowOption: false };
          break;
        case 'TXTFILE':
        case 'ELANFILE':
          component.dimHeight = 80;
          component.dimWidth = 80;
          component.dim = 80 + ',' + 80;
          component.mediaId = obj.mediaId;
          component.name = obj.mediaName;
          component.url = obj.url;
          component.isResizable = true;
          break;
        case 'CLICK_AREA':
          component.dimHeight = 80;
          component.dimWidth = 100;
          component.dim = 100 + ',' + 80;
          component.isResizable = true;
          break;
        case 'CHECKABLETABLE':
          component.groupName = 'checkabletable';
          component.dimHeight = 80;
          component.dimWidth = 100;
          component.dim = 100 + ',' + 80;
          component.isResizable = true;
          break;
        case 'UPLOADS':
          component.dimHeight = 30;
          component.dimWidth = 90;
          component.dim = 90 + ',' + 30;
          component.isResizable = true;
          component.options = {};
          break;
        case 'TEXTBLOCK':
          component.dimHeight = 70;
          component.dimWidth = 630;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          /*component.text = 'Lorem Ipsum è un testo segnaposto utilizzato ' +
          'nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo' +
          'segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una ' +
          'cassetta di caratteri e li assemblò per preparare un testo campione.';*/
          component.text = '';
          if (component.options === undefined || component.options === null) {
            component.options = [];
          }
          /*component.options.color = '#ff0000';
          component.options.fsize = 14;*/
          component.transition = false;
          component.isResizable = true;

          break;
        case 'BUTTON':
          component.dimHeight = 40;
          component.dimWidth = 100;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.text = 'Button';
          if (component.options === undefined || component.options === null) {
            component.options = [];
          }
          component.options.bstyle = 'primary';
          component.transition = false;
          component.isResizable = false;
          break;
      }
      this.backupComponents();
      this.components[this.currentSlideId].push(component);
      this.configureResizableObject(component);
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    this.resizeComponent(event);
  }

  resizeComponent(e, component?) {
    // console.log(e.target.clientHeight + ' ' + e.target.clientWidth);
    // console.log(e.target.firstChild.id)
    // console.log(e);
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();

    let id = e.target.firstChild.id;
    let h = e.target.firstChild.clientHeight;
    let w = e.target.firstChild.clientWidth;
    if (id === undefined || id === null || !id) {
      id = e.target.id;
      h = e.target.clientHeight;
      w = e.target.clientWidth;
      console.log(component)
      if (component.componentType === 'CHECKABLETABLE' && component.options.scrollable) {
        h = e.target.clientHeight + 16;
        w = e.target.clientWidth + 15;
      }
    }
    this.calcScale();

    for (let i = 0; i < this.components[this.currentSlideId].length; i++) {
      if (this.components[this.currentSlideId][i].id == id) {
        this.components[this.currentSlideId][i].percHeight = h * 100 / sh;
        this.components[this.currentSlideId][i].percWidth = w * 100 / sw;
        this.components[this.currentSlideId][i].dimHeight = h;
        this.components[this.currentSlideId][i].dimWidth = w;
        this.components[this.currentSlideId][i].dim = w + ',' + h;
        break;
      }
    }

  }

  removeComponent(index) {
    this.backupComponents();
    this.components[this.currentSlideId].splice(index, 1);
  }

  private dialogInputFeild(component) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(InputFieldComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.name = d.name;
          component.label = d.label;
          component.chars = d.chars;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
        }
      });
  }

  private dialogTextArea(component) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(TextAreaComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.name = d.name;
          component.label = d.label;
          component.rows = d.rows;
          component.cols = d.cols;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
        }
      });
  }

  private dialogRadio(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(RadioComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.groupName = d.groupName;
          component.label = d.label;
          component.numRadio = d.radioComponent.length;
          component.radioComponent = d.radioComponent;
          component.transition = d.transition;
          if (!!d.radioComponent) {
            component.numRadio = d.radioComponent.length;
          }
          component.notToSave = d.notToSave;
        }
      });
  }

  private dialogCheckbox(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(CheckboxComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.groupName = d.groupName;
          component.label = d.label;
          component.value = '' + d.value;
          component.transition = d.transition;
        }
      });
  }

  // ggggggggggggggggggggggggg
  private dialogTable(component) {
    if (component.options == undefined || component.options == null) {
      component.options = {};
    }
    const obj: any = Object.assign({}, component);
    console.log(obj);
    const dialogRef = this.dialog.open(TableComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        console.log(res);
        if (res.status === 'OK') {
          const d = res.data;
          component.checkedString = d.checkedString;
          component.tableComponent = [...d.tableComponent];
          component.transition = d.transition;
          component.groupName = d.groupName;
          if (d.options != undefined) {
            component.options.scrollable = d.options.scrollable;
          }
          console.log(component);
          this.calcScale(component);
        }
      });
  }

  private dialogUploadsArea(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(UploadsComponent, { disableClose: true, data: obj });

    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          console.log(d.name);
          component.name = d.name;
          component.value = '' + d.value;
          component.groupName = '' + d.groupName;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
        }
      });
  }

  private dialogRangeSlider(component) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(RangeComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          console.log(d);
          component.name = d.name;
          component.label = d.label;
          component.min = d.min;
          component.max = d.max;
          component.step = d.step;
          console.log(d);
          if (!!d.options.showlabels) {
            if (!component.options) {
              component.options = {};
            }
            component.options.showlabels = d.options.showlabels;
            if (!!component.labels) {
              delete component.labels;
            }
            this.getLabels(component);
          }
          if (!!d.options.showticks) {
            if (!component.options) {
              component.options = {};
            }
            component.options.showticks = d.options.showticks;
            delete component.ticks;
            this.getTicks(component);

          }
        }
      });
  }

  private dialogClickArea(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ClickareaComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.groupName = d.name;
          component.value = '' + d.value;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
        }
      });
  }

  private dialogTextblock(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(TextBlockComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.text = d.text;
          this.configureResizableObject(component);
        }
      });
  }

  private dialogImage(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ImageComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.name = '' + d.name;
          component.value = '' + d.value;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
          component.checkable = d.checkable;
          //Change image height & width
          const sw = jQuery('#s-content').innerWidth();
          const sh = jQuery('#s-content').innerHeight();
          const uiWrapper = jQuery('#image_' + component.id).children().eq(0);
          if (!!d.dimWidth) {
            component.dimWidth = d.dimWidth;
            component.percWidth = d.dimWidth * 100 / sw;
            component.dim = d.dimWidth + ',' + component.dimHeight;
            uiWrapper.width(d.dimWidth);
          }
          if (!!d.dimHeight) {
            component.dimHeight = d.dimHeight;
            component.percHeight = d.dimHeight * 100 / sh;
            component.dim = component.dimWidth + ',' + d.dimHeight;
            uiWrapper.height(d.dimHeight);
          }
        }
      });
  }

  private dialogVideo(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(VideoComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.options.autoplay = d.options.autoplay;
          component.options.commands = d.options.commands;
          component.options.slowOption = d.options.slowOption;
        }
      });
  }


  private dialogButton(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ButtonComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          component.text = d.text;
          component.value = '' + d.value;
          component.transition = d.transition;
          component.notToSave = d.notToSave;
          component.options = d.options;
          //Change image height & width
          const sw = jQuery('#s-content').innerWidth();
          const sh = jQuery('#s-content').innerHeight();
          if (!!d.dimWidth) {

            const minLength = ((d.text.length - 10) * 6) + 100;

            if (d.dimWidth < minLength) {
              component.dimWidth = minLength;
            } else {
              component.dimWidth = d.dimWidth;
            }

            component.percWidth = d.dimWidth * 100 / sw;
            component.dim = d.dimWidth + ',' + component.dimHeight;
          }
          if (!!d.dimHeight) {
            component.dimHeight = d.dimHeight;
            component.percHeight = d.dimHeight * 100 / sh;
            component.dim = component.dimWidth + ',' + d.dimHeight;
          }
        }
      });
  }

  configComponentModal(component: SComponent) {
    console.log(component)
    switch (component.componentType) {
      case 'TEXT':
        this.dialogInputFeild(component);
        break;
      case 'TEXTAREA':
        this.dialogTextArea(component);
        break;
      case 'RADIO':
        this.dialogRadio(component);
        break;
      case 'CHECKBOX':
        this.dialogCheckbox(component);
        break;
      case 'RANGE':
        this.dialogRangeSlider(component);
        break;
      case 'CLICK_AREA':
        this.dialogClickArea(component);
        break;
      case 'TEXTBLOCK':
        this.dialogTextblock(component);
        break;
      case 'BUTTON':
        this.dialogButton(component);
        break;
      case 'IMAGE':
        this.dialogImage(component);
        break;
      case 'CHECKABLETABLE':
        this.dialogTable(component);
        break;
      case 'UPLOADS':
        this.dialogUploadsArea(component);
        break;
      case 'VIDEO':
        this.dialogVideo(component);
        break;
    }

  }

  configSlideModal(slide: SSlide) {

    const obj: any = Object.assign({}, slide);
    const dialogRef = this.dialog.open(ConfigSlideComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.response;

          for (let i = 0; i < this.question.slides.length; i++) {
            if (this.question.slides[i].slideId === this.currentSlideId) {
              this.question.slides[i] = d;
            }
          }
        }
      });
  }

  autSave() {
    this.timer = setTimeout(() => {
      this.saveCurrentSlide();
      this.autSave();
    }, 21000);
  }

  saveQuestion() {
    for (let i = 0; i < this.question.slides.length; i++) {
      this.saveSlide(this.question.slides[i]);
    }
  }

  saveCurrentSlide() {
    const slide = this.getCurrentSlide();
    this.saveSlide(slide);
  }

  getCurrentSlide() {
    for (let i = 0; i < this.question.slides.length; i++) {
      if (this.question.slides[i].slideId === this.currentSlideId) {
        this.currentSlide = this.question.slides[i];
        return this.question.slides[i];
      }
    }
  }

  saveSlide(slide: SSlide) {
    if (slide === undefined || slide === null) {
      return;
    }
    const components = this.components[slide.slideId];
    if (components === undefined || components === null) {
      return;
    }
    if (slide.options === undefined || slide.options === null) {
      slide.options = {};
    }
    if (slide.type === undefined || slide.type === null) {
      slide.type = SlideType.BLANK;
    }
    slide.slideContent = new SlideComponent();
    slide.slideContent.componentArray = new Array<SComp>();
    for (let j = 0; j < components.length; j++) {
      const component = components[j];
      const sw = jQuery('#s-content').innerWidth();
      const sh = jQuery('#s-content').innerHeight();
      const comp = component.toSComp(sw, sh);
      slide.slideContent.componentArray.push(comp);
    }
    console.log(slide)
    this.questionService.requestUpdateSlide(slide.slideId, slide)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {

        if (res.status === 'OK') {
          this.openSnackBar('Slide saved correctly');
        } else {
          this.openSnackBar('Slide not saved');
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      });
  }



  backQuestion() {
    this.location.back();
  }

  ondragstart(id, event = null) {
    if (!!event) {
      this.target = event.mouseEvent.target;
    } else {
      this.target = null;
    }

    this.mouving = true;
    this.draggingId = id;
  }

  ondragend(e) {
    this.mouving = false;
    this.draggingId = null;
    if (e != undefined && e != null) {
      this.backupComponents();
    }
  }

  backupComponents() {
    if (this.componentsBackup.length >= this.componentsBackupNum) {
      this.componentsBackup.splice(this.componentsBackupNum - 1, 1);
    }
    for (let i = this.componentsBackup.length - 1; i >= 0; i--) {
      this.componentsBackup[i + 1] = this.componentsBackup[i];
    }
    //this.componentsBackup[0] = jQuery.extend(true, {}, this.components);
    //this.componentsBackup[0] = JSON.parse(JSON.stringify(this.components));
    /*let cc = {};
    for (var property in this.components) {
        if (this.components.hasOwnProperty(property)) {
            cc[property] = JSON.parse(JSON.stringify(this.components[property]));
        }
    }
    this.componentsBackup[0] = cc;*/
    this.componentsBackup[0] = this.cloneDeep(this.components);
  }

  undoComponents() {
    if (this.shouldUndo()) {
      //this.components = JSON.parse(JSON.stringify(this.componentsBackup[0]));
      /*let cc = this.componentsBackup[0];
      let ccc = new Array();
      for (var property in cc) {
        if (cc.hasOwnProperty(property)) {
            ccc[property] = JSON.parse(JSON.stringify(cc[property]));
        }
      }
      this.components = ccc;*/
      this.components = this.cloneDeep(this.componentsBackup[0]);
      this.configureResizableObjects();
      for (let i = 0; i < this.componentsBackup.length - 1; i++) {
        this.componentsBackup[i] = this.componentsBackup[i + 1];
      }
      this.componentsBackup.splice(this.componentsBackup.length - 1, 1);
    }
  }

  cloneDeep(components: Array<Array<SComponent>>) {
    const ret = new Array<Array<SComponent>>();
    for (const property in components) {
      if (components.hasOwnProperty(property)) {
        const slide = components[property];
        ret[property] = new Array<SComponent>();
        for (const prop in slide) {
          if (slide.hasOwnProperty(prop)) {
            const component = slide[prop];
            // if(component.componentType == 'CLICK_AREA'){
            //   console.log(component);
            // }
            // console.log(component[p]);
            const c = new SComponent();
            for (const p in component) {
              if (component.hasOwnProperty(p)) {
                try {
                  if (component[p] != undefined)
                    c[p] = JSON.parse(JSON.stringify(component[p]));
                } catch (e) {
                  console.log(e);
                }
              }
            }
            ret[property][prop] = c;
          }
        }
      }
    }
    return ret;
  }

  shouldUndo() {
    if (this.componentsBackup == undefined || this.componentsBackup == null ||
      this.componentsBackup.length <= 0)
      return false;
    return true;
  }

  deleteSlide(slide) {
    if (slide) {
      const d = this.dialog.open(DeleteSlideComponent, { disableClose: true, data: slide });
      d.afterClosed()
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res === 'OK') {
            //window.location.reload();
            this.init();
          }
        });
    }
    return false;
  }

  /*private initDragDropComponent() {
    jQuery('.drag-component').draggable({
      helper: 'clone',
      revert: 'true'
    });

    jQuery('#s-content').droppable({
      accept: '.drag-component',
      drop: function (event, ui) {
        const type: string = ui.draggable[0].attributes['input-type'].nodeValue;
        let component = '';
        const top: number = ui.offset.top - 30;
        let left: number = ui.offset.left - 210;
        if (left < 0) {
          left = 0;
        }
        const id = new Date().getTime().toString();
        switch (type) {
          case 'input':
            component = '<input id="i' + id + '" type="text" class="input-control" style="height: 50px;" id="input"  />';
            break;
          case 'area':
            component = '<textarea id="i' + id + '"  rows="4" cols="50"></textarea>';
            break;
          case 'radio':
            component = '<input id="i' + id + '"  type="radio" style="height: 30px !important; width: 30px !important;" value="radio" />';
            break;
          case 'checkbox':
            component = '<input id="i' + id + '"  type="checkbox" ' +
              'style="height: 30px !important; width: 30px !important;" value="Checkbox">';
            break;
          case 'range':
            component = '<input id="i' + id + '" style="height: 50px;"  type="range" />';
            break;
        }
        let divComponent = '<div id="' + id + '" ' +
          'style="position: absolute; left: ' + left + 'px; top: ' + top + 'px" ' +
          'class="drag-input" >' +
          '<i class="material-icons" id="icon_' + id + '" style="font-size: 14px; cursor: pointer;">&#xE8B8;</i>' +
          component +
          '</div>';
        jQuery('#s-content').append(divComponent);
        jQuery('.drag-input').draggable({
          containment: 'parent',
          cursor: 'move',
          cancel: '',
          start: function (event, ui) {
            jQuery(this).data('preventBehaviour', true);
          }
        });
        // jQuery('.drag-input').selectable();
        // fixed bug input focus
        jQuery('.drag-input :input').on('mousedown', function (e) {
          const mdown = document.createEvent('MouseEvents');
          mdown.initMouseEvent('mousedown', false,
            true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY,
            true, false, false, true, 0, null);
          jQuery(this).closest('.drag-input')[0].dispatchEvent(mdown);
        }).on('click', function (e) {
          const $draggable = jQuery(this).closest('.draggable');
          if ($draggable.data('preventBehaviour')) {
            e.preventDefault();
            $draggable.data('preventBehaviour', false);
          }
        });
        const inputId = '#i' + id;
        jQuery(inputId).resizable({
          containment: '#s-content'
        });
        // delete element
        jQuery('.drag-input').click(function () {
          jQuery(this).addClass('delete');
          jQuery(this).focus();
        });
        jQuery('.drag-input').focusout(function () {
          jQuery(this).removeClass('delete');
        });
        jQuery(document).on('keydown', function (e) {
          if (e.keyCode === 8) {
            jQuery('div.delete').remove();
          }
        });
        jQuery('#icon_' + id).click(function () {
          console.log(jQuery('#icon_' + id));
        });
      }
    });
  }*/

  isInCheckedString(c: any, i: number, j: number) {
    const token = '#' + i + '-' + j;
    if (c.checkedString.indexOf(token) >= 0)
      return true;
    else
      return false;
  }

  updateCheckedString(c: any, i: number, j: number) {
    const token = '#' + i + '-' + j;
    if (c.checkedString.indexOf(token) >= 0)
      c.checkedString = c.checkedString.replace(token, '');
    else
      c.checkedString = c.checkedString + token;
  }

  saveQuestionOrder() {
    const orders = {};
    orders['questionId'] = this.question.questionId;
    orders['slides'] = new Array();
    for (let i = 0; i < this.question.slides.length; i++) {
      const slide = this.question.slides[i];
      orders['slides'].push({
        'slide': slide.slideId,
        'order': i
      });
    }
    this.questionService.orderSlides(orders)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        console.log(res);
      });

  }

  importSlide() {
    console.log('import slide');
    const obj: any = {};
    obj.question = this.question;
    obj.questionId = this.question.questionId;
    const dialogRef = this.dialog.open(ImportSlideComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        //this.bindingQuestion(res);
        console.log(res);
      });
  }

  romanize(num) {
    if (!+num) {
      return NaN;
    }
    const digits = String(+num).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
      '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
      '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '';
    let i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  }

  deromanize(str) {
    str = str.toUpperCase();
    let validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
      token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
      key = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
      num = 0, m;
    if (!(str && validator.test(str)))
      return false;
    while (m = token.exec(str))
      num += key[m[0]];
    return num;
  }

  getTicks(c) {
    const ret = new Array<any>();
    if (c == null) {
      return ret;
    }
    if (c['ticks'] != undefined && c['ticks'] != null)
      return c['ticks'];
    if (c.min == undefined || c.min == null ||
      c.max == undefined || c.max == null ||
      c.step == undefined || c.step == null) {
      return ret;
    }

    const min = parseInt(c.min, 10);
    const max = parseInt(c.max, 10);
    const step = parseInt(c.step, 10);

    for (let i = min; i <= max; i = i + step) {
      const v = { 'value': i };
      ret.push(v);
    }
    c['ticks'] = ret;
    return ret;

  }

  getLabels(c) {

    const ret = new Array<any>();
    if (c == null) {
      return ret;
    }
    if (c['labels'] != undefined && c['labels'] != null)
      return c['labels'];
    if (c.options == undefined || c.options == null ||
      c.options.labelNum == undefined || c.options.labelNum == null)
      return ret;

    const num = parseInt(c.options.labelNum, 10);
    for (let i = 0; i < num; i++) {
      const v = { 'label': c.options['label_' + i] };
      ret.push(v);
    }
    c['labels'] = ret;
    return ret;
  }

  ngAfterViewInit() {
    // this.initDragDropComponent();
    // jQuery('#drag-component').draggable();
    jQuery('#s-content').on('mouseup', (e) => {
      this.ondragend(null);
    });
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();
    this.autSave();
  }

  ngOnDestroy() {
    console.log('destroy');
    this.saveQuestion();
    clearTimeout(this.timer);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setListView() {
    this.listView = true;
    this.gridView = false;
  }

  setGridView() {
    this.listView = false;
    this.gridView = true;
  }

  calcScale(comp = null) {

    if (!comp) {
      this.tableComponents.forEach((comp) => {
        const sw = jQuery('#' + comp.id).innerWidth();
        const sh = jQuery('#' + comp.id).innerHeight();
        const table = jQuery('#' + comp.id + ' > div > table')[0];
        if (!!table) {
          const height = table.offsetHeight;
          const width = table.offsetWidth;
          if (height > sh && width > sw) {
            if (Math.abs(sh - height) > Math.abs(sw - width)) {
              comp.scale = (((sh - height) / height) + 1).toString();
            } else {
              comp.scale = (((sw - width) / width) + 1).toString();
            }
          } else if (width > sw) {
            comp.scale = (((sw - (width)) / width) + 1).toString();
          } else if (height > sh) {
            comp.scale = (((sh - (height)) / height) + 1).toString();
          }
        }
      });
    } else {
      const sw = jQuery('#' + comp.id).innerWidth();
      const sh = jQuery('#' + comp.id).innerHeight();
      const table = jQuery('#' + comp.id + ' > div > table')[0];
      const height = table.offsetHeight;
      const width = table.offsetWidth;
      if (height > sh && width > sw) {
        if (Math.abs(sh - (height)) > Math.abs(sw - (width))) {
          comp.scale = (((sh - (height)) / height) + 1).toString();
        } else {
          comp.scale = (((sw - (width)) / width) + 1).toString();
        }
      } else if (width > sw) {
        comp.scale = (((sw - (width)) / width) + 1).toString();
      } else if (height > sh) {
        comp.scale = (((sh - (height)) / height) + 1).toString();
      }
    }

  }
}