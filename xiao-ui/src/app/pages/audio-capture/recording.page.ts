import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBasePage } from '../page.interface';
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
import { RecordingService } from 'src/app/services/recording.service';
import { CapturingPageComponent } from 'src/app/components/capturing/capturing.page';

@Component({
  standalone: true,
  selector: 'app-recording',
  templateUrl: '../../components/capturing/capturing.page.html',
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
export class RecordingPageComponent extends CapturingPageComponent {
  constructor(protected recordingService: RecordingService) {
    super(recordingService);
    this.title = 'Recording';
  }
}
