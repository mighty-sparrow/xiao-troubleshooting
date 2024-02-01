import { Component, OnInit } from '@angular/core';
import { IBasePage } from '../page.interface';
import { IInfoResponse } from './info.entity';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['home.page.css'],
  imports: [CommonModule],
  providers: [HomeService],
})
export class HomePageComponent implements OnInit, IBasePage {
  info: IInfoResponse | undefined;

  title: String;

  constructor(private homeService: HomeService) {
    this.title = 'Welcome';
  }

  ngOnInit(): void {
    this.homeService.getInfo().subscribe((info) => (this.info = info));
  }
}
