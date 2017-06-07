import { Component } from '@angular/core';
import { UserTest } from './../firebase-cms/src/index';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(userTest: UserTest) {
    userTest.run();
  }
}
