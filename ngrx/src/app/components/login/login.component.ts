import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as actions from '../../store/actions';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store<any>) { }
  ngOnInit() {
  }

  async onSubmit($event) {
    const payload = {
      username: $event.target[0].value,
      password: $event.target[1].value
    };

    await this.store.dispatch(new actions.AuthUser(payload));
  }
}
