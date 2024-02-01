import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import {
  MatButtonToggle,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ICapturingService } from 'src/app/services/icapturing.service';

@Component({
  standalone: true,
  selector: 'app-recording',
  templateUrl: './capturing.page.html',
  styleUrls: ['./capturing.page.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class CapturingPageComponent implements OnInit {
  title: string;
  @ViewChild('toggleRecordingButton') recordButton!: ElementRef<MatButtonToggle>;
  recordedAudio!: HTMLAudioElement;
  isCapturing = false;
  submitControl = new FormControl('');
  rec!: MediaRecorder;
  audioChunks = new Array();
  buttonLabelText = 'Start';
  _mediaTrackConstraintSet: MediaTrackConstraintSet = {
    autoGainControl: true,
    echoCancellation: true,
    groupId: 'testGroupId',
    noiseSuppression: true,
  };

  constructor(protected capturingService: ICapturingService) {
    this.title = 'Capturing';
  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((recording) => {
      this.mediaHandlerFunction(recording);
    });
  }

  mediaHandlerFunction(recording: MediaStream) {
    this.rec = new MediaRecorder(recording);
    this.rec.ondataavailable = (e) => {
      this.audioChunks.push(e.data);
      if (this.rec.state == 'inactive') {
        let blob = new Blob(this.audioChunks, {
          type: 'audio/mp3',
        });
        this.recordedAudio = document.getElementById(
          'recordedAudio'
        ) as HTMLAudioElement;
        this.recordedAudio.src = URL.createObjectURL(blob);
        this.recordedAudio.controls = true;
        this.recordedAudio.autoplay = false;

        this.capturingService
          .sendData(blob)
          .subscribe(this.publishResponseText);
      }
    };
  }

  publishResponseText(respVal: { id: string }) {
    let txtOutput = document.getElementById('txtOutput') as HTMLDivElement;
    txtOutput.innerHTML = 'File uploaded with ID: ' + respVal.id;
  }

  onToggleRecording() {
    if (this.isCapturing) {
      console.log('Stopping record function.');
      this.buttonLabelText = 'Start';
      this.rec.stop();
    } else {
      console.log('Starting to record.');
      this.buttonLabelText = 'Stop';
      this.rec.start();
    }
    this.isCapturing = !this.isCapturing;
  }
}
