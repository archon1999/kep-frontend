import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { CoreCommonModule } from '../../common.module';
import { CoreCardSnippetComponent } from '../../components/card-snippet/card-snippet.component';
import { NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CoreCardSnippetComponent],
  imports: [CommonModule, HighlightModule, CoreCommonModule, NgbCollapseModule, NgbNavModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js')
      }
    }
  ],
  exports: [CoreCardSnippetComponent]
})
export class CardSnippetModule {}
