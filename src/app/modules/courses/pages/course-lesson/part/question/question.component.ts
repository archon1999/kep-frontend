import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoursesService } from '@courses/courses.service';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { CoreCommonModule } from '@core/common.module';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'part-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    MathjaxModule,
    DragulaModule,
    CodeEditorModule,
    MonacoEditorModule,
  ]
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: any;
  @Input() lessonPartId: number;
  @Output() checkCompletionEvent = new EventEmitter<any>();

  singleRadio: number;
  code: string;
  input: string;
  conformityGroupOne = [];
  conformityGroupTwo = [];
  orderingList = [];
  classificationGroups: any;

  constructor(
    public service: CoursesService,
    public toastr: ToastrService,
    private dragulaService: DragulaService,
  ) { }

  ngOnInit(): void {
    this.dragulaService.createGroup('handle-list', {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });
    this.pageLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pageLoad();
  }

  pageLoad() {
    if (this.question.type == 4) {
      let a = [], b = [];
      for (let option of this.question.options) {
        a.push(option.optionMain);
        b.push(option.optionSecondary);
      }
      this.conformityGroupOne = this.shuffle(a);
      this.conformityGroupTwo = this.shuffle(b);
    } else if (this.question.type == 5) {
      this.orderingList = [];
      for (let option of this.question.options) {
        this.orderingList.push(option.optionMain);
      }
      this.orderingList = this.shuffle(this.orderingList);
    } else if (this.question.type == 6) {
      let classificationGroups = new Map<string, Array<string>>();
      var keys = [];
      this.classificationGroups = [];
      for (let option of this.question.options) {
        keys.push(option.optionMain);
        classificationGroups.set(option.optionMain, []);
      }
      for (let option of this.question.options) {
        var randomKey = this.choice(keys);
        var arr = classificationGroups.get(randomKey);
        arr.push(option.optionSecondary);
        classificationGroups.set(randomKey, arr);
      }

      for (let key of classificationGroups.keys()) {
        var values = classificationGroups.get(key);
        this.classificationGroups.push({
          key: key,
          values: values,
        })
      }
    } else if (this.question.type == 7) {
      this.question.type = 3;
      setTimeout(() => {
        this.question.type = 7;
      }, 50);
    }
  }

  choice(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  shuffle(array) {
    let currentIndex = array.length, randomIndex: number;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  answerCheck(isKeyup = false) {
    if (isKeyup && this.question.type == 7) return;
    var data: any;
    if (this.question.type == 1) {
      data = [this.singleRadio];
    } else if (this.question.type == 2) {
      data = [];
      for (let option of this.question.options) {
        if (option.checked) {
          data.push(option.id);
        }
      }
    } else if (this.question.type == 3) {
      data = {'input': this.input};
    } else if (this.question.type == 4) {
      data = {
        'group_one': this.conformityGroupOne,
        'group_two': this.conformityGroupTwo
      };
    } else if (this.question.type == 5) {
      data = {'ordering_list': this.orderingList};
    } else if (this.question.type == 6) {
      data = {'classification_groups': this.classificationGroups};
    } else if (this.question.type == 7) {
      data = {'code': this.code};
    }

    this.service.checkLessonPartCompletion(this.lessonPartId, data).subscribe((result: any) => {
      if (result.success) {
        this.toastr.success('', 'To`g`ri', {

          closeButton: true
        });
      } else {
        this.toastr.error('Qaytadan urinib koring', 'Noto`g`ri', {

          closeButton: true
        });
      }
      this.checkCompletionEvent.emit(result);
    })
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('handle-list');
  }

}
