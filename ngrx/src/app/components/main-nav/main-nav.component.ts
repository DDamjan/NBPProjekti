import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwToolbarMixedModesError } from '@angular/material';
import { Store } from '@ngrx/store';
import { WebSocketService } from '../../service/web-socket.service';
import * as actions from '../../store/actions';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  public type: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, 
              private router: Router, private store: Store<any>, private webSocketService: WebSocketService) {
    const currentType = localStorage.getItem('currentUserType');
    if (currentType === 'operator') {
      this.type = true;
    } else {
      this.type = false;
    }
  }

  public onLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    this.router.navigate(['/']);
    this.webSocketService.emit('disconnecting', 'user logout');
  }

}
