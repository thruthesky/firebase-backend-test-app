import { Component } from '@angular/core';


import {
  UserService,
  // UserTest,
  //Category, CategoryTest, CATEGORIES,
  // Post, PostTest, POST,
  CATEGORY, CATEGORIES,
  POST,
  ForumService
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
  postForm = {
    categories: {},
    subject: '',
    content: ''
  };

  constructor(
    // userTest: UserTest,
    public user: UserService,
    public forum: ForumService
  ) {

    // userTest.run();

    // categoryTest.run();

    // this.getCategories();

    this.listenCategory();

    // this.testCreatePosts('qna', 100);

    this.forum.page( { page: 1, size: 5 } )
      .then( posts => {
        console.log('1st page posts: ');
        for( let p of posts ) console.log( p.subject );
      });


    this.forum.page( { page: 2, size: 5 } )
      .then( posts => {
        console.log('2nd page posts: ');
        for( let p of posts ) console.log( p.subject );
      });



  }

  async testCreatePosts( category, n ) {

    let post: POST = { categories: [ category ] };
    for( let i = 0; i < n; i ++ ) {
      post.subject = `${i}th subject.`;
      await this.forum.createPost( post );
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
    this.forum.createCategory( category )
      .then( id => {} )
      .catch( e => console.log( e ) );


    // this.forum.createCategory(category, () => {
    //   console.log("create ok")
    // }, e => {
    //   console.error(e);
    // });

  }


  getCategories() {
    this.forum.getCategories()
      .then( categories => this.categories )
      .catch( e => this.category_error = e.message );

    // this.forum.getCategories((categories) => {
    //   this.categories = categories;
    //   console.log('categories:', categories);
    // }, e => console.error(e));
  }

  onClickCategoryEdit( id ) {
    console.log(`Going to edit: ${id}`);
    let c = this.categories.find( v => v.id == id );
    console.log(c);

    let category = { id: c.id, name: c['name'], description: c['description'] };
    this.forum.editCategory( category )
      .then( category_id => {} )
      .catch( e => this.category_error = e.message );




    // this.forum.editCategory( { id: c.id, name: c['name'], description: c['description'] }, () => {
    //   console.log("Updated");
    // }, e => console.error(e) );
  }

  onSubmitPostForm() {
    console.log("Going to create a post: ", this.postForm );

    this.postForm.categories = Object.keys( this.postForm.categories ); // convert category object to array.
    this.forum.createPost( <POST>this.postForm )
      .then( key => console.log(`post created with : ${key}`))
      .catch( e => {
        this.post_error = e.message;
        console.error(e);
       } );
  }
  
  onClickCategoryDelete( id ) {
    
    this.forum.deleteCategory( id )
      .then( () => {} )
      .catch( e => this.category_error = e.message );

    // this.forum.deleteCategory( id, () => console.log("Category deleted"), e => console.error(e) );

  }

  listenCategory() {
    this.forum.observeCategory().subscribe( res => {
      // console.log(res);
      this.categories = res;
    });
  }


}
