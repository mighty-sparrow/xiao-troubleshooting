import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileSizePipe } from 'src/app/shared/file-size.pipe';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AppConfigService } from '../../services/config.service';
import { AudioRecord } from '../../schemas/audio-record.schema';
import { ICapturingService } from '../../services/icapturing.service';

@Component({
  standalone: true,
  selector: 'captured-files-list',
  styleUrls: ['./captured-files-list.page.scss'],
  templateUrl: './captured-files-list.page.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    FileSizePipe,
  ],
})
export class CapturedFilesListComponent implements OnInit {
  title = 'Manage Files';
  elementsDs = new MatTableDataSource<AudioRecord>();

  columnsToDisplay = {
    filename: 'Name',
    _id: 'ID',
    length: 'Size',
    uploadDate: 'Created',
  };
  // columnsToDisplayWithExpand = {...this.columnsToDisplay, ...{expand:'expand'}};
  columnsToDisplayWithExpand = [
    'filename',
    '_id',
    'length',
    'uploadDate',
    'expand',
  ];
  expandedElement: AudioRecord | null | undefined;

  constructor(
    protected c: AppConfigService,
    protected capturingService: ICapturingService
  ) {}

  ngOnInit(): void {
    this.capturingService.load().subscribe((recordings: AudioRecord[]) => {
      this.elementsDs.data = recordings;
      // console.info(
      //   '%c Data Source: %o',
      //   'background-color:#ffcc00;color:#000',
      //   this.elementsDs
      // );
    });
  }

  onFileSuccess(respVal: AudioRecord[]) {
    console.info('SUCCESS!');
    console.log('SHOWING RESPONSE: %o', respVal);
  }

  onFileError(respVal: any) {
    console.error('......OOOOoooohhh SNAP!');
  }

  fetchData(record: AudioRecord) {
    this.capturingService
      .download(record._id)
      .subscribe((resp: ArrayBuffer) => {
        var file = new Blob([resp], { type: 'audio/mp3' });
        console.warn(`File: ${file}`);
        var fileURL = window.URL.createObjectURL(file);
        console.log(`File URL: ${fileURL}`);

        const ae = document.getElementById(
          `audio-${record._id}`
        ) as HTMLAudioElement;
        ae.src = fileURL;
        ae.controls = true;
        ae.autoplay = true;
      });
  }

  onDeleteRecord(record: AudioRecord) {
    console.log(`Deleting record with ID ${record._id}`);
    this.capturingService.delete(record._id).subscribe((_id: string) => {
      const ds = this.elementsDs.data;
      let index = ds.indexOf(record);
      const removed = ds.splice(index, 1);
      this.elementsDs.data = ds;
      console.info('SUCCESS');
      console.log(removed);
    });
  }
}
