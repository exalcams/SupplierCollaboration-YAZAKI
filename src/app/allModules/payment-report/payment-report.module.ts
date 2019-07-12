import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentReportPoComponent } from './payment-report-po/payment-report-po.component';
import { PaymentReportInvoiceComponent } from './payment-report-invoice/payment-report-invoice.component';
import { PaymentReportReferenceComponent } from './payment-report-reference/payment-report-reference.component';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatToolbarModule, MatSidenavModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatStepperModule, MatSelectModule, MatProgressSpinnerModule, MatListModule, MatMenuModule, MatRadioModule, MatDatepickerModule, MatTableModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';

const paymentReportRoutes: Routes = [
  {
    path: 'po',
    component: PaymentReportPoComponent,
  },
  {
    path: 'invoice',
    component: PaymentReportInvoiceComponent,
  },
  {
    path: 'reference',
    component: PaymentReportReferenceComponent,
  },
];

@NgModule({
  declarations: [PaymentReportPoComponent, PaymentReportInvoiceComponent, PaymentReportReferenceComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    FuseSharedModule,
    FileUploadModule,
    MatCheckboxModule,
    MatTableModule,
    MatDatepickerModule,
    MatTooltipModule,
    RouterModule.forChild(paymentReportRoutes)
  ]
})
export class PaymentReportModule { }
