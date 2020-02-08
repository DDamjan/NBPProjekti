import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'approve-ride',
  templateUrl: './approve-ride.component.html',
  styleUrls: ['./approve-ride.component.css']
})
export class ApproveRideComponent implements OnInit {

  public drivers: User [];
  public client: User;
  public closestDriver: User;
  constructor() { }

  ngOnInit() {
    // this.drivers = history.state.drivers;
    // this.closestDriver = history.state.closest;
    // this.client = history.state.closest;
    console.log(history.state);
  }

}
