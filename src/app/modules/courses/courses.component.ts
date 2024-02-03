import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'angular-animations';
import { Course } from './courses.models';
import { ScriptService } from '@shared/services/script.service';

const SCRIPT_PATH = '//cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/highlight.min.js';
const SCRIPT_PATH2 = 'https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js/dist/highlightjs-line-numbers.min.js';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [fadeInRightAnimation({ duration: 3000 })]
})
export class CoursesComponent implements OnInit {
  public startAnimationState = false;

  courses: Array<Course> = [];

  contentHeader = {
    headerTitle: 'COURSES.COURSES',
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'KEP.uz',
          isLink: false,
        },
      ]
    }
  };

  constructor(
    public route: ActivatedRoute,
    private renderer: Renderer2,
    private scriptService: ScriptService
  ) {
    const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
    const scriptElement2 = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH2);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.startAnimationState = true;
    }, 0);

    this.route.data.subscribe(({ courses }) => {
      this.courses = courses;
    })
  }

}
