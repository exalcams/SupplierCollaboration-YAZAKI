import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { config } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-vendor-assignment',
    templateUrl: './vendor-assignment.component.html',
    styleUrls: ['./vendor-assignment.component.scss']
})
export class VendorAssignmentComponent implements OnInit {
    SupplierInviteClassList: SupplierInviteClass[] = [];
    BGClassName: any;
    displayedColumns: string[] = ['VendorName', 'GSTNumber', 'VendorType', 'City'];
    dataSource: MatTableDataSource<SupplierInviteClass>;
    vendorAssignmentForm: FormGroup;

    constructor(private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.SupplierInviteClassList = [
            {
                VendorName: 'Exalca Technologies Pvt Ltd',
                GSTNumber: '29AEDF80091',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            },
            {
                VendorName: 'Inowits Technologies Pvt Ltd',
                GSTNumber: '29AEDF80092',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            },
            {
                VendorName: 'Exalca Technologies Pvt Ltd',
                GSTNumber: '29AEDF80091',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            },
            {
                VendorName: 'Inowits Technologies Pvt Ltd',
                GSTNumber: '29AEDF80092',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            },
            {
                VendorName: 'Exalca Technologies Pvt Ltd',
                GSTNumber: '29AEDF80091',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            },
            {
                VendorName: 'Inowits Technologies Pvt Ltd',
                GSTNumber: '29AEDF80092',
                VendorType: '',
                City: 'Bangalore , KA ,India'
            }
        ];
        this.dataSource = new MatTableDataSource(this.SupplierInviteClassList);
        this._fuseConfigService.config.subscribe(config1 => {
            this.BGClassName = config1;
        });
    }

    initForm(): void {
        this.vendorAssignmentForm = this._formBuilder.group({
            vendorID: [''],
            vendorName: [''],
            gstNo: [''],
            state: ['']
        });
    }
}
export class SupplierInviteClass {
    VendorName: string;
    GSTNumber: string;
    VendorType: string;
    City: string;
}
