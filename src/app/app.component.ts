import { Component } from '@angular/core';
import { Http } from '@angular/http';


import {
  UserService,
  CATEGORY, CATEGORIES,
  POST, POSTS,
  ForumService,
  ApiService, TestService
} from '../firebase-backend/firebase-backend.module';


import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  category_error: string;
  category_id: string;
  category_name: string;
  categories: CATEGORIES = [];

  post_error: string;


  // post create/edit form
  postForm: POST = {
    uid: '',
    name: '',
    categories: [],
    subject: '',
    content: ''
  };

  posts: POSTS = [];

  constructor(
    // userTest: UserTest,
    
    private api: ApiService,
    test: TestService,
    public user: UserService,
    public forum: ForumService
  ) {

    //api.setBackendUrl( 'http://localhost:8010/test-ec3e3/us-central1/postApi' );
    
    api.setBackendUrl( 'https://us-central1-test-ec3e3.cloudfunctions.net/postApi' );
    
    // test.run( api, forum );



    this.loadPosts();
  


    // userTest.run();

    // categoryTest.run();

    // this.getCategories();

   this.listenCategory();



    // this.testCreatePosts('qna', 100);

    // this.forum.page({ page: 1, size: 5 })
    //   .then(posts => {
    //     console.log('1st page posts: ');
    //     for (let p of posts) console.log(p.subject);
    //   });


    // this.forum.page({ page: 2, size: 5 })
    //   .then(posts => {
    //     console.log('2nd page posts: ');
    //     for (let p of posts) console.log(p.subject);
    //   });



  }

  loadPosts() {
    this.posts = [];
    this.forum.postData().once('value').then( s => {;
      let obj = s.val();
      for( let k of Object.keys( obj ) ) {
        this.posts.unshift( obj[k] );
      }
    });
  }

  async testCreatePosts(category, n) {

    let post: POST = { uid: '', categories: [category] };
    for (let i = 0; i < n; i++) {
      post.subject = `${i}th subject.`;
      await this.forum.createPost(post);
    }
  }



  onClickLoginWithGoogle() {

    this.user.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        console.log("success");
        console.log(res);
      })
      .catch(e => {
        console.log('error: ', e);
      });

  }


  onClickLoginWithFacebook() {

    this.user.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((res) => {
        console.log("facebook login success");
        console.log(res);
      })
      .catch(e => {
        console.log('error: ', e);
      });
  }


  onClickCreateCategory() {
    console.log(`Create: ${this.category_name}`);

    let category = { id: this.category_id, name: this.category_name };
    this.forum.createCategory(category)
      .then(id => { })
      .catch(e => console.log(e));


    // this.forum.createCategory(category, () => {
    //   console.log("create ok")
    // }, e => {
    //   console.error(e);
    // });

  }


  getCategories() {
    this.forum.getCategories()
      .then(categories => this.categories)
      .catch(e => this.category_error = e.message);

    // this.forum.getCategories((categories) => {
    //   this.categories = categories;
    //   console.log('categories:', categories);
    // }, e => console.error(e));
  }

  onClickCategoryEdit(id) {
    console.log(`Going to edit: ${id}`);
    let c = this.categories.find(v => v.id == id);
    console.log(c);

    let category = { id: c.id, name: c['name'], description: c['description'] };
    this.forum.editCategory(category)
      .then(category_id => { })
      .catch(e => this.category_error = e.message);




    // this.forum.editCategory( { id: c.id, name: c['name'], description: c['description'] }, () => {
    //   console.log("Updated");
    // }, e => console.error(e) );
  }

  onSubmitPostForm() {
    console.log("Going to create a post : ", this.postForm);

    /// POST category is an array of string but HTML checkboxes are object. Convert checkboxes of category object into an array of POST category.
    this.postForm.categories = Object.keys(this.postForm.categories);
    
    this.postForm.uid = this.user.uid;
    this.postForm.name = this.user.name;


    // this.postForm.function = 'create';
    // if ( this.postForm.key ) this.postForm.function = 'edit';

    this.api.post( this.postForm ).subscribe( key => {
      console.log("Post create with key: ", key);
      this.postForm.categories = [];
      this.loadPosts();
    }, e => {
      console.error(e);
    });

  }

  onClickCategoryDelete(id) {

    this.forum.deleteCategory(id)
      .then(() => { })
      .catch(e => this.category_error = e.message);

    // this.forum.deleteCategory( id, () => console.log("Category deleted"), e => console.error(e) );

  }

  listenCategory() {
    this.forum.observeCategory().subscribe(res => {
      // console.log(res);
      this.categories = res;
    });
  }



  onClickEdit( post:POST ) {

    /// POST category is an array of string but checkboxes of HTML FORM are objects. You need to convert it to objeccts.
    let obj = {};
    for( let c of post.categories ) obj[c] = true;
    this.postForm.categories = <any> obj;

    this.postForm.subject = post.subject;
    this.postForm.content = post.content;
    this.postForm.key = post.key;

  }


}
