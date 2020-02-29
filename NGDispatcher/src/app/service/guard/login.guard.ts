import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: Store<any>
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUserType = localStorage.getItem('currentUserType');
        if (currentUserType != null) {
            this.router.navigate([`/${currentUserType}/home`]);
            return false;
        }
        return true;
    }
}
