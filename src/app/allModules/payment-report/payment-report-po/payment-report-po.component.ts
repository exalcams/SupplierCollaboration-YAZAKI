import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { PaymentReportPOService } from 'app/services/paymentReportPO.service';
import { IPaymentReportPO } from 'app/models/paymentReportPO.model';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-payment-report-po',
    templateUrl: './payment-report-po.component.html',
    styleUrls: ['./payment-report-po.component.scss']
})
export class PaymentReportPoComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();
    IsProgressBarVisibile: boolean;
    BGClassName: any;
    displayedColumns: string[] = [
        'PO',
        'PODate',
        'PaymentDoc',
        'PaymentDate',
        'InvoiceReference',
        'ClearingDoc',
        'ClearingDate',
        'PaymentAdviceNo',
        'PaymentAdviceAmount',
        'Amount',
        'Currency'
    ];
    dataSource: MatTableDataSource<IPaymentReportPO>;
    selection: SelectionModel<IPaymentReportPO>;
    filterForm: FormGroup;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _payementReportService: PaymentReportPOService,
        private _formBuilder: FormBuilder
    ) {
        this.IsProgressBarVisibile = false;
    }

    ngOnInit(): void {
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
            poNumber: [''],
            vendorCode: [''],
            fromDate: [new Date()],
            toDate: [new Date()]
        });
    }

    GetPaymentReportPO(): void {
        this.IsProgressBarVisibile = true;
        this._payementReportService
            .getReport(
                this.filterForm.value.poNumber,
                '',
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
