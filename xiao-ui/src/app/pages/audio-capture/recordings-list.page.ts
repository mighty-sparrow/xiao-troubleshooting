import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileSizePipe } from 'src/app/shared/file-size.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AppConfigService } from 'src/app/services/config.service';
import { RecordingService } from 'src/app/services/recording.service';
import { CapturedFilesListComponent } from 'src/app/components/capturing/captured-files-list.page';

@Component({
  standalone: true,
  selector: 'app-recordings-list',
  templateUrl: '../../components/capturing/captured-files-list.page.html',
  styleUrls: ['../../components/capturing/captured-files-list.page.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    FileSizePipe,
  ],
})
export class RecordingsListComponent extends CapturedFilesListComponent {
  override title = 'Manage Recordings';
  constructor(
    protected override c: AppConfigService,
    protected recSvc: RecordingService
  ) {
    super(c, recSvc);
  }
}
