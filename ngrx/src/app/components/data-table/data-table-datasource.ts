import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { RideService } from 'src/app/service/ride.service';
import { Input } from '@angular/core';
import { Ride } from 'src/app/models/Ride';

export interface DataTableItem {
  rideID: number;
  driverID: number;
  startLocation: string;
  startTime: string;
  destinationLocation: string;
  endTime: string;
  distance: string;
  fare: number;
  isCanceled: boolean;

}

export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = [];
  paginator: MatPaginator;
  sort: MatSort;



  constructor(private rides: Ride[], private rideService: RideService) {
    super();
    this.rides.forEach(ride => {
      const r: DataTableItem = {
        rideID: ride.ID,
        driverID: ride.driverID,
        startLocation: ride.startLocation,
        startTime: ride.startTime,
        destinationLocation: ride.destinationLocation,
        endTime: ride.endTime,
        distance: ride.distance,
        fare: ride.fare,
        isCanceled: ride.isCanceled
      };
      this.data.push(r);
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'rideID': return compare(+a.rideID, +b.rideID, isAsc);
        case 'startLocation': return compare(a.startLocation, b.startLocation, isAsc);
        case 'startTime': return compare(a.startTime, b.startTime, isAsc);
        case 'destinationLocation': return compare(a.destinationLocation, b.destinationLocation, isAsc);
        case 'endTime': return compare(a.endTime, b.endTime, isAsc);
        case 'distance': return compare(a.distance, b.distance, isAsc);
        case 'fare': return compare(+a.fare, +b.fare, isAsc);
        case 'isCanceled': return compare(a.isCanceled, b.isCanceled, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
