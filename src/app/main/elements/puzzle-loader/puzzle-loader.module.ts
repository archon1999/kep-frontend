import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PuzzleLoaderComponent } from './puzzle-loader.component';


const routes: Routes = [
  { path: '', component: PuzzleLoaderComponent }
];

@NgModule({
  declarations: [
    PuzzleLoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PuzzleLoaderModule { }
