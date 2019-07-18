import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderacknowledgmentComponent } from './orderacknowledgment/orderacknowledgment.component';
import { Routes, RouterModule } from '@angular/router';
import { MatChipsModule, MatDialogModule, MatDatepickerModule, MatTableModule, MatToolbarModule, MatSidenavModule, MatRadioModule, MatMenuModule, MatListModule, MatProgressSpinnerModule, MatCheckboxModule, MatStepperModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatSortModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { FuseSharedModule } from '@fuse/shared.module';

const OrderAcknowledgment: Routes = [
  {
    path: 'acknowledgment',
    component: OrderacknowledgmentComponent,
  }
];

@NgModule({
  declarations: [OrderacknowledgmentComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    FuseSharedModule,
    FileUploadModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatChipsModule,
    MatSortModule,
    RouterModule.forChild(OrderAcknowledgment)
  ]
})
export class OrderacknowledgmentModule { }
