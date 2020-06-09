import { RadioComponent } from './../../../question/_controller/radio.component';
import {
  AfterViewInit, Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { MediaService } from '../../media/_services/media.service';
import { Photo } from '../../media/_model/photo';
import { TestPlayerService } from '../_services/testPlayer.service';
import { Question, TransitionType } from '../../../models/question';
import { Test } from '../../../models/test';
import { SComponent, SSlide, SlideType, SCompType, TestResult, QuestionResult } from '../../../models/component';
import { UserInfoComponent } from '../_controller/userInfo.component';
// import { FileUploader } from 'ng2-file-upload';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { UploadsDialogComponent } from '../_controller/uploadsDialog.component';
import { FinishedRaportDialog } from '../_controller/FinishedRaportDialog.component';
import { Observable, Subject } from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-question',
  templateUrl: '../_views/testPlayer.component.html',
  styleUrls: ['../_views/testPlayer.component.scss', '../../../share/e-home.scss']
})
export class TestPlayerComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  hieghtQuestion: string;
  heightQuestionCenter: string;
  heightQuestionCenterContent: string;
  heightContentTab: string;
  widthQuestionCenter: string;
  medias: Array<Photo>;
  selectedTab: string;
  allMedias: Array<Photo>;
  mediaLoading: boolean;
  testId: string;
  test: Test;
  questions: Array<Question>;
  questionLoading: boolean;
  components: Array<Array<SComponent>>;
  currentSlideId: string;
  currentSlideIndex: number;
  currentSlide: SSlide;
  currentQuestionId: string;
  currentQuestion: Question;
  currentQuestionIndex: number;
  timer: any;
  result: TestResult;
  resultQuestion: QuestionResult;
  canChange: boolean;
  backgroundColor: string;
  currentSlideName: string;
  preview: boolean;
  stimulusOrderInTest: number;
  stimulusOrderInBlock: number;
  currentBlock: string;
  toc: any;
  dialogUploadsResult: any;
  currentUploadCmp: any;
  percentuali: Array<any>;
  topic: any;

  limitRowContainer: any = {};
  limitColContainer: any = {};
  tableComponent: any;
  loading = false;

  backButton = false;
  allEntryQueue: Array<any> = [];
  report;
  uploadedFiles: Array<any> = [];
  checkBoxAnswers: {};
  private _unsubscribeAll: Subject<any>;


  public uploader: FileUploader = new FileUploader({ url: Baseconst.getCompleteBaseUrl() });
  private hasBaseDropZoneOver = false;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private testPlayerService: TestPlayerService,
    private location: Location,
    public dialog: MdDialog,
    private zone: NgZone,
    private cdr: ChangeDetectorRef) {
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
      this.heightQuestionCenterContent = h + 'px';
      this.heightQuestionCenter = (h + 30) + 'px';
    } else {
      v = (this.height - 110) * 1.77;
      v = Math.round(v);
      h = v / 1.77;
      h = Math.round(h);
      /*this.heightQuestionCenter = (h - 60) + 'px';
      this.heightQuestionCenterContent = (h - 110) + 'px';*/
      this.heightQuestionCenterContent = h + 'px';
      this.heightQuestionCenter = (h + 30) + 'px';
    }

    this.hieghtQuestion = (h - 100) + 'px';
    this.heightContentTab = (h - 150) + 'px';
    // this.heightQuestionCenter = (h - 80) + 'px';
    // this.heightQuestionCenterContent = (h - 110) + 'px';
    this.widthQuestionCenter = '' + v + 'px';

    this.components = new Array();
    this.result = new TestResult();
    this.canChange = false;
    this.currentQuestionIndex = -1;
    this.currentSlideIndex = -1;
    this.currentSlideName = '';
    this.backgroundColor = '#fff';
    this.preview = true;
    this.stimulusOrderInTest = 0;
    this.stimulusOrderInBlock = 0;
    this.currentBlock = null;
    this.toc = new Array();
    this.percentuali = new Array();

    // this.url = Baseconst.getCompleteBaseUrl();
  }

  ngOnInit(): void {
    this.allMedias = new Array();

    this.initTest();
    //this.initInputDefault();
    //this.loadMedias().then(() => {
    this.loadTestInfo();
    this.initUploader();
    //});
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initTest() {

    this.test = new Test();
    this.test.options = new Object();
    this.test.questions = new Array<Question>();
    const q = new Question();
    q.slides = new Array<SSlide>();
    this.currentQuestion = q;
    this.currentSlide = new SSlide();

  }


  initUploader(mimeTypes = null) {
    this.route.queryParams
      .takeUntil(this._unsubscribeAll)
      .subscribe(params => {
        const token: string = localStorage.getItem('token');
        const URL = Baseconst.getCompleteBaseUrl() + 'atlas/media';

        if (!mimeTypes) {
          this.uploader = new FileUploader({
            url: URL, autoUpload: true,
            additionalParameter: { 'testId': params.id }
          });
        } else {
          this.uploader = new FileUploader({
            url: URL, autoUpload: true, allowedMimeType: mimeTypes,
            additionalParameter: { 'testId': params.id }
          });
        }

        this.uploader.setOptions({ headers: [{ name: 'authtoken', value: token }] });

        // this.uploader.onAfterAddingFile = (fileItem) => {
        //   this.uploadsChange(this.currentUploadCmp, fileItem._file.name);
        // };

        this.uploader.onWhenAddingFileFailed = (item) => {
          this.openSnackBar('Could Not Upload ' + item.name + ' !');
        };

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          const buffer = JSON.parse(response);
          if (buffer.status === 'OK') {
            this.uploadsChange(this.currentUploadCmp, item, buffer);
            this.openSnackBar('Upload successful!');
          }
          else {
            if (buffer.errors != undefined && buffer.errors != null) {
              let error = '';
              let sep = '';
              for (let i = 0; i < buffer.errors.length; i++) {
                const err = buffer.errors[i];
                error += sep + err.errorMessage;
                sep = ', ';
              }
              this.openSnackBar('Upload error! - ' + error);
            } else
              this.openSnackBar('Upload error!');
          }
        };

      });
  }



  isInCheckedString(comp: any, i: number, j: number) {

    if (this.resultQuestion.directAnswer[this.currentSlideId] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
    }


    Object.keys(this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName]).map(key => {
      if (key !== comp.id) {
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][key];
      }
      return this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][key];
    });


    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = { value: '' };
    }


    const currentCheckedString = this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value;
    const token = '#' + i + '-' + j;

    if (currentCheckedString.indexOf(token) !== -1) {
      return true;
    }
    else {
      return false;
    }
  }

  isCheckboxDisabled(comp: any, i, j, event) {

    let currentCheckedString = '';

    if (this.resultQuestion.directAnswer[this.currentSlideId] === undefined || this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === null || this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === null) {
      currentCheckedString = '';
    } else {
      currentCheckedString = this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value;
    }

    const token = '#' + i + '-' + j;

    if (currentCheckedString.indexOf(token) >= 0) {
      return false;
    }

    if ((!!this.limitRowContainer[comp.id] && !!this.limitRowContainer[comp.id][i] && !!comp.options['tableComponentRowLimit_' + i] && comp.options['tableComponentRowLimit_' + i] !== '0' && comp.options['tableComponentRowLimit_' + i] === this.limitRowContainer[comp.id][i]) || (!!this.limitColContainer[comp.id][j] && !!comp.options['tableComponentColLimit_' + j] && comp.options['tableComponentColLimit_' + j] !== '0' && comp.options['tableComponentColLimit_' + j] === this.limitColContainer[comp.id][j])) {
      return true;
    }
    return false;
  }

  onFileOver(cmp: any) {
    this.currentUploadCmp = cmp;
  }

  openDialogUploads(cmp: any) {

    switch (cmp.groupName) {
      case 'Foto':
        this.initUploader(['image/bmp', 'image/jpeg', 'image/jpg', 'image/png']);
        break;
      case 'File':
        this.initUploader(['aplication/doc', 'aplication/docx', 'text/plain', 'application/msexcel', 'application/vnd.ms-excel', 'application/xls']);
        break;
      case 'Pdf':
        this.initUploader(['aplication/pdf']);
        break;
      case 'Video':
        this.initUploader(['video/mp4', 'video/flv', 'video/webm', 'video/mkv', 'video/gif', 'video/quicktime']);
        break;
      default:
        this.initUploader();
        break;
    }
    this.currentUploadCmp = cmp;



    if (!!this.allEntryQueue[cmp.name] && this.allEntryQueue[cmp.name].queue && this.allEntryQueue[cmp.name].queue.length > 0) {
      if (this.allEntryQueue[cmp.name]) {
        this.uploader.queue = this.allEntryQueue[cmp.name].queue;
      }
    } else {
      this.allEntryQueue[cmp.name] = [];
    }
    var oldel = null
    if (this.report != undefined && this.report != null &&
      this.report.questions[this.currentQuestionIndex] != undefined && this.report.questions[this.currentQuestionIndex] != null &&
      this.report.questions[this.currentQuestionIndex].directAnswer[this.currentSlideId] != undefined &&
      this.report.questions[this.currentQuestionIndex].directAnswer[this.currentSlideId] != null &&
      this.report.questions[this.currentQuestionIndex].directAnswer[this.currentSlideId][cmp.name] != undefined &&
      this.report.questions[this.currentQuestionIndex].directAnswer[this.currentSlideId][cmp.name] != null) {
      oldel = this.report.questions[this.currentQuestionIndex].directAnswer[this.currentSlideId][cmp.name][cmp.id];
    }
    const dialogRef = this.dialog.open(UploadsDialogComponent, {
      data: {
        uploader: this.uploader,
        uploaded: this.uploadedFiles,
        alreadyUploaded: oldel
      },

    });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(result => {
        if (result) {
          this.allEntryQueue[cmp.name].queue = result.queue;
          this.uploader = result;
        }
      });

  }



  loadTestInfo() {
    this.route.queryParams
      .takeUntil(this._unsubscribeAll)
      .subscribe(params => {
        if (params.preview !== undefined && params.preview !== null && params.preview === 'false') {
          this.preview = false;
        }
        this.testPlayerService.requetGetTest(params.id)
          .takeUntil(this._unsubscribeAll)
          .subscribe(res => {
            if (res.status === 'OK') {
              this.test = res.response;
              console.log(this.test)
              this.loadReport().then(() => {
                //this.initSlides();
                this.loadMedia().then(() => {
                  //this.randomizeQuestions();
                  this.questions = this.test.questions;
                  console.log(this.questions)
                  this.generateToc();
                  this.calculatePercentuali();
                  if (this.preview) {
                    this.startTest();
                  } else {
                    this.loadUserInfoForm();
                  }
                });
              });
              //this.initSlides();
              /*this.loadMedia().then(() => {
                //this.randomizeQuestions();
                this.questions = this.test.questions;
                console.log(this.questions)
                this.generateToc();
                this.calculatePercentuali();
                if (this.preview) {
                  this.startTest();
                } else {
                  this.loadUserInfoForm();
                }
              });*/
            } else {
              this.processStatusError(res.errors);
              console.error('Server error');
            }
          });

      });
  }

  loadReport() {
    const promise = new Promise((resolve, reject) => {
      this.route.queryParams
        .takeUntil(this._unsubscribeAll)
        .subscribe(params => {
          if (!!params.report_id) {
            this.testPlayerService.getReportById(params.report_id)
              .takeUntil(this._unsubscribeAll)
              .subscribe(res => {
                this.report = res;
                if (this.report !== undefined && this.report != null) {
                  this.result.oldReportId = params.report_id;
                }
                resolve();
              });
          } else {
            resolve();
          }
        });
    });
    return promise;
  }

  generateToc() {
    let currentLevel = 0;
    const levels = new Array();

    levels[1] = -1;
    levels[2] = -1;
    levels[3] = -1;

    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (q === undefined || q === null) {
        continue;
      }
      if (q.options === undefined || q.options === null) {
        q.options = {};
      }
      if (q.options.level === undefined || q.options.level === null) {
        q.options.level = 1;
      }

      q.options.level = parseInt(q.options.level);

      if (q.options.level > 1 && levels[1] === -1) {
        const el = { childs: [] };
        this.insertInToc(1, el, currentLevel, levels, this.toc);
      }

      // devo inserire al livello N;
      const element = {
        qid: q.questionId,
        name: q.name,
        childs: []
      };
      this.insertInToc(q.options.level, element, currentLevel, levels, this.toc);
      currentLevel = q.options.level;
    }
  }

  getPercentuale() {
    return this.percentuali[this.currentSlideId];
  }

  calculatePercentuali() {
    let total = 0;
    for (let i = 0; i < this.questions.length; i++) {
      total += this.questions[i].slides.length;
    }
    let ind = 0;
    for (let i = 0; i < this.questions.length; i++) {
      for (let y = 0; y < this.questions[i].slides.length; y++) {
        ind++;
        this.percentuali[this.questions[i].slides[y].slideId] = Math.round((ind / total) * 100);
      }
    }
  }

  insertInToc(level, element, currentLevel, levels, toc) {
    if (level === 1) {
      element.flqid = element.qid;
      levels[1]++;
      toc[levels[1]] = element;
      if (currentLevel > 1) {
        levels[2] = -1;
        levels[3] = -1;
      }
      currentLevel = level;
    }

    if (level === 2) {
      element.flqid = toc[levels[1]].qid;
      levels[2]++;
      toc[levels[1]].childs[levels[2]] = element;
      if (currentLevel > 2) {
        levels[3] = -1;
      }
      currentLevel = level;
    }

    if (level === 3) {
      element.flqid = toc[levels[1]].qid;
      levels[3]++;
      toc[levels[1]].childs[levels[2]].childs[levels[3]] = element;
      currentLevel = level;
    }
  }

  startTest() {
    if (this.questions.length > 0) {
      this.startTestCounter();

      this.route.queryParams
        .takeUntil(this._unsubscribeAll)
        .subscribe(params => {
          if (!!params.index) {
            this.selectQuestion(this.questions[params.index]);
          } else {
            this.selectQuestion(this.questions[0]);
          }
        });
      this.currentQuestionIndex = 0;
    }
  }

  loadUserInfoForm() {
    if (this.report === undefined) {
      const obj: any = Object.assign({});
      const dialogRef = this.dialog.open(UserInfoComponent, { disableClose: true, data: obj });
      dialogRef.afterClosed()
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            const d = res.data;
            this.result.userInfo = d;

            this.startTest();
          }
        });
    } else {
      const obj: any = Object.assign({}, this.report.userInfo);
      const dialogRef = this.dialog.open(UserInfoComponent, { disableClose: true, data: obj });
      dialogRef.afterClosed()
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            const d = res.data;
            this.result.userInfo = d;
            this.startTest();
          }
        });
    }
  }

  loadMedia() {
    const promise = new Promise((resolve, reject) => {
      if (this.test !== undefined && this.test !== null) {
        /*for(let q of this.test.questions){
          this.loadMediaQuestion(q);
        }*/
        this.mediaService.getMediaByTestId(this.test.TestId)
          .takeUntil(this._unsubscribeAll)
          .subscribe(res => {
            if (res.status === 'OK') {
              //this.medias = res.response;
              this.allMedias = res.response;
            } else {
              this.processStatusError(res.errors);
            }
            resolve();
          });
      } else {
        resolve();
      }
    });
    return promise;
  }

  randomizeQuestions() {
    if (this.test.options !== undefined && this.test.options !== null &&
      (this.test.options.randomized === true || this.test.options.randomized === 'true')) {
      /*TODO effettuare la randomizzazione delle domande;*/
      //prima di tutto devo individuare i diversi gruppi;
      let groups = new Array<Object>();
      for (let i = 0; i < this.test.questions.length; i++) {
        const q = this.test.questions[i];
        let rb = '_default_';
        if (q.options !== undefined && q.options !== null) {
          if (q.options.randomizationBlock !== undefined && q.options.randomizationBlock !== null &&
            q.options.randomizationBlock !== '') {
            rb = q.options.randomizationBlock;
          }
        }
        if (groups[rb] === undefined || groups[rb] === null) {
          groups[rb] = new Array<Question>();
        }
        groups[rb].push(this.test.questions[i]);
      }
      groups = this.shuffle(groups);
      this.questions = [];
      for (let y = 0; y < groups.length; y++) {
        for (let k = 0; k < groups[y]['questions'].length; k++) {
          const q = groups[y]['questions'][k];
          q.groupIndex = (y + 1);
          q.questionIndexGroup = (k + 1);
          q.groupName = groups[y]['groupName'];
          this.questions.push(q);
        }
      }
      /*let keys = Object.keys(groups);
      this.questions = [];
      for(let y = 0; y < keys.length; y++) {
        for(let k = 0; k < groups[keys[y]].length; k++){
          let q = groups[keys[y]][k];
          q.groupIndex = (y+1);
          q.groupName = keys[y];
          this.questions.push(q);
        }
      }*/
    } else {
      this.questions = this.test.questions;
    }
  }

  shuffle(arr) {
    const keys = Object.keys(arr);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
      array[i] = keys[i];
    }
    let currentIndex = keys.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      ret[i] = { 'groupName': array[i], 'questions': arr[array[i]] };
    }
    return ret;
  }

  selectQuestion(q: Question, ultimateSlider = false) {
    if (q === undefined && q === null) {
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.questions[0];
      this.currentQuestionId = this.currentQuestion.questionId;
    } else {
      this.currentQuestion = q;
      this.currentQuestionId = q.questionId;
      this.currentQuestionIndex = this.getCurrentQuestionIndex();
    }
    if (this.currentBlock !== q.groupName) {
      this.currentBlock = q.groupName;
      this.stimulusOrderInBlock = 0;
    }

    this.startQuestionCounter(q);
    this.initSlides(this.currentQuestion);
    if (!ultimateSlider) {
      this.selectFirstSlide(this.currentQuestion);
    } else {
      this.selectlastSlide(this.currentQuestion);
    }


  }

  selectFirstSlide(q: Question) {
    if (q !== undefined && q !== null) {
      if (q.slides !== undefined && q.slides !== null && q.slides.length > 0) {
        this.currentSlideIndex = -1;
        this.goToNextSlide();
        //this.selectSlide(q.slides[0]);
      }
    }
  }

  selectlastSlide(q: Question) {
    if (q !== undefined && q !== null) {
      if (q.slides !== undefined && q.slides !== null && q.slides.length > 0) {
        this.changeSlide((q.slides.length - 1));
      }
    }
  }


  selectSlide(s: SSlide) {
    if (s !== undefined && s !== null) {
      this.currentSlide = s;
      this.currentSlideId = s.slideId;
      this.setSlideConfig();
    }
    this.completeSlideChange();
  }

  completeSlideChange() {
    clearTimeout(this.timer);
    this.timer = null;
    this.startSlideCounter();
    this.checkSlideAction();
  }

  setSlideConfig() {
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
  }

  changeSlide(i: number) {
    /*if (!this.canChange) {
      return;
    }*/

    if (i < this.currentQuestion.slides.length) {
      this.currentSlide = this.currentQuestion.slides[i];
      this.currentSlideIndex = i;
      this.currentSlideId = this.currentSlide.slideId;
      this.setSlideConfig();
    }
    this.components[this.currentSlideId] = this.convertComponents(this.currentSlide);
    this.completeSlideChange();
    setTimeout(() => {
      this.bindTopicClick();
    }, 100);
  }

  initSlides(question: Question) {
    if (question.slides === undefined || question.slides === null) {
      question.slides = new Array();
    }
    this.currentSlideId = question.slides[0].slideId;
    for (let i = 0; i < question.slides.length; i++) {
      this.components[question.slides[i].slideId] = this.convertComponents(question.slides[i]);
    }
    setTimeout(() => {
      this.bindTopicClick();
      setTimeout(() => {
        this.calcScale();
      }, 1200);

    }, 100);
  }

  convertComponents(slide) {

    if (slide === undefined || slide === null ||
      slide.slideContent === undefined || slide.slideContent === null ||
      slide.slideContent.componentArray === undefined || slide.slideContent.componentArray === null) {
      return new Array<SComponent>();
    }
    const ret = new Array<SComponent>();
    const sw = jQuery('#s-content').innerWidth();
    const sh = jQuery('#s-content').innerHeight();
    for (let i = 0; i < slide.slideContent.componentArray.length; i++) {
      const comp = new SComponent();
      comp.fromSComp(slide.slideContent.componentArray[i], sw, sh);
      slide.slideContent.componentArray[i].id = comp.id;
      if (comp.mediaId !== undefined && comp.mediaId !== null && comp.mediaId.trim() !== '') {
        comp.url = this.getMediaUrlFromId(comp.componentType, comp.mediaId);
        if (comp.componentType === SCompType.VIDEO || comp.componentType === SCompType.TXTFILE || comp.componentType === SCompType.ELANFILE) {
          const media = this.getMediaFromId(comp.componentType, comp.mediaId);
          comp.url = Baseconst.getPartialBaseUrl() + '/retrievePublic?code=' + media.publicUrl;
        }
      }
      switch (comp.componentType) {
        case 'TEXT':
          this.getInputAnswers(comp).then((data) => {
            comp.value = data['value'];
          });
          break;
        case 'TEXTAREA':
          this.getInputAnswers(comp).then((data) => {
            comp.value = data['value'];
          });
          break;
        case 'CHECKBOX':
          this.getCheckboxAnswers(comp)
            .takeUntil(this._unsubscribeAll)
            .subscribe((data) => {
              comp.directAnswer.isChecked = data['isChecked'];
            });
          break;
        case 'RADIO':
          this.getRadioAnswers(comp).then((data: any) => {
            comp.radioComponent.map((radio, index) => {
              if (data === radio.value) {
                comp.radioComponent[index]['isChecked'] = true;
                comp.radioComponent[index]['isSelected'] = true;
              } else {
                comp.radioComponent[index]['isChecked'] = false;
                comp.radioComponent[index]['isSelected'] = false;
              }
            })
          });
          break;
        case 'RANGE':
          this.getRangeAnswers(comp).then((data) => {
            comp.directAnswer.value = data['value'];
          });
          break;
        case 'UPLOADS':
          comp.fileNames = new Array();
          /*this.getUplaodAnswersAsync(comp).then((data: Array<any>) => {
            data.forEach(element => {
              comp.fileNames.push(element['filename']);
            });
            this.uploadedFiles.push(data);
          });*/

          let data = this.getUplaodAnswersForComponent(comp);
          if (data != undefined && data != null) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              comp.fileNames.push(element['filename']);
            }
          }
          /*data.forEach(element => {
            comp.fileNames.push(element['filename']);
          });
          this.uploadedFiles.push(data);*/
          break;
        case 'CHECKABLETABLE':
          this.getCheckabletableAnswers(comp).then((data) => {
            comp.directAnswer.values = data['value'];
            const x = new Array();
            const y = new Array();
            if (comp.componentType === 'CHECKABLETABLE' && !this.limitRowContainer[comp.id]) {
              for (let a = 0; a < comp.options['numTableRowLabel']; a++) {
                for (let b = 0; b < comp.options['numTableColLabel']; b++) {
                  x[a] = 0;
                  y[b] = 0;
                }
              }
              this.limitRowContainer[comp.id] = x;
              this.limitColContainer[comp.id] = y;
              this.tableComponent = comp;
              ret.push(comp);
            }

          });
          break;
        default:
          break;
      }
      if (comp.options.topics !== undefined && comp.options.topics !== null &&
        comp.options.topics.trim() !== '') {
        try {
          comp.options.topicsObj = JSON.parse(comp.options.topics);
        } catch (exc) {
        }
      }
      if (comp.componentType === 'UPLOADS') {
        comp.value = '';
      }
      if (comp.componentType !== 'CHECKABLETABLE' && !ret.includes(comp)) {
        ret.push(comp);
      }
    }
    this.finishConvert();

    return ret;
  }

  finishConvert() {

    setTimeout(() => {
      this.calcScale();
    }, 500);

  }


  private getMediaUrlFromId(type, mediaId) {
    //TODO qui è necessario effettuare la ricerca del media;
    if (mediaId === undefined || mediaId === null) {
      return null;
    }
    for (const media of this.allMedias) {
      if (media.mediaId === mediaId) {
        return media.mediaPath;
      }
    }
    return '';
  }

  private getMediaFromId(type, mediaId) {
    //TODO qui è necessario effettuare la ricerca del media;
    if (mediaId === undefined || mediaId === null) {
      return null;
    }
    for (const media of this.allMedias) {
      if (media.mediaId === mediaId) {
        return media;
      }
    }
    return null;
  }


  getCurrentSlide() {
    const question = this.getCurrentQuestion();
    for (let i = 0; i < question.slides.length; i++) {
      if (question.slides[i].slideId === this.currentSlideId) {
        return question.slides[i];

      }
    }
  }

  getCurrentQuestion() {
    for (let y = 0; y < this.questions.length; y++) {
      if (this.questions[y].questionId === this.currentQuestionId) {
        return this.questions[y];
      }
    }
    return null;
  }

  getCurrentQuestionIndex() {
    for (let y = 0; y < this.questions.length; y++) {
      if (this.questions[y].questionId === this.currentQuestionId) {
        return y;
      }
    }
    return null;
  }


  backQuestion() {

    this.stopSlideCounter();
    this.stopQuestionCounter();
    this.stopTestCounter();

    this.testPlayerService.requestCreateReport(this.result)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.test = res.response;
          this.openSnackBar('TEST ENDED!!!');
          console.log("testPlayerService" + JSON.stringify(this.result))
          clearTimeout(this.timer);
          this.timer = null;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              id: this.test.TestId
            }
          };
          this.router.navigate(['/home/atlas/testedit'], navigationExtras);
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      });

  }


  ngAfterViewInit() {
    // this.initDragDropComponent();
    // jQuery('#drag-component').draggable();
    //this.bindTopicClick();
  }

  bindTopicClick() {
    jQuery('fra').click((event) => {
      const tid = event.currentTarget.getAttribute('tid');
      const components = this.components[this.currentSlideId];
      components.forEach(element => {
        if (element.options === undefined || element.options === null ||
          element.options.topicsObj === undefined || element.options.topicsObj === null) {
          return;
        }
        if (element.options.topicsObj[tid] === undefined || element.options.topicsObj[tid] === null)
          return;
        const topic = element.options.topicsObj[tid];
        this.showTopic(topic);
      });
    }
    );
  }

  showTopic(topic) {
    this.topic = topic;
  }

  hideTopic() {
    this.topic = null;
  }

  checkTransition(c: SComponent, $event) {
    if (c === undefined || c === null
      || c.componentType === undefined || c.componentType === null
      || c.options === undefined || c.options === null) {
      return;
    }
    switch (c.componentType) {
      case SCompType.TEXT:
      case SCompType.TEXTAREA:
        this.checkTransitionText(c, $event);
        break;
      case SCompType.RADIO:
      case SCompType.CHECKBOX:
      case SCompType.CLICK_AREA:
      case SCompType.BUTTON:
      case SCompType.IMAGE:
      case SCompType.UPLOADS:
      case SCompType.CHECKABLETABLE:
        this.checkTransitionCheckbox(c, $event);
        break;
      default:
        break;
    }
  }

  checkTransitionText(c: SComponent, $event) {
    if (c === undefined || c === null
      || c.componentType === undefined || c.componentType === null
      || c.options === undefined || c.options === null) {
      return;
    }
    if ($event.key !== 'Enter') {
      return;
    }
    if (c.transition === undefined || c.transition === null) {
      return;
    }

    if (c.transition === true) {
      this.performTransition();
    }
  }

  checkTransitionCheckbox(c: SComponent, $event) {
    if (c === undefined || c === null
      || c.componentType === undefined || c.componentType === null
      || c.options === undefined || c.options === null) {
      return;
    }
    if (c.transition === undefined || c.transition === null) {
      return;
    }
    if (c.transition === true) {
      this.performTransition();
    }
  }

  performTransition() {
    this.stopSlideCounter();
    clearTimeout(this.timer);
    this.timer = null;
    if (this.currentSlideIndex !== undefined && this.currentSlideIndex !== null) {
      this.goToNextSlide();
    } else {
      //si deve gestire il caso in cui, per qualche motivo, non viene incrementato l'indice;
    }
  }

  goToNextSlide() {
    if (this.currentSlideIndex < (this.currentQuestion.slides.length - 1)) {
      //ci sono altre slides
      this.changeSlide(this.currentSlideIndex + 1);
      /*this.currentSlideIndex++;
      this.currentSlide = this.currentQuestion.slides[this.currentSlideIndex];
      this.currentSlideId = this.currentSlide.slideId;
      this.setSlideConfig();
      this.checkSlideAction();*/
    } else {
      this.stopQuestionCounter();
      this.goToNextQuestion();
    }
  }

  goToNextQuestion() {

    if (this.currentQuestionIndex === undefined && this.currentQuestionIndex === null) {
      this.currentQuestionIndex = -1;
    }
    if (this.currentQuestionIndex < (this.questions.length - 1)) {
      this.selectQuestion(this.questions[this.currentQuestionIndex + 1]);
      /*this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.currentQuestionId = this.currentQuestion.questionId;
      this.initSlides(this.currentQuestion);
      this.selectFirstSlide(this.currentQuestion);*/
    } else {
      this.loading = true;
      this.stopTestCounter();

      this.testPlayerService.requestCreateReport(this.result)
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            this.test = res.response;
            this.loading = false;
            this.openSnackBar('TEST ENDED!!!');
            this.loadFinishedRaport();
          } else {
            this.loading = false;
            this.processStatusError(res.errors);
            console.error('Server error');
          }
        });
      this.openSnackBar('TEST ENDED!!!');
    }

  }

  goToPrevQuestion() {

    if (this.currentQuestionIndex === undefined && this.currentQuestionIndex === null) {
      this.currentQuestionIndex = -1;
    }
    if (this.currentQuestionIndex > 0) {
      this.selectQuestion(this.questions[this.currentQuestionIndex - 1], true);
      // this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.currentQuestionId = this.currentQuestion.questionId;
      // this.initSlides(this.currentQuestion);
      // this.selectFirstSlide(this.currentQuestion);
    } else {
      this.loading = true;
      this.stopTestCounter();

      this.testPlayerService.requestCreateReport(this.result)
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            this.test = res.response;
            this.loading = false;
            this.openSnackBar('TEST ENDED!!!');
            this.loadFinishedRaport();
          } else {
            this.loading = false;
            this.processStatusError(res.errors);
            console.error('Server error');
          }
        });

      this.openSnackBar('TEST ENDED!!!');
    }

  }

  goToPrevSlide() {

    if (this.currentSlideIndex > 0) {
      //ci sono altre slides
      this.changeSlide(this.currentSlideIndex - 1);
      // this.currentSlideIndex--;
      this.currentSlide = this.currentQuestion.slides[this.currentSlideIndex];
      this.currentSlideId = this.currentSlide.slideId;
      // this.setSlideConfig();
      // this.checkSlideAction();
    } else {
      this.stopQuestionCounter();
      this.goToPrevQuestion();
    }
  }

  loadFinishedRaport() {
    const obj: any = Object.assign({});
    const dialogRef = this.dialog.open(FinishedRaportDialog, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          const d = res.data;
          this.result.userInfo = d;

          this.startTest();
        }
      });
  }

  getInputAnswers(c) {
    const promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        this.result.questions.forEach((question, index) => {
          if (!!question && !!question.directAnswer[this.currentSlideId]) {
            Object.keys(question.directAnswer[this.currentSlideId]).map(key => question.directAnswer[this.currentSlideId][key]).map(directAnswer => {
              if (!!directAnswer) {
                Object.keys(directAnswer)
                  .map(subKey => directAnswer[subKey])
                  .map(component => {
                    if (component.name === c.name) {
                      resolve({ value: component.value });
                    }
                  });
              }
            });
          }
          if (index === (this.result.questions.length - 1)) {
            resolve({ value: '' });
          }
        });
      } else {
        resolve({ value: '' });
      }
    });
    return promise;
  }

  getCheckboxAnswers(c): Observable<any> {
    const observable = Observable.create((observer) => {
      if (this.result.questions.length > 0) {
        this.result.questions
          .forEach((question, index) => {
            if (!!question && !!question.directAnswer[this.currentSlideId]) {
              return Object.keys(question.directAnswer[this.currentSlideId])
                .map((key: any) => {
                  return question.directAnswer[this.currentSlideId][key]
                })
                .map((directAnswer: any) => {
                  return Object.keys(directAnswer)
                    .map((subKey: any) => {
                      return directAnswer[subKey];
                    })
                    .map((component: any) => {
                      if (component.name === c.groupName) {
                        observer.next({
                          name: component.name,
                          isChecked: component.isChecked
                        });
                      }
                    });
                });
            }
            if (index === (this.result.questions.length - 1)) {
              //observer.next({ isChecked: false });
            }
          });
      } else {
        observer.next({ isChecked: false });
      }
    });
    return observable;
  }

  getUplaodAnswersAsync(c) {
    const promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        this.result.questions
          .forEach((question, index) => {
            if (!!question && !!question.directAnswer[this.currentSlideId]) {
              return Object.keys(question.directAnswer[this.currentSlideId])
                .map((key: any) => {
                  return question.directAnswer[this.currentSlideId][key]
                })
                .map((directAnswer: any) => {
                  return Object.keys(directAnswer)
                    .map((subKey: any) => {
                      if (directAnswer[subKey].type === 'UPLOADS') {
                        directAnswer[subKey].forEach(element => {
                          c.fileNames.push(element.filename);
                        });
                        resolve(directAnswer[subKey]);
                      }
                      directAnswer[subKey].forEach(element => {
                        c.fileNames.push(element.filename);
                      });
                      resolve(directAnswer[subKey]);
                    })
                });
            }
            if (index === (this.result.questions.length - 1)) {
              resolve(null);
            }
          });
      } else {
        resolve(null);
      }
    });
    return promise;
  }


  getUplaodAnswers(c) {
    if (this.result.questions.length > 0) {
      for (let index = 0; index < this.result.questions.length; index++) {
        const question = this.result.questions[index];
        if (!!question && !!question.directAnswer[this.currentSlideId]) {
          return Object.keys(question.directAnswer[this.currentSlideId])
            .map((key: any) => {
              return question.directAnswer[this.currentSlideId][key]
            })
            .map((directAnswer: any) => {
              return Object.keys(directAnswer)
                .map((subKey: any) => {
                  if (directAnswer[subKey].type === 'UPLOADS') {
                    return directAnswer[subKey];
                  }
                  return directAnswer[subKey];
                })
            });
        }
        if (index === (this.result.questions.length - 1)) {
          return null;
        }
      }
    } else {
      return null;
    }
  }

  getUplaodAnswersForComponent(c) {
    if (this.result.questions.length > 0) {
      for (let index = 0; index < this.result.questions.length; index++) {
        const question = this.result.questions[index];
        if (!!question && question.questionId == this.currentQuestionId && !!question.directAnswer[this.currentSlideId]) {
          if (question.directAnswer[this.currentSlideId][c.name] != undefined && question.directAnswer[this.currentSlideId][c.name] != null) {
            if (question.directAnswer[this.currentSlideId][c.name][c.id] != undefined && question.directAnswer[this.currentSlideId][c.name][c.id] != null) {
              return question.directAnswer[this.currentSlideId][c.name][c.id];
            }
          }
        }
        if (index === (this.result.questions.length - 1)) {
          return null;
        }
      }
    } else {
      return null;
    }
  }


  getRadioAnswers(c) {
    var promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        for (let index = 0; index < this.result.questions.length; index++) {
          const question = this.result.questions[index];
          if (!!question && !!question.directAnswer[this.currentSlideId]) {
            //for (var key in question.directAnswer[this.currentSlideId]) {
            //if (Object.prototype.hasOwnProperty.call(question.directAnswer[this.currentSlideId], key)) {
            const directAnswer = question.directAnswer[this.currentSlideId][c.groupName];
            if (directAnswer != null) {
              for (var subKey in directAnswer) {
                if (Object.prototype.hasOwnProperty.call(directAnswer, subKey)) {
                  const component = directAnswer[subKey];
                  for (let i = 0; i < c.radioComponent.length; i++) {
                    const radio = c.radioComponent[i];
                    if (component.name === (radio.value + radio.label)) {
                      return resolve(radio.value);
                    }
                  }
                }
              }
            }

            //}
            //}
          }
          if (index == (this.result.questions.length - 1)) {
            resolve('Not checked');
          }
        }
      } else {
        resolve('Not checked');
      }
    });
    return promise;
  }
  getRadioAnswersOrig(c) {
    var promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        this.result.questions.forEach((question, index) => {
          if (!!question && !!question.directAnswer[this.currentSlideId]) {
            return Object.keys(question.directAnswer[this.currentSlideId])
              .map(key => {
                return question.directAnswer[this.currentSlideId][key]
              })
              .map(directAnswer => {
                return Object.keys(directAnswer)
                  .map(subKey => {
                    return directAnswer[subKey]
                  })
                  .map((component: any) => {
                    c.radioComponent.map((radio, index) => {
                      if (component.name === (radio.value + radio.label)) {
                        return resolve(radio.value);
                      }
                    })
                  });
              });
          }
          if (index == (this.result.questions.length - 1)) {
            return resolve('Not checked');
          }
        });
      } else {
        resolve('Not checked');
      }
    });
    return promise;
  }




  getRangeAnswers(c) {
    const promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        this.result.questions.forEach((question, index) => {
          if (!!question && !!question.directAnswer[this.currentSlideId]) {
            Object.keys(question.directAnswer[this.currentSlideId])
              .map(key => question.directAnswer[this.currentSlideId][key])
              .map(directAnswer => {
                Object.keys(directAnswer).map(subKey => directAnswer[subKey])
                  .map(component => {
                    if (component.name === c.name) {
                      resolve({ value: component.value });
                    }
                  });
              });
          }
          if (index === (this.result.questions.length - 1)) {
            resolve({ value: 0 });
          }
        });
      } else {
        resolve({ value: 0 });
      }
    });
    return promise;
  }


  getCheckabletableAnswers(c) {
    const promise = new Promise((resolve) => {
      if (this.result.questions.length > 0) {
        this.result.questions.forEach((question, index) => {
          if (!!question && !!question.directAnswer[this.currentSlideId]) {

            Object.keys(question.directAnswer[this.currentSlideId])
              .map(key => question.directAnswer[this.currentSlideId][key])
              .map(directAnswer => {

                Object.keys(directAnswer)
                  .map(subKey => directAnswer[subKey])
                  .map(component => {

                    if (component.name === c.groupName) {

                      const tableInputs = component.value.split('#');

                      tableInputs.shift();

                      resolve({ value: tableInputs });

                    }
                  });

              });
          }
          if (index === (this.result.questions.length - 1)) {
            resolve({ value: [] });
          }
        });
      } else {
        resolve({ value: [] });
      }
    });
    return promise;
  }



  checkSlideAction() {
    if (this.currentSlide.transitionType !== undefined && this.currentSlide.transitionType !== null) {
      for (const t of this.currentSlide.transitionType) {
        if (t === TransitionType.time &&
          this.currentSlide.options !== undefined && this.currentSlide.options !== null &&
          this.currentSlide.options.seconds !== undefined && this.currentSlide.options.seconds !== null &&
          this.currentSlide.options.seconds > 0) {
          const millisec = this.currentSlide.options.seconds * 1000;
          this.timer = setTimeout(() => {
            this.performTransition();
          }, millisec);
        }
      }
    }
  }

  onPlayerReady($event, cid, comp) {
    $event.play();
    if (!comp.options.autoplay || comp.options.autoplay === 'false' || comp.options.autoplay === false) {
      $event.pause();
    }
  }

  clickVideo($event) {
    if ($event.target.paused) {
      $event.target.play();
    } else {
      $event.target.pause();
    }
  }

  startTestCounter() {
    this.result.testId = this.test.TestId;
    this.result.testName = this.test.TestName;
    this.result.piId = ''; // TODO inserire l'id utente
    this.result.questions = new Array<QuestionResult>();
    if (!!this.report) {
      this.report.questions.forEach((questionResult) => {
        this.result.questions.push(questionResult);
      });
    }
    let date = new Date;
    let dateStr = date.getFullYear() + date.getMonth() + date.getDay();
    this.result.testStartTime = dateStr;
  }

  startQuestionCounter(q) {
    this.resultQuestion = null;
    this.result.questions.forEach((element) => {
      if (element != undefined && element != null && this.currentQuestion.questionId === element.questionId) {
        this.resultQuestion = element;
      }
    });
    if (!this.resultQuestion) {
      this.resultQuestion = new QuestionResult();
      this.resultQuestion.directAnswer = {};
      this.resultQuestion.expectedAnswer = {};
      this.resultQuestion.randomizationBlock = this.currentQuestion.groupName;
      this.resultQuestion.randomizationPresentationBlock = '' + this.currentQuestion.questionIndexGroup;
      this.resultQuestion.questionId = this.currentQuestion.questionId;
    }
  }

  startSlideCounter() {
    if (this.currentSlide.type === SlideType.STIMULUS) {
      this.stimulusOrderInBlock++;
      this.stimulusOrderInTest++;
      this.resultQuestion.stimulusSlideId = this.currentSlide.slideId;
      this.resultQuestion.stimulusSlideNumber = this.currentSlideIndex;
      this.resultQuestion.stimulusOrderInBlock = this.stimulusOrderInBlock;
      this.resultQuestion.stimulusOrderInTest = this.stimulusOrderInTest;
      this.resultQuestion.stimulusStartTime = (new Date()).getTime();
    }
    if (this.currentSlide.type === SlideType.ANSWER) {
      this.resultQuestion.answerStartTime = (new Date()).getTime();
    }
  }

  stopTestCounter() {
    let date = new Date;
    let dateStr = date.getFullYear() + date.getMonth() + date.getDay();
    this.result.testEndTime = dateStr;
  }

  stopQuestionCounter() {
    let question = null;
    this.result.questions.forEach((element, index) => {
      if (element != undefined && element != null && this.resultQuestion.questionId === element.questionId) {
        question = element;
        this.result.questions[index] = this.resultQuestion;
      }
    });
    if (!question) {
      this.result.questions.push(this.resultQuestion);
    }
  }

  stopSlideCounter() {
    if (this.currentSlide.type === SlideType.STIMULUS) {
      this.resultQuestion.stimulusEndTime = (new Date()).getTime();
    }
    if (this.currentSlide.type === SlideType.ANSWER) {
      this.resultQuestion.expectedAnswer = this.getExpectedAnswer();
      this.getCurrentAnswer();
      this.resultQuestion.answerEndTime = (new Date()).getTime();
    }
  }

  getExpectedAnswer(): any {
    const ret = {};
    for (let i = 0; i < this.currentSlide.slideContent.componentArray.length; i++) {
      const c = this.currentSlide.slideContent.componentArray[i];
      if (c.componentType === SCompType.RADIO) {
        for (let y = 0; y < c.options.numRadio; y++) {
          if (c.options['radioComponentIsCorrect_' + y] === 'true') {
            ret[c.options.groupName] = {};
            ret[c.options.groupName].label = c.options['radioComponentLabel_' + y];
            ret[c.options.groupName].value = c.options['radioComponentValue_' + y];
          }
        }
      }
      if (c.options) {
        if (c.options.isCorrect === 'true') {
          let n = '';
          if (c.options.groupName !== undefined && c.options.groupName !== null) {
            n = c.options.groupName;
          }
          if (c.options.name !== undefined && c.options.name !== null) {
            n = c.options.name;
          }
          if (c['name'] !== undefined && c['name'] !== null) {
            n = c['name'];
          }
          ret[n] = {};
          if (c.options.label !== undefined && c.options.label !== null) {
            ret[n].label = c.options.label;
          } else {
            ret[n].label = n;
          }
          ret[n].value = c.options.value;
        }
      }
      if (c.componentType === SCompType.CHECKABLETABLE) {
        ret[c.options.groupName] = {};
        ret[c.options.groupName].checkedString = c.options['checkedString'];
        ret[c.options.groupName].value = c.options['checkedString'];
      }

    }

    return ret;
  }

  getCurrentAnswer() {
    this.currentSlide.slideContent.componentArray.forEach(comp => {
      switch (comp.componentType) {
        case SCompType.TEXT:
        case SCompType.TEXTAREA:
          this.textChange(comp);
          break;
        case SCompType.CHECKBOX:
          break;
        case SCompType.RADIO:
          break;
        case SCompType.IMAGE:
          //this.imageChange(comp);
          break;
        case SCompType.CLICK_AREA:
          //this.clickareaChange(comp);
          break;
        case SCompType.RANGE:
          // this.rangeChange(comp);
          break;
        default:
          break;
      }

    });
  }

  textChange(c) {
    if (!c.options.notToSave !== undefined && (c.options.notToSave === 'true' || c.options.notToSave === true)) {
      return;
    }
    setTimeout(() => {
      const t = jQuery('#' + c.id).val();
      let name = c.options.name;
      let id = c.name + '_' + c.pos;
      id = c.id;
      if (name === undefined || name === null)
        name = c.groupName;
      if (name === undefined || name === null)
        name = c.name;

      if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
        this.resultQuestion.directAnswer[this.currentSlideId] = {};
      }

      // if(!this.resultQuestion.directAnswer[this.currentSlideId][name]){
      //   this.resultQuestion.directAnswer[this.currentSlideId][name] = {};
      // }

      // if(!this.resultQuestion.directAnswer[this.currentSlideId][name][c.id]){
      //   this.resultQuestion.directAnswer[this.currentSlideId][name][c.id] = {};
      // }

      // this.resultQuestion.directAnswer[this.currentSlideId] = {};
      if (!this.resultQuestion.directAnswer[this.currentSlideId][name]) {
        this.resultQuestion.directAnswer[this.currentSlideId][name] = {};
      }

      if (!this.resultQuestion.directAnswer[this.currentSlideId][name][id]) {
        this.resultQuestion.directAnswer[this.currentSlideId][name][id] = {};
      }

      this.resultQuestion.directAnswer[this.currentSlideId][name][id].value = t;
      this.resultQuestion.directAnswer[this.currentSlideId][name][id].name = c.name;
      this.resultQuestion.directAnswer[this.currentSlideId][name][id].type = c.componentType;
      this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

    }, 100);
  }

  textAreaChange(c) {
    let id = c.name + '_' + c.pos;
    id = c.id;
    if (c.options.notToSave !== undefined && (c.options.notToSave === 'true' || c.options.notToSave === true)) {
      return;
    }

    if (c.groupName === undefined || c.groupName === null)
      c.groupName = c.name;

    if (this.resultQuestion.directAnswer[this.currentSlideId] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][c.groupName] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName] = {};
    }
    if (this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id] = {};
    }

    setTimeout(() => {
      const t = jQuery('#' + c.id).val();
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id].value = t;
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id].name = c.groupName;
      this.resultQuestion.directAnswer[this.currentSlideId][c.groupName][id].type = c.componentType;
      this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

    }, 100);
  }

  checkboxChange(comp, index) {
    console.log(comp)
    if (!!comp.notToSave) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName]) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === null ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === undefined) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = {};
      if (comp.directAnswer.isChecked) {
        comp.directAnswer.isChecked = false;
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].isChecked = false;
      } else {
        comp.directAnswer.isChecked = true;
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].isChecked = true;
      }

    } else if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].isChecked === true) {
      comp.directAnswer.isChecked = false;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].isChecked = false;
      console.log(comp.directAnswer.isChecked)
    } else {
      comp.directAnswer.isChecked = true;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].isChecked = true;
      console.log(comp.directAnswer.isChecked)
    }
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].id = comp.id;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = comp.groupName;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].type = comp.componentType;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value = comp.value;
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;
    return;
  }

  checkbuttonChange(comp) {

    if (comp.notToSave !== undefined && (comp.notToSave === 'true' || comp.notToSave === true)) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] = {};
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = {};
    }

    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].value = comp.value;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].name = comp.name;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].type = comp.componentType;
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }

  radioChange(comp, elem, id) {


    if (comp.notToSave != undefined && (comp.notToSave == 'true' || comp.notToSave == true)) {
      return;
    }


    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }
    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] !== undefined
      && this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] !== null
      && this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] !== undefined
      && this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] !== null
      && this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name === elem.value + elem.label) {
      jQuery('#' + id)[0].checked = false;
      elem.isChecked = false;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value = null;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = null;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].type = null;
      console.log('deselezione');
    } else {
      elem.isChecked = true;
      for (let i = 0; i < comp.radioComponent.length; i++) {
        if (comp.radioComponent[i] !== elem) {
          comp.radioComponent[i]['isChecked'] = false;
        }
      }
      if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === undefined ||
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === null) {
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
      }
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};

      if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === undefined ||
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === null) {
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = {};
        this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = elem.value + elem.label;
      }
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value = elem.value;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = elem.value + elem.label;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].type = comp.componentType;
      console.log('selezione');
    }

    /*  this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = elem.value + elem.label; */

    /*  console.log(this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName]) */






    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }

  uploadsChange(comp, fileItem, response) {

    if (comp.notToSave !== undefined && (comp.notToSave === 'true' || comp.notToSave === true)) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] = {};
    }
    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = [];
    }

    const json = { id: response.response.mediaId, filename: fileItem._file.name, name: comp.name, type: comp.componentType };
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].push(json);
    if (comp.fileNames == undefined || comp.fileNames == null)
      comp.fileNames = new Array();
    comp.fileNames.push(fileItem._file.name);
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }

  checkableTableChange(comp, i, j) {

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
    }
    // if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === undefined ||
    //   this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] === null) {
    // }

    let currentCheckedString = '';

    Object.keys(this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName])
      .map(key => this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][key])
      .map(input => {
        currentCheckedString = input.value;
      });

    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = {};

    const token = '#' + i + '-' + j;

    if (currentCheckedString.indexOf(token) === -1) {
      this.limitRowContainer[comp.id][i]++;
      this.limitColContainer[comp.id][j]++;
      currentCheckedString = currentCheckedString + token;
    }
    else {
      this.limitRowContainer[comp.id][i]--;
      this.limitColContainer[comp.id][j]--;
      currentCheckedString = currentCheckedString.replace(token, '');
    }

    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value = currentCheckedString;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = comp.groupName;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].type = comp.componentType;

    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }


  imageChange(comp) {
    if (comp.options.checkable !== 'true' && comp.options.checkable !== true) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name] = {};
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name].name = comp.name;
    }
    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = { isChecked: false };
    }
    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].isChecked === false) {
      comp.options.isChecked = true;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].isChecked = true;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].value = comp.value;
    } else {
      comp.options.isChecked = false;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].isChecked = false;
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].value = null;
    }
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].type = comp.componentType;
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }

  clickareaChange(comp) {
    if (comp.notToSave !== undefined && (comp.notToSave === 'true' || comp.notToSave === true)) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName] = {};
      this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id] = {};
    }

    if (this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === undefined ||
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] === null) {
      this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = {};
    }

    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].value = comp.value;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].name = comp.groupName;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.groupName][comp.id].type = comp.componentType;
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;

  }


  rangeChange(comp, event) {
    if (comp.notToSave !== undefined && (comp.notToSave === 'true' || comp.notToSave === true)) {
      return;
    }

    if (!this.resultQuestion.directAnswer[this.currentSlideId]) {
      this.resultQuestion.directAnswer[this.currentSlideId] = {};
    }

    this.resultQuestion.directAnswer[this.currentSlideId][comp.name] = {};
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id] = {};
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].value = event.target.value;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].name = comp.name;
    this.resultQuestion.directAnswer[this.currentSlideId][comp.name][comp.id].type = comp.componentType;
    this.result.questions[this.currentQuestionIndex] = this.resultQuestion;


  }


  gotoSection(section) {
    let q = null;
    for (let y = 0; y < this.questions.length; y++) {
      if (this.questions[y].questionId === section.qid) {
        q = this.questions[y];
      }
    }
    if (q !== null) {
      this.stopSlideCounter();
      clearTimeout(this.timer);
      this.stopQuestionCounter();
      this.selectQuestion(q);
    }
  }

  getAutoplay(comp) {
    if (comp.options.autoplay === 'true') {
      return 'auto';
    } else {
      return 'none';
    }
  }

  getTicks(c) {
    const ret = new Array<any>();
    if (c === null) {
      return ret;
    }
    if (c['ticks'] !== undefined && c['ticks'] !== null)
      return c['ticks'];
    if (c.min === undefined || c.min === null ||
      c.max === undefined || c.max === null ||
      c.step === undefined || c.step === null) {
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
    if (c === null) {
      return ret;
    }
    if (c['labels'] !== undefined && c['labels'] !== null) {
      return c['labels'];
    }
    if (c.options === undefined || c.options === null ||
      c.options.labelNum === undefined || c.options.labelNum === null)
      return ret;

    const num = parseInt(c.options.labelNum, 10);
    for (let i = 0; i < num; i++) {
      const v = { 'label': c.options['label_' + i] };
      ret.push(v);
    }
    c['labels'] = ret;
    return ret;
  }

  closePlayer() {
    this.stopTestCounter();
    this.location.back();
  }

  calcScale() {
    if (!!this.tableComponent) {
      const comp = this.tableComponent;
      const sw = jQuery('#' + comp.id).innerWidth();
      const sh = jQuery('#' + comp.id).innerHeight();
      const table = jQuery('#' + comp.id + ' > div > table')[0];
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
      this.tableComponent = null;
    }
  }

}
