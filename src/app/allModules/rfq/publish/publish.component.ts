import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PublishComponent implements OnInit {
  RFQClassList: RFQClass[] = [];
  BGClassName: any;
  displayedColumns: string[] = ['PurchaseRequirement', 'PurchaseDate', 'PurchaseOrganization', 'PurchaseGroup', 'CompanyCode', 'Buyer', 'Station', 'Publishing', 'Response', 'Award'];
  dataSource: MatTableDataSource<RFQClass>;

  constructor(private _fuseConfigService: FuseConfigService) { }

  ngOnInit(): void {
    this.RFQClassList = [
      {
        PurchaseRequirement: '', PurchaseOrganization: '', PurchaseGroup: '', CompanyCode: '', Buyer: '', Station: '',
        Publishing: '', Response: '', Award: ''
      }
    ];
    this.dataSource = new MatTableDataSource(this.RFQClassList);
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

}

export class RFQClass {
  PurchaseRequirement: string;
  PurchaseDate?: Date;
  PurchaseOrganization: string;
  PurchaseGroup: string;
  CompanyCode: string;
  Buyer: string;
  Station: string;
  Publishing: string;
  Response: string;
  Award: string;
}
