import { DialogHyperlinkComponent } from './../../dialogHyperlink/_controller/dialog-hyperlink.component';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { TestEditService } from '../_services/testEdit.service';
import { Grammar, GrammarStatus } from '../_model/grammar';
import { GrammarPart } from '../_model/grammarpart';
import { Question } from '../../../models/question';
import { ProfileSerivce } from '../../../profile/_service/profile.service';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../../media/_model/photo';
import { MediaService } from '../../media/_services/media.service';
import { ConfigGrammarComponent } from './configGrammar.component';


declare var jQuery: any;
declare var require: any;
const $Spelling = require('../../../../assets/js/include.js');

@Component({
  selector: 'app-test-editor',
  templateUrl: '../_views/testEdit.component.html',
  styleUrls: ['../../../share/e-home.scss', '../_views/testEdit.component.scss']
})
export class TestEditComponent extends BaseComponent implements OnInit {

  heightTestEdit: string;
  heightTestEditConfig: string;
  hieghtQuestion: string;
  grammar: Grammar;
  isLoading: boolean;
  questionLoading: boolean;
  options: Array<string>;
  user: any;
  ckeditorContent: string;
  froalaoptions: any;
  grammarPart: GrammarPart;
  url: string;
  allMedias: Array<Array<Photo>>;
  medias: Array<Photo>;
  selectedTab: string;
  mediaLoading: boolean;
  html: string;
  grammarTitle: string;
  listView = false;
  gridView = true;
  timeoutID: number;
  mediaVideoPageIndex: number = 0;
  mediaPhotoPageIndex: number = 0;
  mediaAudioPageIndex: number = 0;
  mediaElanPageIndex: number = 0;
  allMediasContainer: Array<Array<Photo>>;

  // This object holds url by tab index
  urlObj = {};

  // This object holds folder indexes for each folder
  folderIndexes = {};




  loadMorePhoto: boolean = true;
  loadMoreVideo: boolean = true;
  loadMoreAudio: boolean = true;
  loadMoreElan: boolean = true;

  folderMediaId: string;
  isFolder: boolean;



  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private testEditService: TestEditService,
    public dialog: MdDialog,
    private mediaService: MediaService,
    public profileService: ProfileSerivce,
    public el: ElementRef,
  ) {
    super(router, mdSnackBar);
    this.heightTestEdit = this.height + 'px';
    this.hieghtQuestion = this.height + 'px';
    this.heightTestEditConfig = this.height - 80 + 'px';
    //this.url = Baseconst.protocol + '://' + Baseconst.frontend_url;
    this.url = Baseconst.getPartialBaseUrl();
  }

  @ViewChild('editor') editor: any;

  ngOnInit() {
    this.allMedias = new Array();
    this.loadUserInfo();
    this.init();
    this.loadMedias();
    this.urlObj[this.selectedTab || 'PHOTO'] = {};
    this.folderIndexes[this.selectedTab || 'PHOTO'] = 0;
    this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']] = `${this.selectedTab || 'PHOTO'}`;
    this.testEditService.uuidLink.subscribe((uuidLink: string) => {
      this.editGrammarPart({ uuid: uuidLink });
    });
  }

  openFolder(folder) {
    this.isFolder = true;
    this.folderIndexes[this.selectedTab || 'PHOTO'] += 1;
    this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']] = `${this.selectedTab || 'PHOTO'}&parentId=${folder.mediaId}`;
    this.folderMediaId = folder.mediaId;
    this.loadMediaUtil(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']]);
  }

  goBack() {
    this.folderIndexes[this.selectedTab || 'PHOTO'] -= 1;
    this.loadMediaUtil(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']]);
  }


  isUrlRoot() {
    return !(this.urlObj[this.selectedTab || 'PHOTO'][this.folderIndexes[this.selectedTab || 'PHOTO']].includes("parentId"));
  }

  loadUserInfo() {
    const userStr: string = localStorage.getItem('userInfo');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.profileService.getUserCurrent().subscribe(res => {
        if (res.status === 'OK') {
          this.user = res.response;
          localStorage.setItem('userInfo', JSON.stringify(this.user));
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      });
    }
  }


  init() {
    this.grammar = new Grammar();
    this.isLoading = true;
    this.testEditService.setCurrentController(this);
    this.route.queryParams.subscribe(params => {
      if (params == undefined || params == null ||
        params.id == undefined || params.id == null || params.id == '') {
        const navigationExtras: NavigationExtras = {
        };
        this.router.navigate(['/home/grammar_tool/grammarlist'], navigationExtras);
        return;
      }
      this.testEditService.requestGetGrammar(params.id).subscribe(res => {
        if (res.status === 'OK') {
          this.grammar = res.response;
          this.grammarTitle = this.grammar.grammarName;
          this.testEditService.setCurrentGrammar(this.grammar);
          // this.initFroalaEditor();
          // this.initOptions();
          // if(this.grammar.state === GrammarStatus.NEW) {
          //   this.openDialogEditTest();
          // }
        } else {
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    });
  }

  showDialogForHyperlink(selectedText, replaceLink: { replace: boolean, currentNode: Node }, cursorPointElement: Node) {
    const sel = this.editor.editor.selection.save();
    const dialogRef = this.dialog.open(DialogHyperlinkComponent, { disableClose: true, data: selectedText });
    dialogRef.afterClosed()
      .subscribe(res => {
	if(sel != undefined && sel != null)
        	this.editor.editor.jodit.selection.restore(sel);
	if (res.status === 'OK') {
          const uuid = res.uuid;
          const name = res.name;
          if (replaceLink.replace) {
            this.editor.editor.selection.removeNode(replaceLink.currentNode);
            this.editor.editor.selection.insertHTML('<a href="javascript:void(0)" data="' + uuid + '" >' + name + '</a>');
          } else {
            /*if (cursorPointElement !== null) {
              this.editor.editor.selection.setCursorIn(cursorPointElement, true);
              this.editor.editor.selection.insertHTML('<a href="javascript:void(0)" data="' + uuid + '" >' + name + '</a>');
            } else {*/
              this.editor.editor.selection.insertHTML('<a href="javascript:void(0)" data="' + uuid + '" >' + name + '</a>');
            /*}*/
          }
        }
      });
  }

  initOptions() {
    this.options = [];
    for (const i in this.grammar.options) {
      let str = '';
      if (this.grammar.options[i] === 'true') {
        if (i === 'suspendable') {
          str = 'Test can be suspended ';
        } else if (i === 'partial') {
          str = 'Test can record partial results';
        } else if (i === 'randomized') {
          str = 'Test have randomized questions';
        } else if (i === 'changeable') {
          str = 'User can change already answered questions';
        } else if (i === 'public') {
          str = 'The test is public';
        } else {
          str = '';
        }
        this.options.push(str);
      }
    }
  }

  showGrammarConfig() {
    this.grammarPart = null;
    this.grammarTitle = this.grammar.grammarName;
  }

  editGrammarPart(grammar) {
    const uuid = grammar.uuid;
    this.grammarPart = new GrammarPart();
    this.isLoading = true;
    this.route.queryParams.subscribe(grammar => {
      this.testEditService.requestGetGrammarPart(uuid).subscribe(res => {
        if (res.status === 'OK') {
          this.grammarPart = res.response;
          this.grammarTitle = this.grammarPart.name;
          if (!this.grammarPart.html) {
            this.html = '';
          } else {
            this.html = this.grammarPart.html;
          }
          // $Spelling.SpellCheckAsYouType('text');
        } else {
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
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


  /* loadMedia(type: string) {
    this.mediaLoading = true;
    this.medias = [];
    if (this.allMedias[type] != undefined && this.allMedias[type] != null) {
      this.mediaLoading = false;
      return;
    }

    this.mediaService.getMedia(type).subscribe(res => {
      if (res.status === 'OK') {
        this.allMedias[type] = res.response;
      } else {
        console.log('Server error');
        this.processStatusError(res.errors);
      }
      this.mediaLoading = false;
    });
  } */

  getPageIndex(tab, reset = false, lastPage = false) {
    let index: number = 0;
    if (reset) {
      return 1;
    }
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
      case 'ELAN':
        if (lastPage) {
          this.mediaElanPageIndex = 0;
          break;
        }
        index = ++this.mediaElanPageIndex;
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
          } else if (this.selectedTab === 'ELAN') {
            this.loadMoreElan = true;
            this.mediaElanPageIndex = pageIndex;
          }
        } else {
          if (this.selectedTab === 'PHOTO') {
            this.loadMorePhoto = false;
          } else if (this.selectedTab === 'VIDEO') {
            this.loadMoreVideo = false;
          } else if (this.selectedTab === 'AUDIO') {
            this.loadMoreAudio = false;
          } else if (this.selectedTab === 'ELAN') {
            this.loadMoreElan = false;
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

  loadMedia(type) {
    this.mediaLoading = true;
    this.medias = [];
    const length = 24;
    const pageIndex = this.getPageIndex(type);
    if (this.allMedias[type] == undefined && this.allMedias[type] == null) {
      this.allMedias[type] = [];
    }
    let bool = false;
    if (Object.keys(this.urlObj).length === 0 && this.urlObj.constructor === Object) {
      bool = false;
    } else if (this.urlObj[this.selectedTab][this.folderIndexes[this.selectedTab]].includes('parentId')) {
      bool = true;
    }

    const promise = new Promise((resolve, reject) => {

      this.mediaService.filterMedia(type, null, null, null, pageIndex, length, this.folderMediaId, bool).subscribe(res => {
        if (res.status === 'OK') {
          for (const item of res.response) {
            this.allMedias[type].push(item);

          }
          if (res.response.length < length) {
            this.getPageIndex(type, false, true);
          }

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

  loadMedias() {
    const promise = new Promise((resolve, reject) => {
      this.loadMedia('PHOTO');
      this.loadMedia('VIDEO');
      this.loadMedia('AUDIO');
      this.loadMedia('ELAN');
      this.selectedTab = 'PHOTO';
      resolve();
    });
    return promise;
  }

  // initFroalaEditor(){
  //   jQuery.FroalaEditor.DefineIcon('div smallcaps', {NAME: 'text-width'});
  //     jQuery.FroalaEditor.RegisterCommand('div smallcaps', {
  //       title: 'Small-caps',
  //       focus: true,
  //       undo: false,
  //       refreshAfterCallback: true,
  //       showOnMobile: true,
  //       callback: function (cmd, val, params) {
  //         if (isActiveSmallCaps.apply(this,[cmd])){
  //           this.paragraphFormat.apply('N');
  //         }
  //         else {
  //           this.paragraphFormat.apply('div class="smallcaps"');
  //         }
  //       },
  //       refresh: function ($btn) {
  //         $btn.toggleClass('fr-active', isActiveSmallCaps.apply(this));
  //       }
  //     });
  //     var isActiveSmallCaps = function (cmd) {
  //       var blocks = this.selection.blocks();
  //       return blocks[0].nodeName == 'DIV' && blocks[0].className=='smallcaps';
  //     }

  //     var isActive = function (cmd) {
  //       var blocks = this.selection.blocks();
  //       return blocks[0].nodeName == 'DIV' && blocks[0].className=='overline';
  //     }
  //     jQuery.FroalaEditor.DefineIcon('div overline', {NAME: '<strong>O</strong>', template: 'text'});
  //     jQuery.FroalaEditor.RegisterCommand('div overline', {
  //       title: 'Overline',
  //       callback: function (cmd, val, params) {
  //         if (isActive.apply(this,[cmd])){
  //           this.paragraphFormat.apply('N');
  //         }
  //         else {
  //           this.paragraphFormat.apply('div class="overline"');
  //         }
  //       },
  //       refresh: function ($btn) {
  //         $btn.toggleClass('fr-active', isActive.apply(this));
  //       }
  //     });

  //       // Define popup template.
  //       jQuery.extend(jQuery.FroalaEditor.POPUP_TEMPLATES, {
  //         "customPlugin.popup": '[_CUSTOM_LAYER_]'
  //       });

  //       // Define popup buttons.
  //       jQuery.extend(jQuery.FroalaEditor.DEFAULTS, {
  //         popupButtons: [],
  //       });

  //       var parts = this.grammar.parts;
  //       // The custom popup is defined inside a plugin (new or existing).
  //       jQuery.FroalaEditor.PLUGINS.customPlugin = function (editor) {
  //         // Create custom popup.
  //         function initPopup () {
  //           // Popup buttons.
  //           var popup_buttons = '';

  //           // Create the list of buttons.
  //           if (editor.opts.popupButtons.length > 1) {
  //             popup_buttons += '<div class="fr-buttons">';
  //             popup_buttons += editor.button.buildList(editor.opts.popupButtons);
  //             popup_buttons += '</div>';
  //           }

  //           var html = '';
  //           parts.forEach(function(part){
  //             html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+part.uuid+part.name+'">'+part.name+'</a></div>';
  //             part.parts.forEach((paragraph)=>{
  //               html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+paragraph.uuid+','+paragraph.name+'">'+paragraph.name+'</a></div>';
  //               paragraph.parts.forEach((subparagraph)=>{
  //                 html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+subparagraph.uuid+','+subparagraph.name+'">'+subparagraph.name+'</a></div>';
  //                 subparagraph.parts.forEach((subparagraph_i)=>{
  //                   html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+subparagraph_i.uuid+','+subparagraph_i.name+'">'+subparagraph_i.name+'</a></div>';
  //                   subparagraph_i.parts.forEach((subparagraph_ii)=>{
  //                     html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+subparagraph_ii.uuid+','+subparagraph_ii.name+'">'+subparagraph_ii.name+'</a></div>';
  //                     subparagraph_ii.parts.forEach((subparagraph_iii)=>{
  //                       html += '<div><a href="javascript:void(0);" class="insertGrammarPart" id="'+subparagraph_iii.uuid+','+subparagraph_iii.name+'">'+subparagraph_iii.name+'</a></div>';
  //                     });
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //           // Load popup template.
  //           var template = {
  //             buttons: popup_buttons,
  //             custom_layer: html
  //           };

  //           // Create popup.
  //           var $popup = editor.popups.create('customPlugin.popup', template);

  //           return $popup;
  //         }

  //         // Show the popup
  //         function showPopup () {
  //           // Get the popup object defined above.
  //           var $popup = editor.popups.get('customPlugin.popup');

  //           // If popup doesn't exist then create it.
  //           // To improve performance it is best to create the popup when it is first needed
  //           // and not when the editor is initialized.
  //           if (!$popup) $popup = initPopup();

  //           // Set the editor toolbar as the popup's container.
  //           editor.popups.setContainer('customPlugin.popup', editor.$tb);

  //           // This will trigger the refresh event assigned to the popup.
  //           // editor.popups.refresh('customPlugin.popup');

  //           // This custom popup is opened by pressing a button from the editor's toolbar.
  //           // Get the button's object in order to place the popup relative to it.
  //           var $btn = editor.$tb.find('.fr-command[data-cmd="myButton"]');

  //           // Set the popup's position.
  //           var left = ($btn.offset().left + $btn.outerWidth() / 2) + 10 ;
  //           var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

  //           // Show the custom popup.
  //           // The button's outerHeight is required in case the popup needs to be displayed above it.
  //           editor.popups.show('customPlugin.popup', left, top, $btn.outerHeight());
  //         }

  //         // Hide the custom popup.
  //         function hidePopup () {
  //           editor.popups.hide('customPlugin.popup');
  //         }

  //         // Methods visible outside the plugin.
  //         return {
  //           showPopup: showPopup,
  //           hidePopup: hidePopup
  //         }
  //       }

  //       // Define an icon and command for the button that opens the custom popup.
  //       jQuery.FroalaEditor.DefineIcon('buttonIcon', { NAME: 'link'})
  //       jQuery.FroalaEditor.RegisterCommand('myButton', {
  //         title: 'Add Grammar Link',
  //         icon: 'buttonIcon',
  //         undo: false,
  //         focus: false,
  //         plugin: 'customPlugin',
  //         callback: function () {
  //           this.customPlugin.showPopup();
  //         }
  //       });

  //     this.froalaoptions= {
  //       heightMax: 500,
  //       typingTimer: 550,
  //       toolbarButtons:['div smallcaps','bold', 'italic', 'underline','div overline',
  //                       'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize',
  //                       'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL','|',
  //                       'outdent', 'indent','insertLink','myButton','embedly', /* 'insertFile', */ 'insertTable',
  //                       '|', /* 'emoticons', */ 'specialCharacters', 'insertHR', 'clearFormatting', '|',
  //                       'spellChecker', '|', 'undo', 'redo'],
  //       fontFamily: {
  //         'Arial': 'Default',
  //         'handshape2002': 'HandShape'
  //       },
  //       // pluginsEnabled: ['customPlugin'],
  //       inlineMode: false,
  //       videoAllowedAttributes: ["src", "width", "height", "controls", "poster", "source", "type", "style", "class"],
  //       events : {
  //         'froalaEditor.contentChanged' : (e,Editor) => {
  //             this.editorUpdate(Editor.el.innerHTML);
  //         },
  //         'froalaEditor.initialized' : (e,Editor) => {
  //           var ruler = '<div class="ruler corner"></div><div class="ruler hRule"></div><div class="ruler vRule"></div>';
  //           jQuery('.fr-wrapper').prepend(ruler);
  //           var $hRule = jQuery('.hRule');
  //           var $vRule = jQuery('.vRule');
  //           $hRule.empty();
  //           $vRule.empty().height(0).outerHeight($vRule.parent().outerHeight());

  //           // Horizontal ruler ticks
  //           var tickLabelPos = 18;
  //           var newTickLabel = "";
  //           while ( tickLabelPos <= $hRule.width() ) {
  //             if ((( tickLabelPos - 18 ) %50 ) == 0 ) {
  //               newTickLabel = "<div class='tickLabel'>" + ( tickLabelPos - 18 ) + "</div>";
  //               jQuery(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
  //             } else if ((( tickLabelPos - 18 ) %10 ) == 0 ) {
  //               newTickLabel = "<div class='tickMajor'></div>";
  //               jQuery(newTickLabel).css("left",tickLabelPos+"px").appendTo($hRule);
  //             } else if ((( tickLabelPos - 18 ) %5 ) == 0 ) {
  //               newTickLabel = "<div class='tickMinor'></div>";
  //               jQuery(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
  //             }
  //             tickLabelPos = (tickLabelPos + 5);
  //           }//hz ticks

  //           // Vertical ruler ticks
  //           tickLabelPos = 18;
  //           newTickLabel = "";
  //           while (tickLabelPos <= $vRule.height()) {
  //             if ((( tickLabelPos - 18 ) %50 ) == 0) {
  //               newTickLabel = "<div class='tickLabel'><span>" + ( tickLabelPos - 18 ) + "</span></div>";
  //               jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //             } else if (((tickLabelPos - 18)%10) == 0) {
  //               newTickLabel = "<div class='tickMajor'></div>";
  //               jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //             } else if (((tickLabelPos - 18)%5) == 0) {
  //               newTickLabel = "<div class='tickMinor'></div>";
  //               jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //             }
  //             tickLabelPos = ( tickLabelPos + 5 );
  //           }//vert ticks

  //           jQuery('body').on('click','.insertGrammarPart', (event)=> {
  //               var uuid = event.target.id.split(',')[0];
  //               var name = event.target.id.split(',')[1];
  //               console.log(this.url+'/home/grammar_tool/grammarview?id='+uuid+'&preview=false');
  //               console.log(name);
  //               jQuery('#text').froalaEditor('html.insert', '<a href="'+this.url+'/#/home/grammar_tool/grammarview?id='+this.grammar.uuid+'&preview=false&link='+uuid+'" target="_blank">'+name+'</a>');
  //               jQuery('#text').froalaEditor('popups.hideAll', []);
  //           });


  //          }
  //       }
  //     }

  //     //resize
  //   jQuery(window).resize(function(e){
  //     var $hRule = jQuery('.hRule');
  //     var $vRule = jQuery('.vRule');
  //     $hRule.empty();
  //     $vRule.empty().height(0).outerHeight($vRule.parent().outerHeight());

  //     // Horizontal ruler ticks
  //     var tickLabelPos = 18;
  //     var newTickLabel = "";
  //     while ( tickLabelPos <= $hRule.width() ) {
  //       if ((( tickLabelPos - 18 ) %50 ) == 0 ) {
  //         newTickLabel = "<div class='tickLabel'>" + ( tickLabelPos - 18 ) + "</div>";
  //         jQuery(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
  //       } else if ((( tickLabelPos - 18 ) %10 ) == 0 ) {
  //         newTickLabel = "<div class='tickMajor'></div>";
  //         jQuery(newTickLabel).css("left",tickLabelPos+"px").appendTo($hRule);
  //       } else if ((( tickLabelPos - 18 ) %5 ) == 0 ) {
  //         newTickLabel = "<div class='tickMinor'></div>";
  //         jQuery(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
  //       }
  //       tickLabelPos = (tickLabelPos + 5);
  //     }//hz ticks

  //     // Vertical ruler ticks
  //     tickLabelPos = 18;
  //     newTickLabel = "";
  //     while (tickLabelPos <= $vRule.height()) {
  //       if ((( tickLabelPos - 18 ) %50 ) == 0) {
  //         newTickLabel = "<div class='tickLabel'><span>" + ( tickLabelPos - 18 ) + "</span></div>";
  //         jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //       } else if (((tickLabelPos - 18)%10) == 0) {
  //         newTickLabel = "<div class='tickMajor'></div>";
  //         jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //       } else if (((tickLabelPos - 18)%5) == 0) {
  //         newTickLabel = "<div class='tickMinor'></div>";
  //         jQuery(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
  //       }
  //       tickLabelPos = ( tickLabelPos + 5 );
  //     }//vert ticks
  //   });//resize

  // }

  insertImg(image_url: string, event, mediaUuid) {

    let url: string = '';
    if (image_url) {
      url = image_url;
    } else {
      url = '/assets/img/thumbnail.png';
    }

    this.editor.editor.selection.insertImage(this.url + "/retrievePublic?mediaUuid=" + mediaUuid, null, null);

    /*this.testEditService.requestDownloadFile(url.replace('/', '')).subscribe(res => {
      const image = new Blob([res.arrayBuffer()], { type: 'image/png' });
      const reader = new (<any>window).FileReader();
      reader.readAsDataURL(image);
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {

        console.log(this.editor)
        this.editor.editor.selection.insertImage(myReader.result);
        // jQuery('#text').froalaEditor('html.insert', '<img width="'+event.target.clientWidth+'" height="'+event.target.clientHeight+'" src="'+myReader.result+'" />');

      };
      myReader.readAsDataURL(image);

    });*/
  }

  insertVid(video_url: string, event) {

    let url: string = '';

    if (video_url) {
      url = video_url;
    } else {
      url = '/assets/img/thumbnail.png';
    }
    // tslint:disable-next-line:max-line-length
    this.editor.editor.selection.insertHTML('<video class="fr-draggable fr-fvc fr-dvi" controls src="' + this.url + '/retrievePublic?code=' + url + '" style="width:600px">Your browser does not support HTML5 video.</video>');

  }

  insertFile(file, event) {
    // tslint:disable-next-line:max-line-length
    jQuery('#text').froalaEditor('html.insert', '<a download="' + file.mediaName + '"  href="' + this.url + '/retrievePublic?code=' + file.publicUrl + '">' + file.mediaName + '</a>');
  }

  editQuestion(obj) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: obj.questionId
      }
    };
    this.router.navigate(['/home/grammar_tool/section'], navigationExtras);
  }

  editorUpdate(html) {
    if (this.timeoutID)
      window.clearTimeout(this.timeoutID);
    this.timeoutID = window.setTimeout(() => {
      this.isLoading = true;
      const old_html = this.grammarPart.html;
      this.grammarPart.html = this.cleanMarked(html);
      this.testEditService.requestUpdateGrammarPart(this.grammarPart.uuid, this.grammarPart).subscribe(res => {
        if (res.status === 'OK') {
          this.openSnackBar('Updated');
        } else {
          if (!this.grammarPart.html) {
            this.html = '';
          } else {

            this.grammarPart.html = old_html;
            this.html = old_html;

          }
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
      this.editor.onChange(this.cleanMarked(html), (html) => {
        this.html = html;
      });
    }, 2000);
  }

  cleanMarked(html) {
    return html.replace(/<\/?spellcheckmark+>/ig, "");
  }

  editSettings() {
    const obj: any = {};
    if (!this.grammarPart) {
      obj.grammar = this.grammar;
    } else {
      obj.grammar = this.grammarPart;
    }
    const dialogRef = this.dialog.open(ConfigGrammarComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  changeStatus(event, type) {
    if (type == 'grammar') {
      if (event.checked) {
        this.grammar.status = 'PUBLISHED';
      } else {
        this.grammar.status = 'DRAFT';
      }
      this.updateGrammar();
    } else {
      if (event.checked) {
        this.grammarPart.status = 'PUBLISHED';
      } else {
        this.grammarPart.status = 'DRAFT';
      }
      this.updateGrammarPart();
    }
    console.log(event.checked);
    console.log(type);
  }

  updateGrammarName() {
    this.grammar.grammarName = this.grammarTitle;
    /*grammarSignHubSeries
    grammarSignHubSeriesNumber
    grammarOtherSignHubSeries
    grammarEditorialInfo
    grammarCopyrightInfo
    grammarISBNInfo
    grammarBibliographicalReference*/

    this.updateGrammar();
  }

  updateGrammarPart() {
    this.isLoading = true;
    this.testEditService.requestUpdateGrammarPart(this.grammarPart.uuid, this.grammarPart).subscribe(res => {
      if (res.status === 'OK') {
        this.openSnackBar('Successfully Updated');

      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  updateGrammar() {
    this.isLoading = true;
    this.testEditService.requestUpdateGrammar(this.grammar.uuid, this.grammar).subscribe(res => {
      if (res.status === 'OK') {
        this.openSnackBar('Successfully Updated');
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  setListView() {
    this.listView = true;
    this.gridView = false;
  }

  setGridView() {
    this.listView = false;
    this.gridView = true;
  }

  canEdit(grammarPart) {
    // tslint:disable-next-line:curly
    if (
      grammarPart.editors.indexOf(this.user.userId) !== -1
      || grammarPart.contentProviders.indexOf(this.user.userId) === -1
      || this.user.role === 'ADMIN'
      || this.user.role === 'AT_ADMIN'
    )
      return true;
    return false;
  }

  hasChild(c) {
    if (c.parts.length > 0) {
      return true;
    }
  }
  rotate(event) {
    const target: any = event.target;
    if (target.parentNode.classList.contains('active')) {
      if (target.textContent === 'keyboard_arrow_down') {
        target.textContent = 'keyboard_arrow_right';
        target.parentNode.classList.remove('active');
      }
    } else {
      target.parentNode.classList.add('active');
      target.textContent = 'keyboard_arrow_down';
    }
  }

}
