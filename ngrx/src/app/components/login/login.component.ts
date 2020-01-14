import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../../store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onSubmit($event) {
    const payload = {
      username: $event.target[0].value,
      password: $event.target[1].value
    };

    this.store.dispatch(new actions.AuthUser(payload));
  }
}
