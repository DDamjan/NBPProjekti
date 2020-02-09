import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as actions from '../actions';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';
import { ofAction } from 'ngrx-actions/dist';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { RideService } from 'src/app/service/ride.service';

@Injectable()
export class UserEffects {
  constructor(
    private store: Store<any>,
    private update$: Actions,
    private userService: UserService,
    private rideService: RideService,
    private router: Router) { }

  //   @Effect()
  //   adduser$ = this.update$.pipe(
  //     ofAction(actions.AddUser),
  //     switchMap(user => this.userService.addUser(user.payload)),
  //     map(response => {
  //       return new actions.AddUserSuccess(response);
  //     },
  //       catchError(error => error.subscribe().switchMap(err => {
  //         console.log(err);
  //       }))));

  @Effect()
  getUser$ = this.update$.pipe(
    ofAction(actions.GetUser),
    switchMap(user => this.userService.getUser(user.payload)),
    map(response => {
      return new actions.GetUserSuccess(response);
    })
  );

  @Effect()
  registerUser$ = this.update$.pipe(
    ofAction(actions.RegisterUser),
    switchMap(user => this.userService.registerUser(user.payload)),
    map(response => {
      this.router.navigate([`${response.type}/home`]);
      return new actions.RegisterUserSuccess(response);
    })
  );

  @Effect()
  authUser$ = this.update$.pipe(
    ofAction(actions.AuthUser),
    switchMap(data => this.userService.authUser(data.payload)),
    map(response => {
      if (response.type !== 'error') {
        this.router.navigate([`${response.type}/home`]);
        return new actions.AuthUserSuccess(response);
      } else {
        return new actions.AuthUserFail(response);
      }
    })
  );

  @Effect()
  requestRide$ = this.update$.pipe(
    ofAction(actions.RequestRide),
    switchMap(ride => this.userService.requestRide(ride.payload)),
    map(response => {
      return new actions.UpdateUserSuccess(response);
    })
  );

  @Effect()
  acceptRide$ = this.update$.pipe(
    ofAction(actions.AcceptRide),
    switchMap(ride => this.userService.acceptRide(ride.payload)),
    map(response => {
      return new actions.UpdateUserSuccess(response);
    })
  );


  @Effect()
  cancelRide$ = this.update$.pipe(
    ofAction(actions.CancelRide),
    switchMap(ride => this.rideService.finishRide(ride.payload)),
    map(response => {
      return new actions.UpdateUserSuccess(response);
    })
  );

  //   @Effect()
  //   updateUser$ = this.update$.pipe(
  //     ofAction(actions.UpdateUser),
  //     switchMap(user => this.userService.updateUser(user.payload)),
  //     map(response => {
  //       return new actions.UpdateUserSuccess(response);
  //     },
  //       catchError(error => error.subscribe().switchMap(err => {
  //         console.log(err);
  //       }))));

  //   @Effect()
  //   deleteUser$ = this.update$.pipe(
  //     ofAction(actions.DeleteUser),
  //     switchMap(User => this.userService.deleteUser(User.payload)),
  //     map(response => {
  //       return new actions.DeleteUserSuccess(response);
  //     }));
}
