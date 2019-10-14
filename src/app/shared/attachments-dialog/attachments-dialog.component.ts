import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuxiliaryView } from 'app/models/asn';
import { RFQService } from 'app/services/rfq.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-attachments-dialog',
  templateUrl: './attachments-dialog.component.html',
  styleUrls: ['./attachments-dialog.component.scss']
})
export class AttachmentsDialogComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<AttachmentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuxiliaryView[],
    private _rfqService: RFQService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }


  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

  DownloadRFQItemAttachment(dat: AuxiliaryView): void {
    if (dat.SelectedRFQStatus && dat.SelectedRFQStatus.toLowerCase() === 'open') {
      const BlobFile = dat.AttachmentFile as Blob;
      saveAs(BlobFile, dat.AttachmentName);
    } else {
      this._rfqService.DownloadRFQItemAttachment(dat.APPID, dat.APPNumber, dat.AttachmentNumber, dat.HeaderNumber).subscribe(
        data => {
          if (data) {
            const BlobFile = data as Blob;
            saveAs(BlobFile, dat.AttachmentName);
          }
          // this.IsProgressBarVisibile = false;
        },
        error => {
          console.error(error);
          // this.IsProgressBarVisibile = false;
        }
      );
    }

  }

}
