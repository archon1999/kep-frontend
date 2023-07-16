import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

const routes: Routes = [
  {
    path: 'faq',
    component: FaqComponent,
    data: { animation: 'faq' }
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
    data: { animation: 'knowledge-base' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
