import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
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
  private langs = [
    'chinese',
    'danish',
    'dutch',
    'english',
    'finnish',
    'french',
    'german',
    'italian',
    'japanese',
    'norwegian',
    'spanish',
    'swedish',
  ];
  private numbers: any = {};
  private colors = [
    '#F44336',
    '#FFEB3B',
    '#2196F3',
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
  ];
  private showNames = false;
  private dataLoaded = false;
  private usedColors: any = [];
  private usedQuadrants: any = [];

  ngOnInit() {
    const shades = 4;
    this.colors = this.colors
      .map((color) => {
        let colors = [];
        colors.push(color);
        const baseColor = this.hexToRgb(color);
        for (let i = 1; i < shades; i++) {
          colors.push(this.rgbToHex(this.shadeColor(baseColor, i * 20)));
        }
        return colors;
      })
      .flat();
    this.colors = this.colors
      .map((color, index) => {
        return {
          color,
          index: index % shades,
        };
      })
      .sort((a, b) => a.index - b.index)
      .map((entry) => entry.color);
    console.debug(`this.colors:`, this.colors);
  }

  hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  rgbToHex(rgb: any) {
    return (
      '#' +
      ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    );
  }

  shadeColor(color: any, percent: number) {
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    return {
      r: this.shadeColorPart(color.r, t, p),
      g: this.shadeColorPart(color.g, t, p),
      b: this.shadeColorPart(color.b, t, p),
    };
  }

  shadeColorPart(color: number, target: number, percent: number) {
    return Math.round((color + (target - color) * (percent / 100)) * 1);
  }

  getNumbers(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`assets/numbers/${lang}.json`).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  async ngAfterViewInit() {
    const element = this.p5Canvas.nativeElement;

    new p5((p: any) => {
      this.p = p;
      this.p.setup = async () => {
        /* --------- Load JSON Files -------- */
        for (const lang of this.langs) {
          const data = await this.getNumbers(lang);
          this.numbers[lang] = data;
        }

        this.dataLoaded = true;

        const aspectRatio = 1 / 1;
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.p.createCanvas(height, height * aspectRatio);
        this.p.frameRate(30);
      };

      this.p.mouseClicked = () => {
        if (this.dataLoaded) {
          this.showNames = !this.showNames;
          this.p.clear();
          this.p.redraw();
          this.p.loop();
        }
      };

      this.p.draw = () => {
        if (this.dataLoaded) {
          this.draw();
        }
      };
    }, element);
  }

  /* ---------- P5 Functions ---------- */

  draw() {
    this.p.push();
    this.p.background(34);

    this.allLanguages();
    // this.nordicLanguages();
    // this.customLanguages1();

    this.drawCoordsCross();

    this.p.pop();
    this.p.noLoop();
  }

  allLanguages() {
    this.drawInQuadrant(1, 'english', false);
    this.drawInQuadrant(1, 'italian', false);
    this.drawInQuadrant(1, 'spanish', false);
    this.drawInQuadrant(2, 'chinese', false);
    this.drawInQuadrant(2, 'french', false);
    this.drawInQuadrant(2, 'japanese', false);
    this.drawInQuadrant(3, 'finnish', false);
    this.drawInQuadrant(3, 'norwegian', false);
    this.drawInQuadrant(3, 'swedish', false);
    this.drawInQuadrant(4, 'danish', false);
    this.drawInQuadrant(4, 'dutch', false);
    this.drawInQuadrant(4, 'german', false);

    if (this.showNames) {
      this.drawInQuadrant(1, 'english', true);
      this.drawInQuadrant(1, 'italian', true);
      this.drawInQuadrant(1, 'spanish', true);
      this.drawInQuadrant(2, 'chinese', true);
      this.drawInQuadrant(2, 'french', true);
      this.drawInQuadrant(2, 'japanese', true);
      this.drawInQuadrant(3, 'finnish', true);
      this.drawInQuadrant(3, 'norwegian', true);
      this.drawInQuadrant(3, 'swedish', true);
      this.drawInQuadrant(4, 'danish', true);
      this.drawInQuadrant(4, 'dutch', true);
      this.drawInQuadrant(4, 'german', true);
    }
  }

  nordicLanguages() {
    this.drawInQuadrant(1, 'danish', false);
    this.drawInQuadrant(2, 'finnish', false);
    this.drawInQuadrant(3, 'norwegian', false);
    this.drawInQuadrant(4, 'swedish', false);

    if (this.showNames) {
      this.drawInQuadrant(1, 'danish', true);
      this.drawInQuadrant(2, 'finnish', true);
      this.drawInQuadrant(3, 'norwegian', true);
      this.drawInQuadrant(4, 'swedish', true);
    }
  }

  customLanguages1() {
    this.drawInQuadrant(1, 'english', false);
    this.drawInQuadrant(2, 'german', false);
    this.drawInQuadrant(3, 'dutch', false);
    this.drawInQuadrant(4, 'danish', false);

    if (this.showNames) {
      this.drawInQuadrant(1, 'english', true);
      this.drawInQuadrant(2, 'german', true);
      this.drawInQuadrant(3, 'dutch', true);
      this.drawInQuadrant(4, 'danish', true);
    }
  }

  drawCoordsCross() {
    this.p.push();
    const subGrids = 3;
    const initialStroke = 180;
    const strokeDecreaseFactor = 0.5;

    for (let i = 0; i < subGrids; i++) {
      this.p.stroke(200, initialStroke * Math.pow(strokeDecreaseFactor, i));
      if (i == 0) {
        this.p.strokeWeight(2);
      } else {
        this.p.strokeWeight(1);
      }

      for (
        let x = 0;
        x <= this.p.width;
        x += this.p.width / Math.pow(2, i + 1)
      ) {
        this.p.line(x, 0, x, this.p.height);
      }

      for (
        let y = 0;
        y <= this.p.height;
        y += this.p.height / Math.pow(2, i + 1)
      ) {
        this.p.line(0, y, this.p.width, y);
      }
    }

    this.p.pop();
  }

  drawInQuadrant(quadrant: number, lang: string, text: boolean) {
    if (!this.usedColors.includes(lang)) {
      this.usedColors.push(lang);
    }
    const colorIndex = this.usedColors.indexOf(lang);
    const numbers = this.numbers[lang];
    this.p.push();
    this.p.translate(
      (this.p.width / 2) * ((quadrant - 1) % 2),
      this.p.height * (quadrant > 2 ? 1 : 0.5)
    );
    this.p.scale(1, -1);
    this.p.noStroke();
    const circleSize = 5;
    this.p.fill(this.colors[colorIndex]);

    const wStep = this.p.width / 2 / (numbers.length + 1);
    const hStep = this.p.height / 2 / (numbers.length + 1);
    const textSize = 10;

    let sortedNumbers = Object.values(numbers).sort((a: any, b: any) =>
      a.localeCompare(b)
    );
    const numbersObj = sortedNumbers.map((number: any, index: number) => {
      return {
        index: numbers.indexOf(number),
        number,
        rank: index,
      };
    });

    // if (!this.usedQuadrants.includes(quadrant)) {
    //   this.usedQuadrants.push(quadrant);
    //   this.p.push();
    //   this.p.fill('#ffffff11');
    //   for (let _x = 0; _x < numbersObj.length + 1; _x++) {
    //     for (let _y = 0; _y < numbersObj.length + 1; _y++) {
    //       this.p.circle(_x * wStep, _y * hStep, circleSize);
    //     }
    //   }
    //   this.p.pop();
    // }

    numbersObj.forEach(async (entry: any) => {
      let y = (entry.rank + 1) * hStep;
      let x = (entry.index + 1) * wStep;
      if (!text) {
        if (
          (this.showNames &&
            (entry.index % 10 === 0 || entry.rank % 10 === 0)) ||
          !this.showNames
        ) {
          this.p.circle(x, y, circleSize);
        }
      } else {
        if (
          this.showNames &&
          (entry.index % 10 === 0 || entry.rank % 10 === 0)
        ) {
          this.p.push();
          this.p.scale(1, -1);
          this.p.textSize(textSize);
          y *= -1;
          if (x + 5 + textSize * entry.number.length > this.p.width / 2) {
            this.p.textAlign(this.p.RIGHT);
            x -= 10;
          }
          this.p.text(entry.number, x + 5, y + (textSize / 2) * 0.5);
          this.p.pop();
        }
      }
    });
    this.p.pop();
  }
}
