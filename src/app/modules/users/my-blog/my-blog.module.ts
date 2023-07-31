import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MyBlogComponent } from './my-blog.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';


const routes: Routes = [
  { path: '', component: MyBlogComponent }
];

@NgModule({
  declarations: [
    MyBlogComponent,
    BlogEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MyBlogModule { }
