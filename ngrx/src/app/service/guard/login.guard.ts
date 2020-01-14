import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';
import { User } from 'src/app/models/User';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    currentUser: User;
    constructor(
        private router: Router,
        private store: Store<any>
    ) {
        if (localStorage.getItem('currentUser') != null) {
            this.store.select(selectAllUsers).subscribe(user => {
                this.currentUser = user[0];
            });
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.router.navigate([`/${this.currentUser.type}/home`]);
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
