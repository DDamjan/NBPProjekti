import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Driver } from 'src/app/models/Driver';
import { Observable } from 'rxjs';
import { WebSocketService } from '../../service/web-socket.service';
import { DriverService } from 'src/app/service/driver.service';
import { selectAllDrivers } from 'src/app/store/reducers/driver.reducer';
import * as actions from '../../store/actions';

@Component({
  selector: 'active-drivers',
  templateUrl: './active-drivers.component.html',
  styleUrls: ['./active-drivers.component.css']
})
export class ActiveDriversComponent implements OnInit {
  activeDrivers: Driver[] = [];
  freeDrivers: Driver[] = [];

  constructor(private driverService: DriverService, private webSocketService: WebSocketService, private store$: Store<any>) { }

  ngOnInit() {
    const id = localStorage.getItem('currentUser');
    this.store$.select(selectAllDrivers).subscribe(drivers => {
      if (drivers.length === 0){
        //this.store$.dispatch(new actions.GetDrivers());
      }
      drivers.forEach(d => {
        if (d.isActive === true) {
          this.activeDrivers.push(d);
        } else {
          this.freeDrivers.push(d);
        }
      });
    });

    this.webSocketService.listen('User:'+id).subscribe((data: any) => {
      console.log(data);
    });
  }



}
