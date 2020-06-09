import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { fabric } from 'fabric';
import { Line } from '../_models/line';


declare var jQuery: any;

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/custom-clickarea.component.html',
  styleUrls: ['../_views/custom-clickarea.component.scss', '../../../share/base.scss']
})
export class CustomClickareaComponent extends BaseComponent implements OnInit {

  input: any;
  // canvas: any;
  // colors: Array<string> = ['#42a5f5', '#0066b1'];
  // roof: any = null;
  // roofPoints: Array<fabric.Point> = [];
  // lines: Array<fabric.Line> = [];
  // lineCounter: number = 0;
  // x: number = 0;
  // y: number = 0;
  // points: any;
  // linesArray: Array<Line> = [];
  // pointsArray: Array<fabric.Point> = [];
  // pointArray: Array<number> = []
  // pointsString: string = '';
  // drawingObject = {
  //   type: "",
  //   background: "",
  //   border: ""
  // };

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<CustomClickareaComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
    this.input.name = this.data.groupName;
  }

  ngOnInit(): void {
    // this.canvas = new fabric.Canvas('myCanvas');
  }


  // @HostListener('mousemove', ['$event'])
  // canvasOnMouseMove(options) {
  //   if (this.lines.length != 0 && this.lines[0] != null && this.lines[0] != undefined && this.drawingObject.type == "roof") {
  //     let offset = jQuery('#myCanvas').offset();
  //     var x = options.pageX - offset.left;
  //     var y = options.pageY - offset.top;
  //     this.lines[this.lineCounter - 1].set({
  //       x2: x,
  //       y2: y
  //     });
  //     this.canvas.renderAll();
  //   }
  // }

  // @HostListener('mousedown', ['$event'])
  // canvasOnMouseDown(options) {
  //   if (this.drawingObject.type == "roof") {
  //     this.canvas.selection = false;
  //     let offset = jQuery('#myCanvas').offset();
  //     var x = options.clientX - offset.left;
  //     var y = options.clientY - offset.top;
  //     this.roofPoints.push(new fabric.Point(x, y));
  //     var points = [x, y, x, y];
  //     this.lines.push(new fabric.Line(points, {
  //       strokeWidth: 3,
  //       selectable: false,
  //       stroke: 'red',
  //       left: x,
  //       top: y,
  //     }));
  //     this.canvas.add(this.lines[this.lineCounter]);
  //     this.lineCounter++;
  //   }
  // }

  // @HostListener('mouseup')
  // canvasOnMouseUp() {
  //   if (this.drawingObject.type == "roof") {
  //     this.canvas.selection = true;
  //   }
  // }

  // @HostListener('dblclick', ['$event'])
  // canvasOnDoubleClick() {
  //   if (this.drawingObject.type == "roof") {
  //     this.colors = [this.colors[1], this.colors[0]];
  //   }

  //   this.drawingObject.type = "";
  //   this.lines.map((value: any) => {
  //     this.canvas.remove(value);
  //   });

  //   this.canvas.remove(this.lines[this.lineCounter - 1]);
  //   this.roof = this.makeRoof(this.roofPoints);
  //   this.canvas.add(this.roof);

  //   //clear arrays
  //   this.roofPoints = [];
  //   this.lines = [];
  //   this.lineCounter = 0;
  // }

  // startDrawing() {
  //   this.colors = [this.colors[1], this.colors[0]];
  //   if (this.drawingObject.type == "roof") {
  //     this.drawingObject.type = "";
  //     this.lines.map((value: any) => {
  //       this.canvas.remove(value);
  //     });

  //     this.canvas.remove(this.lines[this.lineCounter]);
  //     this.roof = this.makeRoof(this.roofPoints);
  //     this.canvas.add(this.roof);
  //     this.canvas.renderAll();
  //   } else {
  //     this.drawingObject.type = "roof"; // roof type
  //     this.canvas.remove(this.roof);
  //     this.canvas.renderAll();
  //   }
  // }

  // makeRoof(roofPoints) {
  //   var left = this.findLeftPaddingForRoof(roofPoints);
  //   var top = this.findTopPaddingForRoof(roofPoints);
  //   if (roofPoints[0] == undefined)
  //     roofPoints.push(new fabric.Point(this.x, this.y))
  //   roofPoints.push(new fabric.Point(roofPoints[0].x, roofPoints[0].y))
  //   var roof = new fabric.Polyline(roofPoints, {
  //     fill: 'rgba(0,0,0,0)',
  //     stroke: '#58c'
  //   });

  //   return roof.set({
  //     left: left,
  //     top: top,
  //   });
  // }

  // findTopPaddingForRoof(roofPoints) {
  //   var result = 999999;
  //   for (var f = 0; f < this.lineCounter; f++) {
  //     if (roofPoints[f].y < result) {
  //       result = roofPoints[f].y;
  //     }
  //   }
  //   return Math.abs(result);
  // }

  // findLeftPaddingForRoof(roofPoints) {
  //   var result = 999999;
  //   for (var i = 0; i < this.lineCounter; i++) {
  //     if (roofPoints[i].x < result) {
  //       result = roofPoints[i].x;
  //     }
  //   }
  //   return Math.abs(result);
  // }

  async save() {
    const obj: any = {};
    // let maxX = -99999;
    // let minY = 99999;
    // let maxY = -99999;
    // let minX = 99999;
    // let deltaX = 0;
    // let deltaY = 0;
    // let viewBox = '';
    // if(this.canvas.toJSON()['objects'][0]){
    //   this.pointsArray = this.canvas.toJSON()['objects'][0]['points'];
    // }
    // for(let i = 0; i < this.pointsArray.length; i++){
    //   if(i < this.pointsArray.length - 1){
    //     this.linesArray.push({
    //       x1: this.pointsArray[i].x,
    //       y1: this.pointsArray[i].y,
    //       x2: this.pointsArray[i + 1].x,
    //       y2: this.pointsArray[i + 1].y
    //     });
    //   }
    //   if(i == (this.pointsArray.length - 1)){
    //     this.linesArray.push({
    //       x1: this.pointsArray[i].x,
    //       y1: this.pointsArray[i].y,
    //       x2: this.pointsArray[0].x,
    //       y2: this.pointsArray[0].y
    //     });
    //   }
    // }
    // for (let i = 0; i < this.pointsArray.length; i++) {
    //   if (this.pointsArray[i].x > maxX) {
    //     maxX = this.pointsArray[i].x;
    //   }
    //   if (this.pointsArray[i].x < minX) {
    //     minX = this.pointsArray[i].x;
    //   }
    //   if (this.pointsArray[i].y > maxY) {
    //     maxY = this.pointsArray[i].y;
    //   }
    //   if (this.pointsArray[i].y < minY) {
    //     minY = this.pointsArray[i].y;
    //   }
    // }
    // for (let i = 0; i < this.pointsArray.length; i++) {
    //   this.pointsArray[i].x = this.pointsArray[i].x - minX;
    //   this.pointsArray[i].y = this.pointsArray[i].y - minY;
    // }
    // console.log(this.pointsArray);
    // for (let i = 0; i < this.pointsArray.length; i++) {
    //   this.pointsString += this.pointsArray[i].x.toString() + ', ';
    //   this.pointsString += this.pointsArray[i].y.toString() + ', ';
    // }

    // deltaX = maxX - minX;
    // deltaY = maxY - minY;
    // viewBox = `0 0 ${deltaX} ${deltaY}`;
    // this.pointsString = this.pointsString.substr(0, this.pointsString.length - 2);
    // obj.lines = this.pointsString;
    // obj.viewBox = viewBox;
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

  changeNotToSave() {
    this.input.notToSave = !this.input.notToSave;
  }
}
