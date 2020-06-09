import {
  Component,
  Provider,
  OnDestroy,
  AfterViewInit,
  Input,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MiniJoditComponent),
  multi: true
};

@Component({
  selector: 'mini-jodit',
  template: `<textarea id="{{elementId}}" ></textarea>`,
  styleUrls: ['./jodit.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class MiniJoditComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() elementId: String;

  editor;

  private _value = '';
  private onTouchedCallback: () => {};
  private onChangeCallback: (_: any) => {};

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

  ngAfterViewInit() {
    this.editor = new Jodit('#' + this.elementId, {
      minHeight: 300,
      beautyHTML: false,
      codeMirror: false,
      enableDragAndDropFileToEditor: false,
      cleanHTML: {
        replaceNBSP: false
      },
      cleanWhitespace: false,
      dialog: {
        resizable: false,
        draggable: false
      },
      spellcheck: false,
      buttons: [
        'bold',
        'underline',
        'italic',
        {
          name: 'smallcaps',
          exec: function (editor) {
            editor.selection.applyCSS({
              'font-variant': 'small-caps'
            });
          }

        },
        '|',
        'superscript',
        'subscript',
        'font',
        {
          name: 'handshape',
          exec: function (editor) {
            editor.selection.applyCSS({
              'font-family': 'handshape2002'
            });
          }

        },
        'fontsize',
        'brush'
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
          }

          return '<i style="font-size:14px" class="fa fa-' + code + ' fa-xs"></i>';
        }
      }
    });
  }

  ngOnDestroy() {
    this.editor.destruct();
  }

  onChange(event: any) {
    this.onChangeCallback(event.target.value);
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
}
