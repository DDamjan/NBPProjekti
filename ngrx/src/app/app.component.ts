import { Component, OnInit, DoCheck } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from './store/actions';
import { WebSocketService } from './service/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck {
  title = 'NGDispatcher';
  loggedIn: boolean;

  constructor(private store: Store<any>) { }
  public ngOnInit() {
  }

  public ngDoCheck() {
    localStorage.getItem('currentUser') != null ? this.loggedIn = true : this.loggedIn = false;
  }
}
