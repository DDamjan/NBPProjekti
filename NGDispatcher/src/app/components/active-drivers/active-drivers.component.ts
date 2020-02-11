import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Driver } from 'src/app/models/Driver';
import { WebSocketService } from '../../service/web-socket.service';
import { DriverService } from 'src/app/service/driver.service';
import { selectAllDrivers } from 'src/app/store/reducers/driver.reducer';
import * as actions from '../../store/actions';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'active-drivers',
  templateUrl: './active-drivers.component.html',
  styleUrls: ['./active-drivers.component.css']
})
export class ActiveDriversComponent implements OnInit {
  activeDrivers: Driver[] = [];
  freeDrivers: Driver[] = [];
  again: boolean;

  constructor(private driverService: DriverService, private webSocketService: WebSocketService, private store$: Store<any>,
              private router: Router) {
    this.again = false;
  }

  ngOnInit() {
    const id = Number(localStorage.getItem('currentUser'));
    const type = localStorage.getItem('currentUserType');
    this.webSocketService.onConnect(id,type);
    this.store$.select(selectAllUsers).subscribe(user => {
      if (this.again === false) {
        if (user.length === 0) {
          this.store$.dispatch(new actions.GetUser({id, auth: true}));
          this.populateDrivers();
          this.again = true;
        } else {
          this.populateDrivers();
        }
      }
    });

    this.webSocketService.listen('Operator:' + id).subscribe((data: any) => {
      console.log(data);
      this.router.navigateByUrl('/operator/assign', {state: data});
    });
  }

  update(){
    this.ngOnInit();
  }

  populateDrivers() {
    this.store$.select(selectAllDrivers).subscribe(drivers => {
      if (drivers.length === 0) {
        this.store$.dispatch(new actions.GetDrivers());
      }
      drivers.forEach(d => {
        if (d.isActive === true) {
          this.activeDrivers.push(d);
        } else {
          this.freeDrivers.push(d);
        }
      });
    });
  }

}
