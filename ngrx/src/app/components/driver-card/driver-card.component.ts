import { Component, OnInit, Input } from '@angular/core';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import * as driverActions from '../../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['./driver-card.component.css']
})
export class DriverCardComponent implements OnInit {
  @Input() public driver: Driver;

  constructor(private store: Store<any>, private router: Router) { }

  ngOnInit() {
  }

  onclick() {
    this.router.navigateByUrl(`/details/${this.driver.ID}`);
  }

}
