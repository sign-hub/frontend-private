import {
  AfterViewInit, Component, OnInit, ComponentFactoryResolver, OnDestroy, HostListener
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../share/base.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
import { CustomClickareaComponent } from './custom-clickarea.component';
import { fabric } from 'fabric';
import { Line } from '../_models/line';
import { VideoRecordingComponent } from './videoRecording.component';
import { Transition } from 'app/models/transition';
import { of } from 'rxjs/observable/of';
import { catchError, switchMap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';


declare var jQuery: any;

class Point {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

@Component({
  selector: 'app-question',
  templateUrl: '../_views/question.component.html',
  styleUrls: ['../_views/question.component.scss', '../../../share/e-home.scss']
})
export class QuestionComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  hieghtQuestion: string;
  heightQuestionCenter: string;
  heightQuestionCenterContent: any;
  heightContentTab: string;
  mediaHeightContentTab: string;
  widthQuestionCenter: string;
  medias: Array<Photo>;
  selectedTab: string;
  allMedias: Array<Array<Photo>>;
  allMediasContainer: Array<Array<Photo>>;
  mediaPageIndex: number;
  mediaLoading: boolean;
  testId: string;
  question: Question;
  questionLoading: boolean;
  components: Array<Array<SComponent>>;
  currentSlideId: string;
  currentSlide: SSlide;
  currentSlideName: string;
  mouving: boolean;
  draggingId: string;
  saveOnChange: boolean;
  step: number;
  backgroundColor: string;
  grid: boolean;
  listView = false;
  gridView = true;
  target: any;
  selectHighlight: string;
  filterName: string;
  index: string;
  viewBox: string;
  canvas: any;
  drawing: Array<string> = ['Start Drawing', 'Stop Drawing'];
  roof: any = null;
  roofPoints: Array<fabric.Point> = [];
  lines: Array<fabric.Line> = [];
  lineCounter = 0;
  x = 0;
  y = 0;
  points: any = {};
  currentClickArea: any;
  linesArray: Array<Line> = [];
  pointsArray: Array<fabric.Point> = [];
  pointArray: Array<number> = [];
  pointsString = '';
  customClickCheck = false;
  canvasVisibility = 'hidden';
  drawFinished = false;
  currentId = '';
  drawingObject = {
    type: '',
    background: '',
    border: ''
  };
  h: any;
  v: any;
  canvasZIndex = '-1';
  ctx: any;
  clientPoints: Array<any> = [];
  mediaVideoPageIndex: number = 0;
  mediaPhotoPageIndex: number = 0;
  mediaAudioPageIndex: number = 0;
  mediaTextPageIndex: number = 0;

  // This object holds url by tab index
  urlObj = {};

  // This object holds folder indexes for each folder
  folderIndexes = {};
  loadMorePhoto: boolean = true;
  loadMoreVideo: boolean = true;
  loadMoreAudio: boolean = true;
  loadMoreText: boolean = true;



  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private questionService: QuestionService,
    private location: Location,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this.height = (window.innerHeight);
    this.width = (window.innerWidth);
    this.height = this.height - 100 + 30; //dimensione meno il menù + di quanto è spostato il titolo
    this.v = this.width - 470; //right = 200; left=250; margin centrale 10+10;
    this.h = this.height;
    if ((this.width - 470) < ((this.height - 110) * 1.77)) {
      this.v = this.width - 470;
      this.h = this.v / 1.77;
      this.heightQuestionCenterContent = this.h + 'px';
      this.heightQuestionCenter = (this.h + 50) + 'px';
    } else {
      this.v = (this.height - 110) * 1.77;
      this.heightQuestionCenter = (this.h - 80) + 'px';
      this.heightQuestionCenterContent = (this.h - 110) + 'px';
    }
    /*this.hieghtQuestion = (this.height - 100) + 'px';
    this.heightContentTab = (this.height - 150) + 'px';
    this.heightQuestionCenter = (this.height - 80) + 'px';
    this.heightQuestionCenterContent = (this.height - 110) + 'px';*/
    this.hieghtQuestion = (this.h - 100) + 'px';
    this.heightContentTab = (this.h - 150) + 'px';
    this.mediaHeightContentTab = (this.h - 200) + 'px';

    // this.heightQuestionCenter = (h - 80) + 'px';
    // this.heightQuestionCenterContent = (h - 110) + 'px';
    this.widthQuestionCenter = '' + this.v + 'px';
    this.draggingId = null;
    this.saveOnChange = false;
    this.step = Math.round(Math.round(this.v) / 40);
    this.backgroundColor = '#fff';
    this.currentSlideName = '';
    // console.log(parseFloat(this.widthQuestionCenter)/parseFloat(this.heightQuestionCenterContent));

  }


  ngOnInit(): void {
    this.init();
    this.urlObj[this.selectedTab || 'PHOTO'] = {};
    this.folderIndexes[this.selectedTab || 'PHOTO'] = 0;
    this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']] = `${this.selectedTab || 'PHOTO'}`;
    this.route.queryParams.subscribe((params) => {
      this.testId = params.testId;
      this.index = params.index;
    });
  }


  @HostListener('mousemove', ['$event'])
  canvasOnMouseMove(options) {
    if (this.lines.length != 0 && this.lines[0] != null && this.lines[0] != undefined && this.drawingObject.type == 'roof') {
      const offset = jQuery('#myCanvas').offset();
      const body = jQuery('body');
      const x = options.pageX - offset.left;
      const y = options.pageY - offset.top;
      this.lines[this.lineCounter - 1].set({
        x2: x,
        y2: y
      });
      this.canvas.renderAll();
    }
  }

  @HostListener('mousedown', ['$event'])
  canvasOnMouseDown(options) {
    if (this.drawingObject.type == 'roof') {
      this.canvas.selection = false;
      const offset = jQuery('#myCanvas').offset();
      const x = options.clientX - offset.left;
      const y = options.clientY - offset.top;
      const posX = options.pageX - 212;
      const posY = options.pageY - 88;
      this.clientPoints.push({
        x: posX,
        y: posY,
      });
      this.roofPoints.push(new fabric.Point(x, y));
      const points = [x, y, x, y];
      this.lines.push(new fabric.Line(points, {
        strokeWidth: 3,
        selectable: false,
        stroke: 'red',
        left: x,
        top: y,
      }));
      this.canvas.add(this.lines[this.lineCounter]);
      this.lineCounter++;
    }
  }

  @HostListener('mouseup')
  canvasOnMouseUp() {
    if (this.drawingObject.type == 'roof') {
      this.canvas.selection = true;
    }
  }

  @HostListener('dblclick', ['$event'])
  canvasOnDoubleClick() {
    if (this.drawingObject.type == 'roof') {
      this.drawing = [this.drawing[1], this.drawing[0]];
    }

    this.drawingObject.type = '';
    this.lines.map((value: any) => {
      this.canvas.remove(value);
    });

    this.canvas.remove(this.lines[this.lineCounter - 1]);
    this.roof = this.makeRoof(this.roofPoints);
    this.canvas.add(this.roof);

    //clear arrays
    this.roofPoints = [];
    this.lines = [];
    this.lineCounter = 0;
  }

  startDrawing() {
    this.drawing = [this.drawing[1], this.drawing[0]];
    if (this.drawingObject.type == 'roof') {
      this.drawingObject.type = '';
      this.lines.map((value: any) => {
        this.canvas.remove(value);
      });

      this.canvas.remove(this.lines[this.lineCounter]);
      this.roof = this.makeRoof(this.roofPoints);
      this.canvas.add(this.roof);
      this.canvas.renderAll();
    } else {
      this.drawingObject.type = 'roof'; // roof type
      this.canvas.remove(this.roof);
      this.canvas.renderAll();
    }
  }

  makeRoof(roofPoints) {
    const left = this.findLeftPaddingForRoof(roofPoints);
    const top = this.findTopPaddingForRoof(roofPoints);
    if (roofPoints[0] == undefined)
      roofPoints.push(new fabric.Point(this.x, this.y));
    roofPoints.push(new fabric.Point(roofPoints[0].x, roofPoints[0].y));
    const roof = new fabric.Polyline(roofPoints, {
      fill: 'rgba(0,0,0,0)',
      stroke: '#58c'
    });

    return roof.set({
      left: left,
      top: top,
    });
  }

  findTopPaddingForRoof(roofPoints) {
    let result = 999999;
    for (let f = 0; f < this.lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  }

  findLeftPaddingForRoof(roofPoints) {
    let result = 999999;
    for (let i = 0; i < this.lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  }

  finishDrawing() {
    let maxX = -99999;
    let minY = 99999;
    let maxY = -99999;
    let minX = 99999;
    let deltaX = 0;
    let deltaY = 0;
    let viewBox = '';
    this.pointsString = '';
    this.pointsArray = [];
    if (this.canvas.toJSON()['objects'][0]) {
      this.pointsArray = this.canvas.toJSON()['objects'][0]['points'];
    }
    for (let i = 0; i < this.pointsArray.length; i++) {
      if (this.pointsArray[i].x > maxX) {
        maxX = this.pointsArray[i].x;
      }
      if (this.pointsArray[i].x < minX) {
        minX = this.pointsArray[i].x;
      }
      if (this.pointsArray[i].y > maxY) {
        maxY = this.pointsArray[i].y;
      }
      if (this.pointsArray[i].y < minY) {
        minY = this.pointsArray[i].y;
      }
    }
    for (let i = 0; i < this.pointsArray.length; i++) {
      this.pointsArray[i].x = this.pointsArray[i].x - minX;
      this.pointsArray[i].y = this.pointsArray[i].y - minY;
    }
    for (let i = 0; i < this.pointsArray.length; i++) {
      this.pointsString += this.pointsArray[i].x.toString() + ', ';
      this.pointsString += this.pointsArray[i].y.toString() + ', ';
    }

    deltaX = maxX - minX;
    deltaY = maxY - minY;
    viewBox = `0 0 ${deltaX} ${deltaY}`;
    this.pointsString = this.pointsString.substr(0, this.pointsString.length - 2);
    this.points[this.currentId] = {
      points: this.pointsString,
      viewBox: viewBox,
      width: deltaX,
      height: deltaY
    };
    this.canvasVisibility = 'hidden';
    this.customClickCheck = false;
    this.canvasZIndex = '-1';
    this.ctx.globalCompositeOperation = 'destination-out';
    this.drawFinished = true;
    this.currentClickArea.posX = this.clientPoints[0]['x'] - this.pointsArray[0].x + (1000 / window.innerWidth);
    this.currentClickArea.posY = this.clientPoints[0]['y'] - this.pointsArray[0].y + (1000 / window.innerHeight);
    this.currentClickArea.dimHeight = deltaY;
    this.currentClickArea.dimWidth = deltaX;
    this.currentClickArea.dim = this.currentClickArea.dimWidth + ',' + this.currentClickArea.dimHeight;
    this.currentClickArea.pos = this.currentClickArea.posX + ',' + this.currentClickArea.posY;
    this.currentClickArea.options = {};
    this.currentClickArea.options.points = this.pointsString;
    this.currentClickArea.options.viewBox = viewBox;
    this.clientPoints = [];
    this.components[this.currentSlideId].push(this.currentClickArea);
    this.configureResizableObject(this.currentClickArea);
    this.canvas.remove(this.roof);
    this.canvas.renderAll();
    this.pointsArray = [];
  }




  init(): void {
    //this.loadMedia('PHOTO');
    this.allMedias = new Array();
    this.initQuestion();
    this.initInputDefault();
    this.loadQuesionInfo();
    this.loadMedias();
  }

  openFolder(folder) {
    this.folderIndexes[this.selectedTab || 'PHOTO'] += 1;
    this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']] = `${this.selectedTab || 'PHOTO'}&parentId=${folder.mediaId}`;
    this.loadMediaUtil(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']]);
  }

  goBack() {
    this.folderIndexes[this.selectedTab || 'PHOTO'] -= 1;
    this.loadMediaUtil(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']]);
  }


  isUrlRoot() {
    return !(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']].includes("parentId"));
  }



  initQuestion() {
    this.question = new Question();
    this.question.slides = [];
  }

  loadQuesionInfo() {
    this.route.queryParams.subscribe(params => {
      this.testId = params.id;
      if (localStorage.getItem('grid_' + params.id) == null || localStorage.getItem('grid_' + params.id) == undefined) {
        this.grid = false;
        localStorage.setItem('grid_' + this.testId, String(this.grid));
      } else {
        this.grid = localStorage.getItem('grid_' + this.testId) == 'false' ? false : true;
      }
      this.questionService.requestGetQuestionInfo(params.id).subscribe(res => {
        if (res.status === 'OK') {
          this.question = res.response;
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
    // const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      this.loadMedia('PHOTO').then(() => {
        this.loadMedia('VIDEO').then(() => {
          this.selectedTab = 'PHOTO';
          // resolve();
        });
      });
    }, 800);


    //this.loadMedia('AUDIO');
    //this.loadMedia('TEXT');
    //this.selectedTab = 'PHOTO';
    //resolve();
    // });
    // return promise;
  }

  loadMedia(type: string) {
    this.mediaLoading = true;
    this.medias = [];
    const length = 24;
    // this.allMediasPaginate[type] = [];
    // this.allMediasData[type] = [];
    const pageIndex = this.getPageIndex(type);
    console.log(pageIndex)
    if (this.allMedias[type] == undefined && this.allMedias[type] == null) {
      this.allMedias[type] = [];
    }
    const promise = new Promise((resolve, reject) => {


      this.mediaService.filterMedia(type, null, null, null, pageIndex, length).subscribe(res => {
        if (res.status === 'OK') {
          for (const item of res.response) {
            this.allMedias[type].push(item);

          }
          if (res.response.length < length) {
            this.getPageIndex(type, false, true);
          }
          console.log(this.allMedias);

          this.mediaLoading = false;
        } else {
          console.log('Server error');
          this.processStatusError(res.errors);
          this.mediaLoading = false;
        }
        this.allMediasContainer = this.allMedias;
        resolve();
      });
    });
    return promise;
  }

  getPageIndex(tab, reset = false, lastPage = false) {
    let index: number = 0;
    if (reset)
      return 1;
    switch (tab) {
      case 'VIDEO':
        if (lastPage) {
          this.mediaVideoPageIndex = 0;
          break;
        }
        index = ++this.mediaVideoPageIndex;
        break;
      case 'PHOTO':
        if (lastPage) {
          this.mediaPhotoPageIndex = 0;
          break;
        }
        index = ++this.mediaPhotoPageIndex;
        break;
      case 'AUDIO':
        if (lastPage) {
          this.mediaAudioPageIndex = 0;
          break;
        }
        index = ++this.mediaAudioPageIndex;
        break;
      case 'TEXT':
        if (lastPage) {
          this.mediaTextPageIndex = 0;
          break;
        }
        index = ++this.mediaTextPageIndex;
        break;
      default:
        index = null;
    }
    return index;
  }

  loadMediaUtil(type) {
    const pageIndex = this.getPageIndex(type, true);
    const length = 24;
    this.allMedias[this.selectedTab || 'PHOTO'] = [];
    this.mediaLoading = true;
    this.mediaService.filterMedia(type, null, null, null, pageIndex, length).subscribe(res => {
      if (res.status === 'OK') {
        if (res.response.length >= length) {
          if (this.selectedTab === 'PHOTO') {
            this.loadMorePhoto = true;
            this.mediaPhotoPageIndex = pageIndex;
          } else if (this.selectedTab === 'VIDEO') {
            this.loadMoreVideo = true;
            this.mediaVideoPageIndex = pageIndex;
          } else if (this.selectedTab === 'AUDIO') {
            this.loadMoreAudio = true;
            this.mediaAudioPageIndex = pageIndex;
          } else if (this.selectedTab === 'TEXT') {
            this.loadMoreText = true;
            this.mediaTextPageIndex = pageIndex;
          }
        } else {
          if (this.selectedTab === 'PHOTO') {
            this.loadMorePhoto = false;
          } else if (this.selectedTab === 'VIDEO') {
            this.loadMoreVideo = false;
          } else if (this.selectedTab === 'AUDIO') {
            this.loadMoreAudio = false;
          } else if (this.selectedTab === 'TEXT') {
            this.loadMoreText = false;
          }
        }
        for (const item of res.response) {
          this.allMedias[this.selectedTab || 'PHOTO'].push(item);

        }
        this.mediaLoading = false;
      } else {
        console.log('Server error');
        this.processStatusError(res.errors);
        this.mediaLoading = false;
      }
    });
  }

  changeTab(index) {
    //this.loadMedia(this.getTabIndex(index));
    this.selectedTab = this.getTabIndex(index);
    this.urlObj[this.selectedTab] = {};
    if (this.folderIndexes[this.selectedTab] != 0) {
      this.folderIndexes[this.selectedTab] = 0;
      this.urlObj[this.selectedTab][this.folderIndexes[this.selectedTab]] = `${this.selectedTab}`;
      this.loadMediaUtil(this.urlObj[this.selectedTab][this.folderIndexes[this.selectedTab]] = `${this.selectedTab}`);
    }
    this.urlObj[this.selectedTab][this.folderIndexes[this.selectedTab]] = `${this.selectedTab}`;
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
    this.questionService.requestAddSlide(this.question.questionId).subscribe(res => {
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
      setTimeout(() => {
        this.saveCurrentSlide();
      }, 200);
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
      this.mediaLoading = false;
    }, 500);
  }

  configureResizableObject(component) {
    if (component === undefined || component === null) {
      return;
    }
    setTimeout(() => {
      if (component.isResizable == true) {
        jQuery('#' + component.id).resizable({
          containment: '#s-content'
        });
        jQuery('#' + component.id).parent().on('resize', (e) => {
          this.resizeComponent(e);
        });
      }
    });
  }

  initInputDefault() {
    this.components = [];
  }

  initSlides() {
    for (let i = 0; i < this.question.slides.length; i++) {
      this.components[this.question.slides[i].slideId] = this.convertComponents(this.question.slides[i]);
    }
    console.log('asdf');
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
        if (!comp.url) {
          this.getSlideMedia(comp.mediaId).subscribe((res: any) => {
            comp.url = res;
          });
        }

      }
      if (comp.componentType == 'RANGE') {
        this.getLabels(comp);
        this.getTicks(comp);
      }
      if (comp.componentType == 'CLICK_AREA') {
        clickAreaArray.push(comp);
      }
      else if (comp.componentType == 'CUSTOM_CLICK_AREA') {
        clickAreaArray.push(comp);
      } else {
        ret.push(comp);
      }
      //ret.push(comp);
    }
    for (let y = 0; y < clickAreaArray.length; y++) {
      ret.push(clickAreaArray[y]);
    }
    // console.log(ret)
    return ret;
  }

  getSlideMedia(mediaId) {
    return from(this.questionService.getSlideMedia(mediaId).pipe(
      switchMap((res: any) => {
        // console.log(res)
        if (res.status === 'OK') {
          return of(res.response.mediaThumbPath);
        }
      }), catchError((error) => {
        return of(null);
      })
    ))
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
    if (this.allMedias[g]) {
      const media = this.allMedias[g].find(media => media.mediaId == mediaId);
      if (media === undefined || media == null) {
        return null;
      }
      return media.mediaThumbPath;
      /*for (const media of this.allMedias[g]) {
        if (media.mediaId == mediaId) {
          return media.mediaThumbPath;
        }
      }*/
    } else {
      return null;
    }

  }

  private updatePosition(index, x, y) {
    const c: SComponent = this.components[this.currentSlideId][index];
    c.posX = this.calcPosition(x);
    c.posY = this.calcPosition(y);
  }

  private updatePositionNoGrid(index, x, y) {
    const c: SComponent = this.components[this.currentSlideId][index];
    c.posX = x;
    c.posY = y;
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
    this.ondragend();
    let x: number = e.mouseEvent.offsetX;
    let y: number = e.mouseEvent.offsetY;
    const obj: any = e.dragData;
    const id = 'input_' + new Date().getTime();

    const component: SComponent = new SComponent();
    if (!(obj.type === 'CLICK_AREA' || obj.type === 'CUSTOM_CLICK_AREA')) {
      x = this.calcPosition(x);
      y = this.calcPosition(y);
    }
    if (obj.type === 'CUSTOM_CLICK_AREA' && obj.updated === false) {
      this.canvas.remove(this.roof);
      this.canvas.renderAll();
      this.customClickCheck = true;
      this.canvasVisibility = 'visible';
      this.canvasZIndex = '99';
      this.ctx.globalCompositeOperation = 'destination-over';
    } else {
      component.posX = x;
      component.posY = y;
      component.pos = x + ',' + y;
    }
    component.id = id;
    this.currentId = id;
    component.isResizable = false;
    if (obj.type !== 'CUSTOM_CLICK_AREA' && this.drawingObject.type === 'roof') {
      this.finishDrawing();
    }
    if (obj.updated) {
      if (obj.type === 'CLICK_AREA' || obj.type === 'CUSTOM_CLICK_AREA') {
        this.updatePositionNoGrid(obj.index, x, y);
        console.log(obj);
      } else {
        this.updatePosition(obj.index, x, y);
      }
    } else {
      component.componentType = obj.type;
      switch (obj.type) {
        case 'TEXT':
          component.dimHeight = 40;
          component.dimWidth = 100;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.name = 'input';
          component.chars = 20;
          component.transition = false;
          component.notToSave = false;
          component.isResizable = true;
          break;
        case 'TEXTAREA':
          component.name = 'textArea';
          component.cols = 50;
          component.rows = 4;
          component.dimHeight = 50;
          component.dimWidth = 100;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.notToSave = false;
          component.isResizable = true;
          break;
        case 'RADIO':
          component.groupName = 'radio';
          component.notToSave = false;
          break;
        case 'CHECKBOX':
          component.dimHeight = 15;
          component.dimWidth = 15;
          component.isResizable = false;
          component.groupName = 'checkbox';
          component.notToSave = false;
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
          component.notToSave = false;
          break;
        case 'IMAGE':
        case 'VIDEO':
          if (!!this.target) {
            component.dimHeight = this.target.naturalHeight;
            component.dimWidth = this.target.naturalWidth;
            component.dim = this.target.naturalWidth + ',' + this.target.naturalHeight;
            console.log(component);
          } else {
            component.dimHeight = 80;
            component.dimWidth = 80;
            component.dim = 80 + ',' + 80;
          }
          component.mediaId = obj.mediaId;
          component.url = obj.url;
          component.isResizable = true;
          component.notToSave = false;
          component.options = { commands: false };
          break;
        case 'CLICK_AREA':
          component.dimHeight = 80;
          component.dimWidth = 100;
          component.dim = 100 + ',' + 80;
          component.isResizable = true;
          component.notToSave = false;
          break;
        case 'CUSTOM_CLICK_AREA':
          component.isResizable = true;
          component.notToSave = false;
          break;
        case 'VIDEO_RECORD':
          component.notToSave = false;
          component.dimHeight = 80;
          component.dimWidth = 80;
          component.dim = 80 + ',' + 80;
          component.transition = false;
          break;
        case 'TEXTBLOCK':
          component.dimHeight = 70;
          component.dimWidth = 630;
          component.dim = component.dimWidth + ',' + component.dimHeight;
          component.text = 'Lorem Ipsum è un testo segnaposto utilizzato ' +
            'nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo' +
            'segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una ' +
            'cassetta di caratteri e li assemblò per preparare un testo campione.';
          if (component.options === undefined || component.options === null) {
            component.options = [];
          }
          component.options.color = '#ff0000';
          component.options.fsize = 14;
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
          component.notToSave = false;
          component.isResizable = false;
          break;
      }
      if (obj.type !== 'CUSTOM_CLICK_AREA') {
        this.components[this.currentSlideId].push(component);
        this.configureResizableObject(component);
      } else {
        this.currentClickArea = component;
      }
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    this.resizeComponent(event);
  }

  resizeComponent(e) {
    /*console.log(e.target.clientHeight + ' ' + e.target.clientWidth);
    console.log(e.target.firstChild.id)
    console.log(e);*/
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();

    let id = e.target.firstChild.id;
    let h = e.target.firstChild.clientHeight;
    let w = e.target.firstChild.clientWidth;
    if (id === undefined || id === null || id.trim() == '') {
      id = e.target.id;
      h = e.target.clientHeight;
      w = e.target.clientWidth;
    }

    console.log('ww, wh:' + sw + ',' + sh + ' cw,ch: ' + w + ',' + h);

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
    this.components[this.currentSlideId].splice(index, 1);
  }

  private dialogInputFeild(component) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(InputFieldComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
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
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.name = d.name;
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
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.groupName = d.groupName;
        component.label = d.label;
        console.log(d.radioComponent);
        if (!!d.radioComponent) {
          component.numRadio = d.radioComponent.length;
        }
        component.radioComponent = d.radioComponent;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
        console.log(d);
      }
    });
  }

  private dialogCheckbox(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(CheckboxComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.groupName = d.groupName;
        component.label = d.label;
        component.value = '' + d.value;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
      }
    });
  }

  private dialogRangeSlider(component) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(RangeComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.name = d.name;
        component.label = d.label;
        component.min = d.min;
        component.max = d.max;
        component.step = d.step;
        component.notToSave = d.options.notToSave;

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
        // delete component.labels;
        // delete component.ticks;
        // this.getLabels(component);
        // this.getTicks(component);
      }
    });
  }

  private dialogClickArea(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ClickareaComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.groupName = d.name;
        component.value = '' + d.value;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
      }
    });
  }

  private dialogCustomClickArea(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(CustomClickareaComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.groupName = d.name;
        component.value = '' + d.value;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
        this.pointsString = res.lines;
        if (res.lines && res.viewBox && res.lines !== '') {
          this.points[d.id] = {
            points: res.lines,
            viewBox: res.viewBox
          };
        }
      }
    });
  }

  private dialogTextblock(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(TextBlockComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.text = d.text;
      }
    });
  }

  private dialogVideoRecordArea(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(VideoRecordingComponent, { disableClose: true, data: obj });

    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        console.log(d.name);
        component.name = d.name;
        component.label = '' + d.label;
        component.description = '' + d.description;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
      }
    });
  }


  private dialogImage(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ImageComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.value = '' + d.value;
        component.transition = d.transition;
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
        component.isResizable = true;
        if (component.options == undefined || component.options == null) {
          component.options = {};
        }
        component.options.name = d.options.name;
        component.options.checkable = d.options.checkable;
        component.options.shadow = d.options.shadow;
        component.notToSave = d.notToSave;
      }
    });
  }

  private dialogVideo(component: SComponent) {
    const obj: any = Object.assign({}, component);
    console.log(obj);
    const dialogRef = this.dialog.open(VideoComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        if (component.options == undefined || component.options == null)
          component.options = {};
        component.options.autoplay = d.options.autoplay;
        component.options.commands = d.options.commands;
        component.notToSave = d.notToSave;
      }
    });
  }


  private dialogButton(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ButtonComponent, { disableClose: true, data: obj });

    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.text = d.text;
        component.value = '' + d.value;
        component.name = d.name;
        component.transition = d.transition;
        component.notToSave = d.notToSave;
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
      case 'CUSTOM_CLICK_AREA':
        this.dialogCustomClickArea(component);
        break;
      case 'VIDEO_RECORD':
        this.dialogVideoRecordArea(component);
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
      case 'VIDEO':
        this.dialogVideo(component);
        break;
    }

  }

  configSlideModal(slide: SSlide) {
    console.log(slide);
    const obj: any = Object.assign({}, slide);
    const dialogRef = this.dialog.open(ConfigSlideComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.response;
        console.log(d);
        for (let i = 0; i < this.question.slides.length; i++) {
          if (this.question.slides[i].slideId === this.currentSlideId) {
            this.question.slides[i] = d;
          }
        }
      }
    });
  }

  saveQuestion() {
    for (let i = 0; i < this.question.slides.length; i++) {
      this.saveSlide(this.question.slides[i]);
    }
    console.log(this.question);
  }

  saveCurrentSlide() {
    this.saveSlide(this.getCurrentSlide());
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
      // console.log(comp);
    }
    this.questionService.requestUpdateSlide(slide.slideId, slide).subscribe(res => {
      console.log(res);
      if (res.status === 'OK') {
        this.openSnackBar('Slide saved correctly');
      } else {
        this.openSnackBar('Slide not saved');
        this.processStatusError(res.errors);
        console.error('Server error');
      }
    });
  }

  saveQuestionOrder() {
    console.log(this.question.slides);
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
    this.questionService.orderSlides(orders).subscribe(res => {
      console.log(res);
    });
    console.log(orders);
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

  ondragend() {
    this.mouving = false;
    this.draggingId = null;
  }

  deleteSlide(slide) {
    if (slide) {
      const d = this.dialog.open(DeleteSlideComponent, { disableClose: true, data: slide });
      d.afterClosed().subscribe(res => {
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

  async ngAfterViewInit() {
    // this.initDragDropComponent();
    // jQuery('#drag-component').draggable();
    await jQuery('#s-content').on('mouseup', async (e) => {
      await this.ondragend();
    });
    const sw = await jQuery('#s-content').innerWidth();
    const sh = await jQuery('#s-content').innerHeight();
    this.step = await Math.round(Math.round(sw) / 40);
    await this.customAreaInit();
  }

  importSlide() {
    console.log('import slide');
    const obj: any = {};
    obj.question = this.question;
    obj.questionId = this.question.questionId;
    const dialogRef = this.dialog.open(ImportSlideComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      //this.bindingQuestion(res);
      console.log(res);
    });
  }

  toggleGrid(event) {
    this.grid = event.checked;
    localStorage.setItem('grid_' + this.testId, String(this.grid));
  }

  setListView() {
    this.listView = true;
    this.gridView = false;
  }

  setGridView() {
    this.listView = false;
    this.gridView = true;
  }

  ngOnDestroy() {
    this.saveQuestion();
  }

  filterMedia(type) {
    console.log(type, this.filterName)

    const length = 24;
    this.allMedias[type] = [];
    this.mediaLoading = true;
    this.mediaService.filterMedia(type, this.filterName, null, null, null, length).subscribe(res => {
      if (res.status === 'OK') {
        console.log(res)
        for (const item of res.response) {
          this.allMedias[type].push(item);
        }
        this.getPageIndex(type, false, true);
        this.mediaLoading = false;
      } else {
        console.log('Server error');
        this.processStatusError(res.errors);
        this.mediaLoading = false;
      }
    });
  }

  async customAreaInit() {
    this.canvas = await new fabric.Canvas('myCanvas');
    await this.canvas.setHeight(+this.heightQuestionCenterContent.replace('px', ''));
    await this.canvas.setWidth(this.v);
    this.ctx = await this.canvas.getContext('2d');
    this.ctx.globalCompositeOperation = 'destination-over';
  }

  previewQuestion(slideIndex) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.testId,
        index: this.index,
        slideIndex: slideIndex,
        preview: true
      }
    };
    this.router.navigate(['/home/testingtool/testplayer'], navigationExtras);
  }

  setMiddle(comp) {
    console.log(comp);
    comp.posY = (parseFloat(this.heightQuestionCenterContent) / 2) - (parseFloat(comp.dimHeight) / 2);
    comp.posX = (parseFloat(this.widthQuestionCenter) / 2) - (parseFloat(comp.dimWidth) / 2);
    comp.pos = comp.posX + ',' + comp.posY;
    if (comp.options === undefined || comp.options === null) {
      comp.options = {};
    }
    comp.options.middle = true;
  }

  setCenter(comp) {
    comp.posX = (parseFloat(this.widthQuestionCenter) / 2) - (parseFloat(comp.dimWidth) / 2);
    comp.pos = comp.posX + ',' + comp.posY;
    if (comp.options === undefined || comp.options === null) {
      comp.options = {};
    }
    comp.options.middle = true;
  }


}
