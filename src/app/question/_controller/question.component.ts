import {
  AfterViewInit, Component, OnInit, ComponentFactoryResolver
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../share/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { MediaService } from '../../media/_services/media.service';
import { Photo } from '../../media/_model/photo';
import { QuestionService } from '../_services/question.service';
import { Question, TransitionType } from '../../models/question';
import { SComponent, SSlide, SComp, SlideComponent, SlideType } from '../../models/component';
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


declare var jQuery: any;

@Component({
  selector: 'app-question',
  templateUrl: '../_views/question.component.html',
  styleUrls: ['../_views/question.component.scss', '../../share/e-home.scss']
})
export class QuestionComponent extends BaseComponent implements OnInit, AfterViewInit {
  hieghtQuestion: string;
  heightQuestionCenter: string;
  heightQuestionCenterContent: string;
  heightContentTab: string;
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
  mouving: boolean;
  draggingId: string;
  saveOnChange: boolean;
  step: number;
  backgroundColor: string;
  toggleGrid: any;
  grid: any;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private questionService: QuestionService,
    private location: Location,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this.hieghtQuestion = (this.height - 100) + 'px';
    this.heightContentTab = (this.height - 150) + 'px';
    this.heightQuestionCenter = (this.height - 80) + 'px';
    this.heightQuestionCenterContent = (this.height - 110) + 'px';
    this.draggingId = null;
    this.saveOnChange = false;
    this.step = 10;
    this.backgroundColor = '#fff';
    this.currentSlideName = '';
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
    this.route.queryParams.subscribe(params => {
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
          console.log(this.question);
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
      this.loadMedia('PHOTO');
      this.loadMedia('VIDEO');
      //this.loadMedia('AUDIO');
      //this.loadMedia('TEXT');
      this.selectedTab = 'PHOTO';
      resolve();
    });
    return promise;
  }

  loadMedia(type: string) {
    this.mediaLoading = true;
    this.medias = [];
    if (this.allMedias[type] != undefined && this.allMedias[type] != null) {
      //this.medias = this.allMedias[type];
      this.mediaLoading = false;
      return;
    }

    this.mediaService.getMedia(type).subscribe(res => {
      if (res.status === 'OK') {
        //this.medias = res.response;
        this.allMedias[type] = res.response;
        console.log(this.allMedias);
      } else {
        console.log('Server error');
        this.processStatusError(res.errors);
      }
      this.mediaLoading = false;
    });
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
    for (let i = 0; i < slide.slideContent.componentArray.length; i++) {
      const comp = new SComponent();
      comp.fromSComp(slide.slideContent.componentArray[i], sw, sh);
      if (comp.mediaId != undefined && comp.mediaId != null && comp.mediaId.trim() != '') {
        comp.url = this.getMediaUrlFromId(comp.componentType, comp.mediaId);
      }
      ret.push(comp);
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
    for (const media of this.allMedias[g]) {
      if (media.mediaId == mediaId) {
        return media.mediaThumbPath;
      }
    }
  }

  private updatePosition(index, x, y) {
    const c: SComponent = this.components[this.currentSlideId][index];
    c.posX = x;
    c.posY = y;
  }

  addComponent1(e) {
    console.log(e);
  }

  calcPosition(x) {

    // x = Math.round(x);
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
          component.name = 'input';
          component.chars = 20;
          component.transition = false;
          component.isResizable = true;
          break;
        case 'TEXTAREA':
          component.name = 'textArea';
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
          component.groupName = 'checkbox';
          break;
        case 'RANGE':
          component.name = 'range';
          component.isResizable = true;
          component.min = 0;
          component.max = 100;
          component.step = 1;
          break;
        case 'IMAGE':
        case 'VIDEO':
          component.dimHeight = 80;
          component.dimWidth = 80;
          component.dim = 80 + ',' + 80;
          component.mediaId = obj.mediaId;
          component.url = obj.url;
          component.isResizable = true;
          break;
        case 'CLICK_AREA':
          component.dimHeight = 80;
          component.dimWidth = 100;
          component.dim = 100 + ',' + 80;
          component.isResizable = true;
          break;
        case 'TEXTBLOCK':
          component.dimHeight = 80;
          component.dimWidth = 200;
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
          component.isResizable = false;
          break;
      }
      this.components[this.currentSlideId].push(component);
      this.configureResizableObject(component);
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
    if (id === undefined || id === null) {
      id = e.target.id;
      h = e.target.clientHeight;
      w = e.target.clientWidth;
    }


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
        component.numRadio = d.radioComponent.length;
        component.radioComponent = d.radioComponent;
        component.transition = d.transition;
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

  private dialogImage(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ImageComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.value = '' + d.value;
        component.transition = d.transition;
      }
    });
  }

  private dialogVideo(component: SComponent) {
    const obj: any = Object.assign({}, component);
    const dialogRef = this.dialog.open(ImageComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'OK') {
        const d = res.data;
        component.value = '' + d.value;
        component.transition = d.transition;
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
        component.transition = d.transition;
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



  backQuestion() {
    this.location.back();
  }

  ondragstart(id) {
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


  ngAfterViewInit() {
    // this.initDragDropComponent();
    // jQuery('#drag-component').draggable();
    jQuery('#s-content').on('mouseup', (e) => {
      this.ondragend();
    });
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();
    this.step = Math.round(Math.round(sw) / 20);
  }
}
