import { Component, OnInit, DoCheck } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as actions from '../../store/actions';
import { UserService } from 'src/app/service/user.service';
import * as cons from '../../../constants/nis-loc';

@Component({
  selector: 'app-register',
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent implements OnInit, DoCheck {
  public error: boolean;
  public passNotMatched: boolean;
  constructor(private store: Store<any>, private userService: UserService) { this.error = false; }
  ngOnInit() {
    this.passNotMatched = false;
    this.error = false;
  }

  onSubmit($event) {
    const username = $event.target[2].value;
    const password = $event.target[3].value;
    const passwordCheck = $event.target[4].value;
    const firstName = $event.target[1].value;
    const lastName = $event.target[2].value;

    if (password !== passwordCheck) {
      this.passNotMatched = true;
    } else {
      const payload = {
        username,
        type: 'client'
      };
      this.userService.checkUsername(payload).subscribe(exist => {
        if (exist === false) {
          const user = {
            username,
            password,
            firstName,
            lastName,
            type: 'client',
            currentLat: cons.konjLat,
            currentLng: cons.konjLng,
            currentLocation: 'Trg Kralja Aleksandra Ujedinitelja'
          };
          this.store.dispatch(new actions.RegisterUser(user));
        } else {
          this.error = true;
        }
      });
    }

    // this.store.dispatch(new actions.AuthUser(payload));
  }


  ngDoCheck() {
  //   this.store.select(selectAllUsers).subscribe(currentUser => {
  //     if (currentUser.length !== 0) {
  //       if (currentUser[currentUser.length - 1].type === 'error') {
  //         this.error = true;
  //       }
  //     }
  //   });
  }
}
