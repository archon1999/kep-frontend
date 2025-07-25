import { Component, ElementRef, EventEmitter, ViewChild, inject, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { Project } from "@projects/domain/entities";
import { ProjectsRepository } from "@projects/data-access";
import { ProjectAttemptsRepository } from "@projects/data-access/repositories/project-attempts.repository";
import { ProjectInfoCardComponent } from "@projects/ui/components/project-info-card/project-info-card.component";

@Component({
  selector: 'project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgSelectModule,
    KepCardComponent,
    ProjectInfoCardComponent
  ]
})
export class ProjectSidebarComponent implements OnInit {
  @Input() project: Project;
  @Input() hackathonId?: number;
  @Input() projectSymbol?: string;
  @Output() submitEvent = new EventEmitter<any>();

  public selectedTechnology: string;
  public fileToUpload: File | null = null;
  @ViewChild('fileInput') fileInputRef: ElementRef<HTMLInputElement>;

  protected readonly toastr = inject(ToastrService);
  protected readonly projectsRepository = inject(ProjectsRepository);
  protected readonly projectAttemptsRepository = inject(ProjectAttemptsRepository);

  ngOnInit(): void {
    this.selectedTechnology = this.project.availableTechnologies[0].technology;
  }

  handleFileInput(files: FileList) {
    if (files.item(0).size > 1024 * 1024) {
      this.toastr.error('Max file size 1mb');
    } else {
      this.fileToUpload = files.item(0);
    }
  }

  submit() {
    if (!this.selectedTechnology || !this.fileToUpload) {
      return;
    }
    const tech = this.selectedTechnology;
    const file = this.fileToUpload;
    this.fileToUpload = null;
    let submit$;
    if (this.hackathonId && this.projectSymbol) {
      submit$ = this.projectAttemptsRepository.submitHackathonAttempt(this.hackathonId, this.projectSymbol, tech, file);
    } else {
      submit$ = this.projectAttemptsRepository.submitAttempt(this.project.slug, tech, file);
    }
    submit$.subscribe(() => {
      this.submitEvent.emit();
      this.toastr.success('Submitted');
      this.fileInputRef.nativeElement.value = '';
    });
  }
}
