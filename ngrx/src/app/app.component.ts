import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as driverActions from './store/actions';
import { WebSocketService } from './service/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'NGDispatcher';

  constructor(private store: Store<any>,private webSocketService: WebSocketService) { }

  public ngOnInit() {
    this.webSocketService.listen('connection').subscribe((data)=>{
      console.log(data);
      console.log("Unutar random kompompponente slusa i reaguje na poziv severa");
    });

    this.webSocketService.listen('test').subscribe((data)=>{
      console.log(data);
      console.log("get-drivers^");
    });
    this.store.dispatch(new driverActions.GetDrivers());
  }
}
