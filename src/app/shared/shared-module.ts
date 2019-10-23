import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from './custom-date-pipe';
import { RemoveLeadingZeroPipe } from './remove-leading-zero-pipe';


@NgModule({
  declarations: [CustomDatePipe, RemoveLeadingZeroPipe],
  imports: [CommonModule],
  exports: [CustomDatePipe, RemoveLeadingZeroPipe]
})

export class SharedModule { } 
