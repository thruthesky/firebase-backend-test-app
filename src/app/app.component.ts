import { Component } from '@angular/core';


import {
  //User, UserTest,
  //Category, CategoryTest, CATEGORIES,
  // Post, PostTest, POST,
  CATEGORY, CATEGORIES,
  POST,
  ForumService
} from './../firebase-cms/src/index';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  category_id: string;
  category_name: string;
  categories: CATEGORIES = [];


  // post create/edit form
  postForm: POST = {
    categories: {},
    subject: '',
    content: '',
    sticky_forum: false,
    sticky_all_forum: false
  };

  constructor(
    // userTest: UserTest,
    // public user: User,
    public forum: ForumService
  ) {
    // userTest.run();

    // categoryTest.run();



    // this.getCategories();


    this.listenCategory();




  }



  // onClickLoginWithGoogle() {

  //   this.user.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  //     .then((res) => {
  //       console.log("success");
  //       console.log(res);
  //     })
  //     .catch(e => {
  //       console.log('error: ', e);
  //     });


  // }


  // onClickLoginWithFacebook() {

  //   this.user.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  //     .then((res) => {
  //       console.log("facebook login success");
  //       console.log(res);
  //     })
  //     .catch(e => {
  //       console.log('error: ', e);
  //     });
  // }


  onClickCreateCategory() {
    console.log(`Create: ${this.category_name}`);
    this.forum.createCategory({ id: this.category_id, name: this.category_name }, () => {
      console.log("create ok")
    }, e => {
      console.error(e);
    });

  }


  getCategories() {
    this.forum.getCategories((categories) => {
      this.categories = categories;
      console.log('categories:', categories);
    }, e => console.error(e));
  }

  onClickCategoryEdit( id ) {
    console.log(`Going to edit: ${id}`);
    let c = this.categories.find( v => v.id == id );
    console.log(c);

    this.forum.editCategory( { id: c.id, name: c['name'], description: c['description'] }, () => {
      console.log("Updated");
    }, e => console.error(e) );
  }

  onSubmitPostForm() {
    console.log("Going to create a post: ", this.postForm );
    this.forum.createPost( this.postForm, (post) => {
      console.log("Post created: ", post);
    }, e => console.log(e) );
  }
  
  onClickCategoryDelete( id ) {
    this.forum.deleteCategory( id, () => console.log("Category deleted"), e => console.error(e) );
  }

  listenCategory() {
    this.forum.observeCategory().subscribe( res => {
      // console.log(res);
      this.categories = res;
    });
  }
}
