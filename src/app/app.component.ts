import { Component } from '@angular/core';
import { User } from './../firebase-cms/src/index';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(user: User) {
    user.register({ email: 'abc31@gmail.com', password: 'hello30', name: 'my30' })
      .subscribe(res => {
        console.log(res);
        console.log("uid: ", res.uid);
      }
      , e => console.error(e));
  }
}
