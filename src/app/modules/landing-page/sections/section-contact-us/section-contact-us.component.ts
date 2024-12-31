import { Component, inject } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { FormControl, FormGroup } from '@angular/forms';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'section-contact-us',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-contact-us.component.html',
  styleUrl: './section-contact-us.component.scss'
})
export class SectionContactUsComponent {
  public form = new FormGroup({
    fullName: new FormControl(null, []),
    email: new FormControl(null, []),
    message: new FormControl(null, []),
  });

  private service = inject(LandingPageService);
  private toastr = inject(ToastrService);
  private translateService = inject(TranslateService);

  submit() {
    this.service.contactUsSubmit(this.form.value).subscribe(
      () => {
        this.toastr.success(this.translateService.instant('Submitted'));
      }
    );
  }
}
