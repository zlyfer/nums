import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private http: HttpClient) {}

  @ViewChild('p5Canvas', { static: true }) p5Canvas: ElementRef;
  private p: any;
  private langs = ['english', 'spanish', 'french', 'german'];

  ngOnInit() {
    /* --------- Load JSON Files -------- */
    this.langs.forEach((lang: string) => {
      this.http.get(`assets/numbers/${lang}.json`).subscribe((data: any) => {
        console.debug(`data:`, data);
      });
    });
  }

  ngAfterViewInit() {
    const element = this.p5Canvas.nativeElement;

    new p5((p: any) => {
      this.p = p;
      this.p.setup = () => {
        this.init();
      };

      this.p.draw = () => {
        this.draw();
      };
    }, element);
  }

  /* ---------- P5 Functions ---------- */

  init() {
    const aspectRatio = 1 / 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.p.createCanvas(height, height * aspectRatio);
    this.p.frameRate(20);
  }

  draw() {
    this.p.push();
    this.p.background(34);
    this.drawCoordsCross();
    this.p.pop();
  }

  drawCoordsCross() {
    this.p.push();
    this.p.stroke(222);
    this.p.line(0, this.p.height / 2, this.p.width, this.p.height / 2);
    this.p.line(this.p.width / 2, 0, this.p.width / 2, this.p.height);
  }
}
