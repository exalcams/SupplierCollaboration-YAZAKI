import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor(private datePipe: DatePipe) { }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        const currentDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyHHmmss');
        FileSaver.saveAs(data, fileName + '_' + currentDateTime + EXCEL_EXTENSION);
    }

    public exportTableToExcel(table: any, excelFileName: string): void {
        // converts a DOM TABLE element to a worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // /* save to file */s
        const currentDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyHHmmss');
        XLSX.writeFile(wb, excelFileName + '_' + currentDateTime + EXCEL_EXTENSION);
    }

}