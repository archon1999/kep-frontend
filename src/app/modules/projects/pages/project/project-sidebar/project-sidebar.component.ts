import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectsService } from '@projects/projects.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from '@app/modules/projects/interfaces/project';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { ProjectInfoCardComponent } from '@projects/components/project-info-card/project-info-card.component';

@Component({
  selector: 'project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgSelectModule,
    ProjectInfoCardComponent
  ]
})
export class ProjectSidebarComponent implements OnInit {

  @Input() project: Project;
  @Output() submitEvent = new EventEmitter<any>();

  public selectedTechnology: string;
  public fileToUpload: File | null = null;

  constructor(
    public toastr: ToastrService,
    public service: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.selectedTechnology = this.project.availableTechnologies[0].technology;
  }

  handleFileInput(files: FileList) {
    if (files.item(0).size > 1024 * 1024) {
      this.toastr.error('Max file size 1mb', '', {
        toastClass: 'toast ngx-toastr',
      });
    } else {
      this.fileToUpload = files.item(0);
    }
  }

  submit() {
    if (!this.selectedTechnology || !this.fileToUpload) {
      return;
    }
    this.service.submitAttempt(this.project.slug, this.selectedTechnology, this.fileToUpload).subscribe(
      () => {
        this.submitEvent.emit();
        this.toastr.success('Submitted', '', {
          toastClass: 'toast ngx-toastr',
        });
      }
    );
  }

}
