import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';
import { RideService } from 'src/app/service/ride.service';
import { Ride } from 'src/app/models/Ride';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<DataTableItem>;
  dataSource: DataTableDataSource;

  constructor(private rideService: RideService, private route: ActivatedRoute) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['rideID', 'startLocation', 'startTime', 'destinationLocation', 'endTime', 'distance', 'fare', 'isCanceled'];

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.rideService.getRide(id).subscribe((rides: Ride[]) => {
      this.dataSource = new DataTableDataSource(rides, this.rideService);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  onChange(val: Ride) {
    this.dataSource.data.forEach(ride=>{
      if (ride.rideID === val.ID){
        ride.endTime = val.endTime;
        ride.isCanceled = val.isCanceled;
      }
    })
  }
}
