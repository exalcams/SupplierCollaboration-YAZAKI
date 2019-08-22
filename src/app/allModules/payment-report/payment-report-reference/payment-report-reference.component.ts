import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subscription } from 'rxjs';
import { IPaymentReportPO } from 'app/models/paymentReportPO.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaymentReportPOService } from 'app/services/paymentReportPO.service';

@Component({
    selector: 'app-payment-report-reference',
    templateUrl: './payment-report-reference.component.html',
    styleUrls: ['./payment-report-reference.component.scss']
})
export class PaymentReportReferenceComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();
    BGClassName: any;
    displayedColumns: string[] = [
        'PaymentDoc',
        'PaymentDate',
        'PaymentReference',
        'VendorInvoice',
        'ClearingDoc',
        'ClearingDate',
        'PaymentAdviceNo',
        'PaymentAdviceAmount',
        'Amount',
        'Currency'
    ];
    dataSource: MatTableDataSource<IPaymentReportPO>;
    filterForm: FormGroup;
    IsProgressBarVisibile: boolean;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _payementReportService: PaymentReportPOService,
        private _formBuilder: FormBuilder
    ) {}
    ngOnInit(): void {
        this.IsProgressBarVisibile = false;

        this.subscription.add(
            this._fuseConfigService.config.subscribe(config => {
                this.BGClassName = config;
            })
        );

        this.InitForm();
        this.dataSource = new MatTableDataSource();
    }

    InitForm(): void {
        this.filterForm = this._formBuilder.group({
            referenceNo: [''],
            vendorCode: [''],
            fromDate: [new Date()],
            toDate: [new Date()]
        });
    }

    GetPaymentReportPO(): void {
        this.IsProgressBarVisibile = true;
        this._payementReportService
            .getReport(
                '',
                '',
                this.filterForm.value.referenceNo,
                this.filterForm.value.fromDate,
                this.filterForm.value.toDate,
                this.filterForm.value.vendorCode
            )
            .subscribe(
                (result: IPaymentReportPO[]) => {
                    this.dataSource = new MatTableDataSource(result);
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                }
            );
    }

    FormSubmit(): void {
        this.GetPaymentReportPO();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
