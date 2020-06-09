import { Component, AfterViewInit, ViewChild, NgZone, Inject } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBarConfig, MdSnackBar } from '@angular/material';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { TestPlayerService } from '../_services/testPlayer.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Baseconst } from 'app/share/base.constants';

@Component({
  selector: 'app-webcam-dialog',
  templateUrl: '../_views/webcamDialog.component.html',
  styleUrls: ['../_views/webcamDialog.component.scss', '../../../share/base.scss']
})
export class WebcamDialogComponent implements AfterViewInit {

  private stream: MediaStream;
  private recordRTC: any;
  public isRecording: boolean;
  public isStopped: boolean;
  public videoBoolean: boolean;
  public showError: boolean = true;
  public mediaTestId: string;
  public blob: Blob
  public isLoading = false;
  public result: any;


  @ViewChild('video') video;
  @ViewChild('videoPlayer') videoPlayer;

  constructor(
    private zone: NgZone,
    public thisDialogRef: MdDialogRef<WebcamDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private testPlayerService: TestPlayerService,
    private http: Http,
    private snackBar: MdSnackBar
  ) {
    this.mediaTestId = this.data['mediaTestId'];
    // this.thisDialogRef.afterClosed().subscribe(() => {
    //   let stream = this.stream;
    //   stream.getAudioTracks().forEach(track => track.stop());
    //   stream.getVideoTracks().forEach(track => track.stop());
    //   this.stream = null;
    // })
  }

  ngAfterViewInit() {
    // set the initial state of the video
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = false;
    video.autoplay = false;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {
    this.showError = false;
    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      bitsPerSecond: 2080000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.srcObject = stream;
    this.toggleControls();
  }

  errorCallback() {
    this.showError = true;
  }

  processVideo(audioVideoWebMURL) {
    this.videoBoolean = true;
    let recordRTC = this.recordRTC;
    setTimeout(() => {
      this.videoPlayer.nativeElement.src = audioVideoWebMURL;
    }, 100);
    this.toggleControls();
    this.blob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
  }

  startRecording() {
    let mediaConstraints = {
      video: true,
      audio: true
    };
    this.isRecording = true;
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));

  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    this.isStopped = true;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    this.stream = null;
  }

  download() {
    this.recordRTC.save(`${Date.now()}${Math.random() * 1000}}.webm`);
  }

  upload() {
    if (this.blob) {
      let fileName = `${Date.now()}${Math.random() * 1000}.webm`;
      this.isLoading = true;
      const headers = new Headers();
      /** No need to include Content-Type in Angular 4 */
      const token: string = localStorage.getItem('token');
      /*headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');*/
      headers.append('authtoken', token);
      const url = Baseconst.getCompleteBaseUrl() + 'testingtool/media';
      const options = new RequestOptions({ headers: headers });
      const formData: FormData = new FormData();
      formData.append(`file`, this.blob, fileName);
      formData.append(`mediaTestId`, this.mediaTestId);
      this.http.post(url, formData, options)
        .subscribe(
          data => {
            console.log('success');
            this.result = data;
          },
          error => {
            console.log(error);

          },
          () => {
            this.openSnackBar('Video uploaded');
            this.isLoading = false;
            this.thisDialogRef.close({
              name: fileName,
              response: this.result._body,
              stream: this.stream
            });

          }
        );
    }
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }

  close() {
    this.thisDialogRef.close({
      stream: this.stream
    });
    this.stream = null;
  }

}
