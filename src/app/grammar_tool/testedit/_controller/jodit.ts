import { ActivatedRoute } from '@angular/router';
import {
  Component,
  Provider,
  OnDestroy,
  AfterViewInit,
  Input,
  forwardRef,
  NgZone
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Http } from '@angular/http';
import { TestEditService } from '../_services/testEdit.service';

/**
 * The result of file reading
 * @interface FileResult
 */
declare interface FileResult {
  words: Set<string>
  size: number
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleJoditComponent),
  multi: true
};

declare var jQuery: any;


@Component({
  selector: 'simplejodit',
  template: `<textarea id="{{elementId}}" ></textarea>`,
  styleUrls: ['../_views/jodit.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SimpleJoditComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() elementId: String;

  editor;

  private _value = '';
  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};
  private spellLoaded: boolean;
  private BUFFER = {
    WORDS: new Set<string>(),
    SIZE: 0,
  }


  private editorOptions = {
    spellcheck: false,
    enableDragAndDropFileToEditor: true,
    uploader: {
      url: '/api/rest/grammar/media',
      format: 'json',
      headers: {
        'authtoken': `${localStorage.getItem('token')}`
      },
      pathVariableName: 'path',
      filesVariableName: function (t) { return 'files[' + t + ']'; },
      prepareData: function (data) {
        return data;
      },
      isSuccess: function (resp) {
        return resp.status == 'OK';
      },
      getMsg: function (resp) {
        //return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
        return 'uploaded!';
      },
      process: function (resp) {
        var files = [];
        if (resp.response != undefined && resp.response != null) {
          if (Array.isArray(resp.response)) {
            for (var i = 0; i < resp.response.length; i++) {
              files.push(resp.response[i].mediaId);
            }
          } else {
            files.push(resp.response.mediaId);
          }
        }
        return {
          files: files,
          path: resp.response.mediaPath,
          baseurl: window.location.origin,
          error: resp.errors,
          msg: resp.status,
          status: resp.status
        };
      },
      error: function (e) {
        this.events.fire('errorPopap', [e.getMessage(), 'error', 4000]);
      },
      defaultHandlerSuccess: function (data: any, resp) {
        if (data['files'] && data['files'].length > 0) {
          for (var i = 0; i < data['files'].length; i++) {
            this.jodit.selection.insertImage(data.baseurl + "/api/rest/retrievePublic?mediaUuid=" + data['files'][i], null, null);
            /*this.jodit.testEditService.requestDownloadFile(data[field][i].replace('/', '')).subscribe(res => {
              const image = new Blob([res.arrayBuffer()], { type: 'image/png' });
              const reader = new (<any>window).FileReader();
              reader.readAsDataURL(image);
              const myReader: FileReader = new FileReader();
              myReader.onloadend = (e) => {
                this.jodit.selection.insertImage(myReader.result);
                // jQuery('#text').froalaEditor('html.insert', '<img width="'+event.target.clientWidth+'" height="'+event.target.clientHeight+'" src="'+myReader.result+'" />');
              };
              myReader.readAsDataURL(image);

            });*/
          }
        }
      },
      defaultHandlerError: function (resp) {
        this.events.fire('errorPopap', [this.options.uploader.getMsg(resp)]);
      }
    },
    height: window.innerHeight - 250,
    beautyHTML: false,
    codeMirror: false,
    cleanHTML: {
      replaceNBSP: false
    },
    cleanWhitespace: false,
    dialog: {
      resizable: false,
      draggable: false
    },
    popup: {
      a: [
        {
          name: 'eye',
          tooltip: 'Open link',
          exec: function (editor, currentNode) {
            const uuid = currentNode.getAttribute('data');
            editor.testEditService.uuidLink.emit(uuid);
          }
        },
        {
          name: 'link',
          tooltip: 'Edit link',
          icon: 'pencil',
          exec: function (editor, currentNode) {
            const selectedText = editor.selection.sel.anchorNode.data;
            editor.testEditService.showDialogForHyperlink(selectedText, { replace: true, currentNode: currentNode });
          }
        },
        'unlink',
        'brush',
        'file'
      ]
    },
    buttons: [
      'bold',
      'strikethrough',
      'underline',
      'italic',
      {
        name: 'smallcaps',
        tooltip: 'small caps',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-variant': 'small-caps'
          });
        }

      },
      {
        name: 'overline',
        tooltip: 'overline',
        exec: function (editor) {
          editor.selection.applyCSS({
            'text-decoration': 'overline'
          });
        }
      },
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      {
        name: 'handshape',
        tooltip: 'handshape',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-family': 'handshape2002'
          });
        }
      },
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'table',
      'link',
      'image',
      '|',
      'align',
      'undo',
      'redo',
      '\n',
      'cut',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'symbol',
      'fullsize',
      'selectall',
      'print',
      '|',
      {
        name: 'spellcheck',
        tooltip: 'Spell check',
        exec: (editor) => {
          this.makingSpellcheck(this.cleanMarked(editor.jodit.value), (html) => {
            editor.jodit.value = html;
          });
        }
      },
      {
        name: 'hyperlink',
        tooltip: 'Hyperlink',
        exec: (editor) => {
          const selectedText = editor.jodit.selection.sel.toString();
          let cursorPointElement = null; // p before br
          if (selectedText === '') {
            cursorPointElement = editor.jodit.selection.current().parentNode;
          }
          this.testEditService.showDialogForHyperlink(selectedText, { replace: false, currentNode: null }, cursorPointElement);
        }
      }
    ],
    buttonsMD: [
      'bold',
      'strikethrough',
      'underline',
      'italic',
      {
        name: 'smallcaps',
        tooltip: 'small caps',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-variant': 'small-caps'
          });
        }

      },
      {
        name: 'overline',
        tooltip: 'overline',
        exec: function (editor) {
          editor.selection.applyCSS({
            'text-decoration': 'overline'
          });
        }
      },
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      {
        name: 'handshape',
        tooltip: 'handshape',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-family': 'handshape2002'
          });
        }
      },
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'table',
      'link',
      'image',
      '|',
      'align',
      'undo',
      'redo',
      '\n',
      'cut',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'symbol',
      'fullsize',
      'selectall',
      'print',
      '|',
      {
        name: 'spellcheck',
        tooltip: 'Spell check',
        exec: (editor) => {
          this.makingSpellcheck(this.cleanMarked(editor.jodit.value), (html) => {
            editor.jodit.value = html;
          });
        }
      },
      {
        name: 'hyperlink',
        tooltip: 'Hyperlink',
        exec: (editor) => {
          const selectedText = editor.jodit.selection.sel.toString();
          let cursorPointElement = null; // p before br
          if (selectedText === '') {
            cursorPointElement = editor.jodit.selection.current().parentNode;
          }
          this.testEditService.showDialogForHyperlink(selectedText, { replace: false, currentNode: null }, cursorPointElement);
        }
      }
    ],
    buttonsSM: [
      'bold',
      'strikethrough',
      'underline',
      'italic',
      {
        name: 'smallcaps',
        tooltip: 'small caps',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-variant': 'small-caps'
          });
        }

      },
      {
        name: 'overline',
        tooltip: 'overline',
        exec: function (editor) {
          editor.selection.applyCSS({
            'text-decoration': 'overline'
          });
        }
      },
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      {
        name: 'handshape',
        tooltip: 'handshape',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-family': 'handshape2002'
          });
        }
      },
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'table',
      'link',
      'image',
      '|',
      'align',
      'undo',
      'redo',
      '\n',
      'cut',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'symbol',
      'fullsize',
      'selectall',
      'print',
      '|',
      {
        name: 'spellcheck',
        tooltip: 'Spell check',
        exec: (editor) => {
          this.makingSpellcheck(this.cleanMarked(editor.jodit.value), (html) => {
            editor.jodit.value = html;
          });
        }
      },
      {
        name: 'hyperlink',
        tooltip: 'Hyperlink',
        exec: (editor) => {
          const selectedText = editor.jodit.selection.sel.toString();
          let cursorPointElement = null; // p before br
          if (selectedText === '') {
            cursorPointElement = editor.jodit.selection.current().parentNode;
          }
          this.testEditService.showDialogForHyperlink(selectedText, { replace: false, currentNode: null }, cursorPointElement);
        }
      }
    ],
    buttonsXS: [
      'bold',
      'strikethrough',
      'underline',
      'italic',
      {
        name: 'smallcaps',
        tooltip: 'small caps',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-variant': 'small-caps'
          });
        }

      },
      {
        name: 'overline',
        tooltip: 'overline',
        exec: function (editor) {
          editor.selection.applyCSS({
            'text-decoration': 'overline'
          });
        }
      },
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      {
        name: 'handshape',
        tooltip: 'handshape',
        exec: function (editor) {
          editor.selection.applyCSS({
            'font-family': 'handshape2002'
          });
        }
      },
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'table',
      'link',
      'image',
      '|',
      'align',
      'undo',
      'redo',
      '\n',
      'cut',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'symbol',
      'fullsize',
      'selectall',
      'print',
      '|',
      {
        name: 'spellcheck',
        tooltip: 'Spell check',
        exec: (editor) => {
          this.makingSpellcheck(this.cleanMarked(editor.jodit.value), (html) => {
            editor.jodit.value = html;
          });
        }
      },
      {
        name: 'hyperlink',
        tooltip: 'Hyperlink',
        exec: (editor) => {
          const selectedText = editor.jodit.selection.sel.toString();
          let cursorPointElement = null; // p before br
          if (selectedText === '') {
            cursorPointElement = editor.jodit.selection.current().parentNode;
          }
          this.testEditService.showDialogForHyperlink(selectedText, { replace: false, currentNode: null }, cursorPointElement);
        }
      }
    ],
    events: {
      getIcon: function (name, control, clearName) {
        let code = clearName;

        switch (clearName) {
          case 'redo':
            code = 'rotate-right';
            break;
          case 'video':
            code = 'video-camera';
            break;
          case 'copyformat':
            code = 'clone';
            break;
          case 'about':
            code = 'question';
            break;
          case 'selectall':
            code = 'bolt';
            break;
          case 'symbol':
            return '<span style="text-align: center;font-size:14px;">Ω</span>';
          case 'hr':
            code = 'minus';
            break;
          case 'left':
          case 'right':
          case 'justify':
          case 'center':
            code = 'align-' + name;
            break;
          case 'brush':
            code = 'tint';
            break;
          case 'fontsize':
            code = 'text-height';
            break;
          case 'ul':
          case 'ol':
            code = 'list-' + name;
            break;
          case 'source':
            code = 'code';
            break;
          case 'valign':
            code = 'align-justify';
            break;
          case 'splitv':
            code = 'columns';
            break;
          case 'align':
            code = 'align-justify';
            break;
          case 'merge':
            code = 'compress';
            break;
          case 'handshape':
            code = 'sign-language';
            break;
          case 'addcolumn':
            code = 'columns';
            break;
          case 'addrow':
            code = 'align-justify';
            break;
          case 'bin':
            code = 'trash';
            break;
          case 'smallcaps':
            code = 'text-width';
            break;
          case 'overline':
            code = 'circle';
            break;
          case 'spellcheck':
            code = 'check-circle-o';
            break;
          case 'hyperlink':
            code = 'link';
            break;

        }
        return '<i style="font-size:14px" class="fa fa-' + code + ' fa-xs"></i>';
      }
    }
  };

  constructor(private http: Http,
    private testEditService: TestEditService,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
  }

  get value(): any {
    if (this.editor) {
      return this.editor.getEditorValue();
    } else {
      return null;
    }
  }
  set value(v: any) {
    if (this.editor) {
      this.editor.setEditorValue(v || '');
    }
  }

  async ngAfterViewInit() {
    console.log(window.innerHeight)
    this.spellLoaded = false;
    this.loadDictionary().then((bufferSize) => {
      this.spellLoaded = true;
      console.log('dictionary loaded size:' + bufferSize);
    })
      .catch(err => { console.log('errore nel caricamento del dizionario', err) });
    //this.editor = await new Jodit('#' + this.elementId, this.editorOptions);
    this.ngZone.runOutsideAngular(() => {
      this.editor = new Jodit('#' + this.elementId, this.editorOptions);
    });
    this.editor.testEditService = this.testEditService;
    //this.editor.events.on("changeElementValue", (data) => {this.onChange(data)});
  }

  ngOnDestroy() {
    this.editor.destruct();
  }

  onChange(html: any, callback) {
    setTimeout(() => {
      //this.makingSpellcheck(html, callback);
    }, 750);
    this.onChangeCallback(html);
  }

  cleanMarked(html) {
    return html.replace(/<\/?spellcheckmark+>/ig, "");
  }

  /* treeView(childNode, previousNode, count) {
    if (childNode.parts.length > 0) {
      count++;
      childNode.parts.forEach(element => {
        if (element.type === "ARTICLE") {
          let li = document.createElement('li');
          li.textContent = element.name;
          previousNode.appendChild(li);
        } else {
          let ul = document.createElement('ul');
          ul.classList.add('level_' + count);
          let li = document.createElement('li');
          li.textContent = element.name;
          ul.appendChild(li);
          previousNode.appendChild(ul);
          this.treeView(element, ul, count);
        }
      });
    }
  } */

  makingSpellcheck(html: any, callback) {
    let ret = this.spellCheck(html);
    console.log('spell check result');
    console.log(ret);
    if (ret != undefined && ret != null) {
      for (let i = 0; i < ret.length; i++) {
        const word = ret[i];
        //html.replace(, )
        try {
          let newhtml = this.markWord(html, word);
          html = newhtml;
        } catch (ex) {
          console.log(ex);
        }
      }
    }
    callback(html);
  }

  markWord(html, word) {
    if (word == undefined || word == null)
      return html;
    html = '<div>' + html + '</div>';
    let newHtml = jQuery(html);
    newHtml.find('*:contains("' + word + '")')
      .not(':has(:contains("' + word + '"))')
      .contents().each(function () {
        // nodeType for text nodes is 3
        if (this.nodeType === 3 && this.textContent.includes(word)) {
          var html = this.textContent.replace(word, "<spellcheckmark>" + word + "</spellcheckmark>")
          // replace text node with html
          jQuery(this).replaceWith(html)
        }
      })
    return newHtml.html();
  }

  writeValue(v: any): void {
    this.value = v;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // TODO: see if Jodit has built is disabled state
  }

  loadDictionary() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/dictionary/english.txt').toPromise().then(data => {
        const resp: FileResult = this.getWordsList(data.text(), this.BUFFER.WORDS);
        this.BUFFER.WORDS = resp.words
        this.BUFFER.SIZE += resp.size
        resolve(this.BUFFER.SIZE);
      });
    })
  }

  getWordsList(
    fileBuff: string,
    words: Set<string>
  ): FileResult {
    const list: string[] = fileBuff.split('\n')
    let len: number = list.length
    // Remove last item if is empty
    if (list[len - 1] === '') {
      len--
    }

    // Add to collection
    let i = 0
    while (i < len) {
      words.add(list[i])
      i++
    }

    // Remove empty element
    words.delete('')

    return {
      words,
      size: len
    }
  }

  spellCheck(value) {
    if (!this.spellLoaded)
      return;
    if (this.BUFFER.SIZE === 0) {
      console.error('ERROR! Dictionaries are not loaded')
      return
    }
    /*let arr = value.split(" ");
    for(let idx; idx<arr.length; idx++) {
      console.log(arr[idx] + " " + '');
    }*/
    //const regex = XRegExp('[^\\p{N}\\p{L}-_]', 'g')
    const tocheck = value.replace(/<\/?[^>]+>/ig, " ");
    const regex = /[^\d\w\-_\s]/g;
    const textArr = tocheck
      .replace(regex, ' ')
      .split(' ')
      .filter(item => item)

    const outObj = {}

    for (let i = 0; i < textArr.length; i++) {
      const checked = this.checkWord(textArr[i])
      const checkedList = Array.isArray(checked)
        ? checked
        : [checked]

      for (let j = 0; j < checkedList.length; j++) {
        if (checkedList[j] == null) {
          outObj[textArr[i]] = true
        }
      }
    }

    return Object.keys(outObj)
  }

  checkWord(wordProp: string, recblock?: boolean) {
    // Just go away, if the word is not literal
    if (wordProp == null || wordProp === '' || !isNaN(Number(wordProp))) {
      return
    }

    // Way of reducing the load-time of dictionary
    // Post-escaping comments from files
    const word: string = wordProp.replace(/^#/, '')

    // If the word exists, returns true
    if (this.BUFFER.WORDS.has(word)) {
      return true
    }

    // Try to remove the case
    if (this.BUFFER.WORDS.has(word.toLowerCase())) {
      return true
    }

    // Check for the presence of the add. chars
    const esymb = '-/\''

    // Checking parts of words
    for (let i = 0; i < esymb.length; i++) {
      if (recblock || word.indexOf(esymb[i]) === -1) {
        continue;
      }

      const retArray = word
        .split(esymb[i])
        .map((item: string, i: number) => {
          if (i === 0) {
            return this.checkWord(item, true)
          } else {
            const res = this.checkWord(item, true)
            return res || this.checkWord(esymb[i] + item, true)
          }
        });

      return retArray;
    }
  }
}
