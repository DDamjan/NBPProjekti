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
  public error: boolean;
  constructor(private store: Store<any>) { this.error = false; }
  ngOnInit() {
  }

  onSubmit($event) {
    const payload = {
      username: $event.target[0].value,
      password: $event.target[1].value
    };

    this.store.dispatch(new actions.AuthUser(payload));
  }

  ngDoCheck() {
    this.store.select(selectAllUsers).subscribe(currentUser => {
      if (currentUser.length !== 0) {
        if (currentUser[0].type === 'error') {
          this.error = true;
        }
      }
    });
  }
}
