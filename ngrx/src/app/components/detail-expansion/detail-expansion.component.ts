import { Component, OnInit, Input } from '@angular/core';
import {User} from 'src/app/models/User';

@Component({
  selector: 'detail-expansion',
  templateUrl: './detail-expansion.component.html',
  styleUrls: ['./detail-expansion.component.css']
})
export class DetailExpansionComponent implements OnInit {

  panelOpenState = false;
  @Input() public driver: User;


  constructor() { }

  ngOnInit() {
  }

}
