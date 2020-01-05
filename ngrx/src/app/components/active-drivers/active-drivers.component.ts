import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Driver } from 'src/app/models/Driver';
import { Observable } from 'rxjs';
import { DriverService } from 'src/app/service/driver.service';
import { selectAllDrivers } from 'src/app/store/reducers/driver.reducer';

@Component({
  selector: 'active-drivers',
  templateUrl: './active-drivers.component.html',
  styleUrls: ['./active-drivers.component.css']
})
export class ActiveDriversComponent implements OnInit {
  activeDrivers: Driver[] = [];
  freeDrivers: Driver[] = [];

  constructor(private driverService: DriverService, private store$: Store<any>) { }

  ngOnInit() {
    this.store$.select(selectAllDrivers).subscribe(drivers => {
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
