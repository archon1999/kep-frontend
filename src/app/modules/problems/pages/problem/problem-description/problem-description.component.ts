import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '@auth';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem, Tag, Topic } from '../../../models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { KepcoinSpendSwalModule } from '../../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';

@Component({
  selector: 'problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgSelectModule,
    NgbAccordionModule,
    ProblemBodyComponent,
    NgbNavModule,
    ClipboardModule,
    MonacoEditorComponent,
    KepcoinSpendSwalModule,
  ]
})
export class ProblemDescriptionComponent implements OnInit, OnDestroy {

  @Input() problem: Problem;

  public problemSolution: any;

  public tags: Array<Tag> = [];
  public selectedTag: number;

  public topics: Array<Topic> = [];
  public selectedTopic: number;

  public currentUser: User;
  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public service: ProblemsApiService,
    public modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User | null) => {
        this.currentUser = user;
        if (this.currentUser?.isSuperuser) {
          this.service.getTopics().subscribe((topics: Array<Topic>) => this.topics = topics);
        }

        if (this.currentUser?.permissions.canChangeProblemTags) {
          this.service.getTags().subscribe((tags: Array<Tag>) => this.tags = tags);
        }
      }
    );
  }

  onPurchaseSolution() {
    this.problem.canViewSolution = true;
  }

  openSolutionModal(content) {
    this.service.getProblemSolution(this.problem.id).subscribe(
      (solution: any) => {
        this.problemSolution = solution;
        this.modalService.open(content, {
            size: 'lg',
            scrollable: true,
          }
        );
      });
  }

  addTag() {
    if (this.selectedTag) {
      const tag = this.getTag(this.selectedTag);
      this.service.addTag(this.problem.id, tag.id).subscribe((result: any) => {
        if (result.success) {
          this.problem.tags.push(tag);
        }
      });
    }
  }

  removeTag(tag: Tag) {
    const index = this.problem.tags.findIndex((value) => value.id === tag.id);
    const tagId = this.problem.tags[index].id;
    this.service.removeTag(this.problem.id, tagId).subscribe((result: any) => {
      if (result.success) {
        this.problem.tags.splice(index, 1);
      }
    });
  }

  getTag(tagId: number) {
    return this.tags.find((value) => tagId === value.id);
  }

  addTopic() {
    if (this.selectedTopic) {
      const topic = this.getTopic(this.selectedTopic);
      this.service.addTopic(this.problem.id, topic.id).subscribe(
        () => {
          this.problem.topics.push(topic);
        }
      );
    }
  }

  removeTopic(tag: Topic) {
    const index = this.problem.topics.findIndex((value) => value.id === tag.id);
    const topicId = this.problem.topics[index].id;
    this.service.removeTopic(this.problem.id, topicId).subscribe(
      () => {
        this.problem.topics.splice(index, 1);
      }
    );
  }

  getTopic(topicId: number) {
    return this.topics.find((value) => topicId === value.id);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
