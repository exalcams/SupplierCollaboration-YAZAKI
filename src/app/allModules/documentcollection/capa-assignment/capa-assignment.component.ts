import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-capa-assignment',
  templateUrl: './capa-assignment.component.html',
  styleUrls: ['./capa-assignment.component.scss']
})
export class CapaAssignmentComponent implements OnInit {
  SupplierInviteClassList: SupplierInviteClass[] = [];
  BGClassName: any;
  displayedColumns: string[] = ['select', 'VendorName', 'GSTNumber', 'VendorType', 'City'];
  dataSource: MatTableDataSource<SupplierInviteClass>;
  selection = new SelectionModel<SupplierInviteClass>(true, []);
  constructor(private _fuseConfigService: FuseConfigService) { }

  ngOnInit() {
    this.SupplierInviteClassList = [
      {
        VendorName: 'Exalca Technologies Pvt Ltd', GSTNumber: '29AEDF80091', VendorType: '', City: 'Bangalore , KA ,India',
      },
      {
        VendorName: 'Inowits Technologies Pvt Ltd', GSTNumber: '29AEDF80092', VendorType: '', City: 'Bangalore , KA ,India',
      },
      {
        VendorName: 'Exalca Technologies Pvt Ltd', GSTNumber: '29AEDF80091', VendorType: '', City: 'Bangalore , KA ,India',
      },
      {
        VendorName: 'Inowits Technologies Pvt Ltd', GSTNumber: '29AEDF80092', VendorType: '', City: 'Bangalore , KA ,India',
      },
      {
        VendorName: 'Exalca Technologies Pvt Ltd', GSTNumber: '29AEDF80091', VendorType: '', City: 'Bangalore , KA ,India',
      },
      {
        VendorName: 'Inowits Technologies Pvt Ltd', GSTNumber: '29AEDF80092', VendorType: '', City: 'Bangalore , KA ,India',
      },
    ];
    this.dataSource = new MatTableDataSource(this.SupplierInviteClassList);
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
    })
  }
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SupplierInviteClass): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.GSTNumber + 1}`;
  }
}
export class SupplierInviteClass {
  VendorName: string;
  GSTNumber: string;
  VendorType: string;
  City: string;
}