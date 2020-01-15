import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as userActions from '../actions';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';
import { ofAction } from 'ngrx-actions/dist';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Injectable()
export class UserEffects {
  constructor(
    private store: Store<any>,
    private update$: Actions,
    private userService: UserService,
    private router: Router) { }

  //   @Effect()
  //   adduser$ = this.update$.pipe(
  //     ofAction(userActions.AddUser),
  //     switchMap(user => this.userService.addUser(user.payload)),
  //     map(response => {
  //       return new userActions.AddUserSuccess(response);
  //     },
  //       catchError(error => error.subscribe().switchMap(err => {
  //         console.log(err);
  //       }))));

  @Effect()
  getUser$ = this.update$.pipe(
    ofAction(userActions.GetUser),
    switchMap(user => this.userService.getUser(user.payload)),
    map(response => {
      return new userActions.GetUserSuccess(response);
    })
  );

  @Effect()
  authUser$ = this.update$.pipe(
    ofAction(userActions.AuthUser),
    switchMap(data => this.userService.authUser(data.payload)),
    map(response => {
      if (response.type !== 'error') {
        this.router.navigate([`${response.type}/home`]);
        return new userActions.AuthUserSuccess(response);
      } else {
        return new userActions.AuthUserFail(response);
      }
    })
  );

  //   @Effect()
  //   updateUser$ = this.update$.pipe(
  //     ofAction(userActions.UpdateUser),
  //     switchMap(user => this.userService.updateUser(user.payload)),
  //     map(response => {
  //       return new userActions.UpdateUserSuccess(response);
  //     },
  //       catchError(error => error.subscribe().switchMap(err => {
  //         console.log(err);
  //       }))));

  //   @Effect()
  //   deleteUser$ = this.update$.pipe(
  //     ofAction(userActions.DeleteUser),
  //     switchMap(User => this.userService.deleteUser(User.payload)),
  //     map(response => {
  //       return new userActions.DeleteUserSuccess(response);
  //     }));
}
