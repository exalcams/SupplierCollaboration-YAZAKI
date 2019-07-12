import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-rfqscreen',
  templateUrl: './rfqscreen.component.html',
  styleUrls: ['./rfqscreen.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RFQScreenComponent implements OnInit {
  RFQClassList: RFQClass[] = [];
  displayedColumns: string[] = ['PurchaseRequirement', 'PurchaseDate', 'PurchaseOrganization', 'PurchaseGroup', 'CompanyCode', 'Buyer', 'Station', 'Publishing', 'Response', 'Award'];
  dataSource: MatTableDataSource<RFQClass>;

  constructor() { }

  ngOnInit(): void {
    this.RFQClassList = [
      {
        PurchaseRequirement: '',  PurchaseOrganization: '', PurchaseGroup: '', CompanyCode: '', Buyer: '', Station: '',
        Publishing: '', Response: '', Award: ''
      }
    ];
    this.dataSource = new MatTableDataSource(this.RFQClassList);
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
