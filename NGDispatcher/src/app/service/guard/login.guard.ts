import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';
import { User } from 'src/app/models/User';
import * as actions from '../../store/actions';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    currentUser: User;
    constructor(
        private router: Router,
        private store: Store<any>
    ) {
        // if (localStorage.getItem('currentUser') != null) {
        //     // this.store.dispatch(new actions.GetUser(Number(this.currentUser)));
        // }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUserType = localStorage.getItem('currentUserType');
        if (currentUserType != null) {
            this.router.navigate([`/${currentUserType}/home`]);
            return false;
        }
        //this.router.navigate(['/login']);
        return true;
    }
}
