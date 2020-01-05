import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import * as driverActions from '../../store/actions';
import { DriverService } from '../../service/driver.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'driver-register',
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.css']
})
export class DriverRegisterComponent implements OnInit {

  private driver: Driver;
  private id: number;
  public platform: any;



  constructor(private router: Router, private store: Store<any>, private DService: DriverService, private snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  btnCancel() {
    this.router.navigateByUrl('/');
  }

  onSubmit(event$) {

    this.DService.getLastID().subscribe(val => {
      this.id = val[0].ID; console.log(this.id);
      this.driver = {
        ID: this.id + 1,
        firstName: event$.target[0].value,
        lastName: event$.target[1].value,
        phone: event$.target[2].value,
        car: event$.target[3].value,
        color: event$.target[4].value,
        licencePlate: event$.target[5].value,
        currentLat: 43.318058,
        currentLng: 21.891996,
        currentLocation: 'Centrala',
        isActive: false
      };
      this.store.dispatch(new driverActions.AddDriver(this.driver));

      this.snackBar.open(`Driver registered.`, 'Close', {
        duration: 3000
      });
    });
  }
}
