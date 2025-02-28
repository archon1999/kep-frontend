import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from "@shared/components/toast/toast-container.component";
import { ToastService } from "@shared/components/toast/toast.service";


@Component({
  selector: 'ngbd-toast-global',
  imports: [NgbTooltipModule, ToastsContainer],
  templateUrl: './toast-global.component.html',
  standalone: true
})
export class NgbdToastGlobal implements OnDestroy {
  toastService = inject(ToastService);

  showStandard(template: TemplateRef<any>) {
    this.toastService.show({ template });
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 5000 });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
