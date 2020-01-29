import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import * as actions from '../../store/actions';
import { DriverService } from '../../service/driver.service';
import { MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/service/user.service';
import * as cons from '../../../constants/nis-loc';

@Component({
  selector: 'driver-register',
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.css']
})
export class DriverRegisterComponent implements OnInit {

  private driver: Driver;
  private id: number;
  public platform: any;
  public passNotMatched: boolean;
  public error: boolean;



  constructor(private router: Router, private store: Store<any>, private DService: DriverService,
    private userService: UserService, private snackBar: MatSnackBar) {
    this.passNotMatched = false;
    this.error = false;
  }

  ngOnInit() {

  }

  btnCancel() {
    this.router.navigateByUrl('/');
  }

  onSubmit(event$) {

    const firstName = event$.target[0].value;
    const lastName = event$.target[1].value;
    const phone = event$.target[2].value;
    const car = event$.target[3].value;
    const carColor = event$.target[4].value;
    const licencePlate = event$.target[5].value;
    const username = event$.target[6].value;
    const password = event$.target[7].value;
    const passwordCheck = event$.target[8].value;

    if (password !== passwordCheck) {
      this.passNotMatched = true;
    } else {
      this.passNotMatched = false;
      const payload = {
        username,
        type: 'driver'
      };
      this.userService.checkUsername(payload).subscribe(exist => {
        if (exist === false) {
          const user = {
            username,
            password,
            firstName,
            lastName,
            type: 'driver',
            currentLat: cons.nisLat,
            currentLng: cons.nisLng,
            currentLocation: 'Centrala',
            car,
            phone,
            carColor,
            licencePlate,
            isActive: false
          };
          this.store.dispatch(new actions.AddDriver(user));
        } else {
          this.error = true;
        }
      });
      // this.store.dispatch(new driverActions.AddDriver(this.driver));

      this.snackBar.open(`Driver registered.`, 'Close', {
        duration: 3000
      });
    }
  }
}
