import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as actions from '../../store/actions';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent implements OnInit {
  public error: boolean;
  public passNotMatched: boolean;
  constructor(private store: Store<any>) { this.error = false; }
  ngOnInit() {
    this.passNotMatched = false;
  }

  onSubmit($event) {
    const password = $event.target[1].value;
    const passwordCheck = $event.target[2].value;

    if (password !== passwordCheck) {
      this.passNotMatched = true;
    }

    //this.store.dispatch(new actions.AuthUser(payload));
  }

  ngDoCheck() {
    this.store.select(selectAllUsers).subscribe(currentUser => {
      if (currentUser.length !== 0) {
        if (currentUser[currentUser.length - 1].type === 'error') {
          this.error = true;
        }
      }
    });
  }
}
