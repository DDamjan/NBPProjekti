import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as driverActions from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'NGDispatcher';
  jeste: boolean;

  constructor(private store: Store<any>) { }

  public ngOnInit() {
    this.store.dispatch(new driverActions.GetDrivers());
    // this.store.select()
  }
}
