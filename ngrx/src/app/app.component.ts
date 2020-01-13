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
  jeste: boolean;

  constructor(private store: Store<any>,private webSocketService: WebSocketService) { }

  public ngOnInit() {
    this.webSocketService.listen('connection').subscribe((data)=>{
      console.log(data);
      console.log("Unutar random kompompponente slusa i reaguje na poziv severa");
    });

    this.webSocketService.listen('incomingRequest').subscribe((data)=>{
      //EMit za Drivere
      console.log(data);
    });

    this.webSocketService.listen('approveRequest').subscribe((data)=>{
      //EMit za Operatore
      console.log(data);
    });

    this.webSocketService.listen('approvedRide').subscribe((data)=>{
      //EMit za Drivere i Usere
      console.log(data);
    });

    this.webSocketService.listen('incomingRequest').subscribe((data)=>{
      //EMit za drivere
      console.log(data);
    });
    
    this.store.dispatch(new driverActions.GetDrivers());
    // this.store.select()
  }
}
