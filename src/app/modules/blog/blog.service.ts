import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    public api: ApiService,
  ) { }

  getBlogPost(id: number | string){
    return this.api.get(`blog/${id}`);
  }
  
  getBlogPosts(filterParams: any = {}){
    let params: any = {
      page_size: 4,
      page: filterParams.page,
    };
    if(filterParams.topic){
      params.topic = filterParams.topic;
    }
    if(filterParams.author){
      params.author = filterParams.author;
    }
    if(filterParams.title){
      params.title = filterParams.title;
    }
    if(filterParams.orderBy){
      params.order_by = filterParams.orderBy;
    }
    return this.api.get('blog', params);
  }
  
  getAllAuthors(){
    return this.api.get('blog/all-authors');
  }

  getBlogPostComments(id: number | string){
    return this.api.get(`blog/${id}/comments`);
  }
  
  commentPost(blogId: number | string, body: string){
    return this.api.post(`blog/${blogId}/create-comment/`, { body: body });
  }
  
  blogLike(blogId: number | string){
    return this.api.post(`blog/${blogId}/like/`);
  }

  commentLike(commentId: number | string){
    return this.api.post(`blog-comments/${commentId}/like/`);
  }

}
