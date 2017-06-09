import { Component } from '@angular/core';
import {
  Database, 
  User, UserTest,
  Category, CategoryTest, CATEGORIES

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

  constructor(
    userTest: UserTest,
    public user: User,
    private database: Database,
    public category: Category,
    public categoryTest: CategoryTest) {
    // userTest.run();

    categoryTest.run();



    this.getCategories();



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
    this.category.create({ id: this.category_id, name: this.category_name }, () => {
      console.log("create ok")
    }, e => {
      console.error(e);
    });

  }


  getCategories() {
    this.category.gets((categories) => {
      this.categories = categories;
      console.log('categories:', categories);
    }, e => console.error(e));
  }

  onClickCategoryEdit( id ) {
    console.log(`Going to edit: ${id}`);
    console.log( this.categories );
  }
}
