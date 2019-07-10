import { Pipe, PipeTransform } from '@angular/core';	
import { DatePipe } from '@angular/common';	

 @Pipe({	
    name: 'customDatePipe'	
})	
export class CustomDatePipe implements PipeTransform {	
    constructor(private datePipe: DatePipe) {}	
    transform(value: Date): string {	
        return value.getDay()+'th '+this.datePipe.transform(value,"MMMM yy")	
    }	
}