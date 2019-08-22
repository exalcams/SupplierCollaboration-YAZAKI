import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { IPaymentReportPO } from 'app/models/paymentReportPO.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaymentReportPOService } from 'app/services/paymentReportPO.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-payment-report-invoice',
    templateUrl: './payment-report-invoice.component.html',
    styleUrls: ['./payment-report-invoice.component.scss']
})
export class PaymentReportInvoiceComponent implements OnInit, OnDestroy {
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
            invoiceNo: [''],
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
                this.filterForm.value.invoiceNo,
                '',
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
