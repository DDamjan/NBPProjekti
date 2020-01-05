import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as driverActions from '../actions';
import { Store } from '@ngrx/store';
import { DriverService } from 'src/app/service/driver.service';
import { ofAction } from 'ngrx-actions/dist';

@Injectable()
export class DriverEffects {
  constructor(
    private store: Store<any>,
    private update$: Actions,
    private driverService: DriverService) { }

  @Effect()
  addDriver$ = this.update$.pipe(
    ofAction(driverActions.AddDriver),
    switchMap(driver => this.driverService.addDriver(driver.payload)),
    map(response => {
      return new driverActions.AddDriverSuccess(response);
    },
      catchError(error => error.subscribe().switchMap(err => {
        console.log(err);
      }))));

  @Effect()
  getDrivers$ = this.update$.pipe(
    ofAction(driverActions.GetDrivers),
    switchMap(driver => this.driverService.getDrivers()),
    map(response => {
      return new driverActions.GetDriversSuccess(response);
    }));

  @Effect()
  updateDriver$ = this.update$.pipe(
    ofAction(driverActions.UpdateDriver),
    switchMap(driver => this.driverService.updateDriver(driver.payload)),
    map(response => {
      return new driverActions.UpdateDriverSuccess(response);
    },
      catchError(error => error.subscribe().switchMap(err => {
        console.log(err);
      }))));

  @Effect()
  deleteDriver$ = this.update$.pipe(
    ofAction(driverActions.DeleteDriver),
    switchMap(Driver => this.driverService.deleteDriver(Driver.payload)),
    map(response => {
      return new driverActions.DeleteDriverSuccess(response);
    }));
}