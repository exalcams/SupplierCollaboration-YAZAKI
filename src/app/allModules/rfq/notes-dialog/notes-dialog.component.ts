import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NotesDialogComponent implements OnInit {
  notesForm: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<NotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar

  ) {
    this.notesForm = this._formBuilder.group({
      Notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.notesForm.get('Notes').patchValue(this.data);
  }

  public onChange(event): void {
    console.log(event);
  }


  YesClicked(): void {
    if (this.notesForm.valid) {
      const NotesValue = this.notesForm.get('Notes').value;
      this.matDialogRef.close(NotesValue);
    } else {
      Object.keys(this.notesForm.controls).forEach(key => {
        this.notesForm.get(key).markAsTouched();
        this.notesForm.get(key).markAsDirty();
      });
    }

  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }
}
