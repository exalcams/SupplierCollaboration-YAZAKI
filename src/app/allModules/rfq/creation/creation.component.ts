import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Renderer } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { RFQView, RFQItem, RFQItemView, PurchaseRequisitionItem, PurchaseRequisitionStatusCount, RFQParameterPriority, PriorityParameter, RFQStatusCount } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AuthenticationDetails, App, CurrencyMasterView, IncoTermMasterView, PlantMasterView } from 'app/models/master';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { Location } from '@angular/common';
import { Auxiliary, AuxiliaryView } from 'app/models/asn';
import { MasterService } from 'app/services/master.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { Guid } from 'guid-typescript';
import { AttachmentsDialogComponent } from 'app/shared/attachments-dialog/attachments-dialog.component';
import { startWith, map } from 'rxjs/operators';
import { ParameterPriorityDialogComponent } from '../parameter-priority-dialog/parameter-priority-dialog.component';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class CreationComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  PurchaseRequestionItems: PurchaseRequisitionItem[] = [];
  RFQFormGroup: FormGroup;
  RFQItemFormArray: FormArray = this._formBuilder.array([]);
  RFQItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedPurchaseRequisitionID: number;
  SelectedRFQID: number;
  SelectedRFQStatus = '';
  RFQ: RFQView;
  BGClassName: any;
  RFQItemsColumns: string[] =
    ['ItemID', 'MaterialDescription', 'OrderQuantity', 'UOM', 'ExpectedDeliveryDate',
      'Schedule', 'Price', 'Attachment', 'TechRating', 'Notes'];
  RFQItemAppID: number;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  CurrencyList: string[];
  filteredCurrencyOptions: Observable<string[]>;
  IncoTermList: string[];
  filteredIncoTermOptions: Observable<string[]>;
  PlantList: PlantMasterView[];
  filteredPlantOptions: Observable<PlantMasterView[]>;
  isRFQDateError: boolean;
  isRFQResponseDateError: boolean;
  rfqStatusCount: RFQStatusCount;
  CurrentRFQParameterPriority: RFQParameterPriority[] = [];
  AllPriorityParameters: PriorityParameter[] = [];
  AllDisabledPriorityParameters: PriorityParameter[] = [];

  public editorValue: string = '';
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private renderer: Renderer
  ) {
    // this.route.queryParams.subscribe(data => {
    //   this.SelectedPurchaseRequisitionID = +data['id'];
    //   this.SelectedRFQStatus = data['status'];
    //   if (!this.SelectedPurchaseRequisitionID) {
    //     this._router.navigate(['/rfq/publish']);
    //   }
    // });
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    // console.log(CurrentPurchaseRequisition);
    if (CurrentPurchaseRequisition) {
      this.SelectedPurchaseRequisitionID = CurrentPurchaseRequisition.PurchaseRequisitionID;
      this.SelectedRFQID = CurrentPurchaseRequisition.RFQID;
      this.SelectedRFQStatus = CurrentPurchaseRequisition.RFQStatus;
    } else {
      this._router.navigate(['/rfq/pr']);
    }


    // this._location.replaceState(this._router.url.split('?')[0]);
    // const url: string = this._router.url.substring(0, this._router.url.indexOf('?'));
    // this._router.navigateByUrl(url);
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.RFQ = new RFQView();
    this.isRFQDateError = false;
    this.isRFQResponseDateError = false;
    this.rfqStatusCount = new RFQStatusCount();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQCreation') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.RFQFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      SupplyPlant: ['', Validators.required],
      Currency: ['', Validators.required],
      RFQStartDate: ['', Validators.required],
      RFQResponseStartDate: ['', Validators.required],
      IncoTerm: ['', Validators.required],
      RFQEndDate: ['', Validators.required],
      RFQResponseEndDate: ['', Validators.required],
      RFQItems: this.RFQItemFormArray
      // CreatedBy: ['', Validators.required]
    });
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    this.GetAppByName();
    this.GetAllPlantMasters();
    this.GetAllCurrencyMasters();
    this.GetAllIncoTermMasters();
    this.GetRFQStatusCount();
    // if (this.SelectedRFQStatus.toLocaleLowerCase() === 'open') {
    //   this.GetPurchaseRequisitionItemsByPRID();
    // }
    // else {
    //   this.GetRFQByPurchaseRequisitionID();
    // }
    this.GetRFQByRFQID();
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'open') {
      this.GetAllPriorityParameters();
    } else {
      this.GetRFQParameterPriorityByRFQID();
    }
  }

  GetAllPriorityParameters(): void {
    this._rfqService.GetAllPriorityParameters().subscribe(
      (data) => {
        this.AllPriorityParameters = data as PriorityParameter[];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetRFQParameterPriorityByRFQID(): void {
    this._rfqService.GetRFQParameterPriorityByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        this.AllPriorityParameters = data as PriorityParameter[];
        this.AllDisabledPriorityParameters = this.AllPriorityParameters.filter(x => !x.IsActive);
        this.AllPriorityParameters = this.AllPriorityParameters.filter(x => x.IsActive);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.AllPriorityParameters, event.previousIndex, event.currentIndex);
  }

  RemovePriority(pp: PriorityParameter): void {
    pp.IsActive = false;
    const index = this.AllPriorityParameters.indexOf(pp);
    if (index >= 0) {
      const RemovedItem = this.AllPriorityParameters.splice(index, 1)[0];
      this.AllDisabledPriorityParameters.push(RemovedItem);
      // this.AllPriorityParameters.push(this.AllPriorityParameters.splice(index, 1)[0]);
    }
  }
  AddPriority(pp: PriorityParameter): void {
    pp.IsActive = true;
    const index = this.AllDisabledPriorityParameters.indexOf(pp);
    if (index >= 0) {
      const RemovedItem = this.AllDisabledPriorityParameters.splice(index, 1)[0];
      this.AllPriorityParameters.push(RemovedItem);
      // const ActivePriorities = this.AllPriorityParameters.filter(x => x.IsActive);
      // if (ActivePriorities.length <= 0) {
      //   this.AllPriorityParameters.splice(0, 0, RemovedItem);
      // } else {
      //   this.AllPriorityParameters.splice(ActivePriorities.length, 0, RemovedItem);
      // }
    }
  }

  GetRFQStatusCount(): void {
    this._rfqService.GetRFQStatusCount().subscribe(
      (data) => {
        this.rfqStatusCount = data as RFQStatusCount;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onKeydown(event): boolean {
    // console.log(event.key);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return true;
    } else {
      return false;
    }
  }

  RFQDateSelected(): void {
    const FROMDATEVAL = this.RFQFormGroup.get('RFQStartDate').value as Date;
    const TODATEVAL = this.RFQFormGroup.get('RFQEndDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isRFQDateError = true;
    } else {
      this.isRFQDateError = false;
    }
  }
  RFQResponseDateSelected(): void {
    const FROMDATEVAL = this.RFQFormGroup.get('RFQResponseStartDate').value as Date;
    const TODATEVAL = this.RFQFormGroup.get('RFQResponseEndDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isRFQResponseDateError = true;
    } else {
      this.isRFQResponseDateError = false;
    }
  }

  AddRFQItemFormGroup(): void {
    const row = this._formBuilder.group({
      ItemID: ['', Validators.required],
      MaterialDescription: ['', Validators.required],
      OrderQuantity: ['', Validators.required],
      DelayDays: ['', Validators.required],
      UOM: ['', Validators.required],
      Price: ['', Validators.required],
      SupplierPartNumber: ['', Validators.required],
      Schedule: ['', Validators.required],
      NumberOfAttachments: [''],
      AttachmentNames: [[]],
      TechRating: ['', Validators.required],
      Notes: [''],
    });
    this.RFQItemFormArray.push(row);
    // row.get('NumberOfAttachments').disable();
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
  }

  ResetControl(): void {
    this.RFQ.CurrentRFQParameterPriorities = [];
    this.RFQ = new RFQView();
    this.RFQFormGroup.reset();
    Object.keys(this.RFQFormGroup.controls).forEach(key => {
      this.RFQFormGroup.get(key).markAsUntouched();
    });
    this.ResetRFQItems();
  }
  ResetRFQItems(): void {
    this.ClearFormArray(this.RFQItemFormArray);
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  GetAppByName(): void {
    const AppName = 'RFQItem';
    this._masterService.GetAppByName(AppName).subscribe(
      (data) => {
        const ASNAPP = data as App;
        if (ASNAPP) {
          this.RFQItemAppID = ASNAPP.AppID;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllCurrencyMasters(): void {
    this._masterService.GetAllCurrencyMasters().subscribe(
      (data) => {
        const dat = data as CurrencyMasterView[];
        if (dat && dat.length && dat.length > 0) {
          this.CurrencyList = dat.map(x => x.CurrencyCode);
          this.filteredCurrencyOptions = this.RFQFormGroup.get('Currency').valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }

      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllIncoTermMasters(): void {
    this._masterService.GetAllIncoTermMasters().subscribe(
      (data) => {
        const dat = data as IncoTermMasterView[];
        if (dat && dat.length && dat.length > 0) {
          this.IncoTermList = dat.map(x => x.IncoTermCode);
          this.filteredIncoTermOptions = this.RFQFormGroup.get('IncoTerm').valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter1(value))
            );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllPlantMasters(): void {
    this._masterService.GetAllPlantMasters().subscribe(
      (data) => {
        const dat = data as PlantMasterView[];
        if (dat && dat.length && dat.length > 0) {
          this.PlantList = dat;
          this.filteredPlantOptions = this.RFQFormGroup.get('SupplyPlant').valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter2(value))
            );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.CurrencyList.filter(option => option.toLowerCase().includes(filterValue));
    }
  }
  private _filter1(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.IncoTermList.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  private _filter2(value: string): PlantMasterView[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.PlantList.filter(o =>
        Object.keys(o).some(k => o[k].toString().toLowerCase().includes(filterValue.toLowerCase())));
    }
  }

  AddRFQItem(): void {
    if (this.RFQFormGroup.enabled) {
      this.AddRFQItemFormGroup();
    }
  }
  RemoveRFQItem(): void {
    if (this.RFQFormGroup.enabled) {
      if (this.RFQItemFormArray.length > 0) {
        const AttNames = this.RFQItemFormArray.controls[this.RFQItemFormArray.length - 1].get('AttachmentNames').value as string[];
        // this.fileToUploadList = this.fileToUploadList.filter((el) =>
        //   !AttNames.includes(el.name)
        // );
        AttNames.forEach(x => {
          const indexx = this.fileToUploadList.map(y => y.name).indexOf(x);
          this.fileToUploadList.splice(indexx, 1);
        });
        this.RFQItemFormArray.removeAt(this.RFQItemFormArray.length - 1);
        this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddAttachments(): void {
    if (this.RFQFormGroup.enabled) {
      const event = new MouseEvent('click', { bubbles: true });
      this.renderer.invokeElementMethod(
        this.fileInput1.nativeElement, 'dispatchEvent', [event]);
    }
  }

  MenuBookClicked(index: number): void {
    console.log(index);
    this.OpenNotesDialog(index);
  }

  OpenNotesDialog(index: number): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'notes-dialog'
    };
    const dialogRef = this.dialog.open(NotesDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // console.log(result);
          const RFQItemsFormArray = this.RFQFormGroup.get('RFQItems') as FormArray;
          RFQItemsFormArray.controls[index].get('Notes').patchValue(result);
        }
      });
  }

  SubmitRFQDetails(): void {
    // this.RFQResponseFormGroup.enable();
    if (this.RFQFormGroup.valid) {
      if (!this.isRFQDateError && !this.isRFQResponseDateError) {
        if (this.RFQ.RFQID) {
          const Actiontype = 'Update';
          const Catagory = 'RFQ Details';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        } else {
          const Actiontype = 'Create';
          const Catagory = 'RFQ Details';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        }
      }
    } else {
      this.ShowValidationErrors();
    }
  }

  ShowValidationErrors(): void {
    Object.keys(this.RFQFormGroup.controls).forEach(key => {
      if (!this.RFQFormGroup.get(key).valid) {
        console.log(key);
      }
      this.RFQFormGroup.get(key).markAsTouched();
      this.RFQFormGroup.get(key).markAsDirty();
      if (this.RFQFormGroup.get(key) instanceof FormArray) {
        const FormArrayControls = this.RFQFormGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });
  }

  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.SaveRFQ();
          // this.OpenParameterDialog();
        }
      });
  }

  OpenParameterDialog(): void {
    const dialogConfig: MatDialogConfig = {
      data: null,
      panelClass: 'param-priority-dialog'
    };
    const dialogRef = this.dialog.open(ParameterPriorityDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // this.SaveRFQ();
          // this.CurrentRFQParameterPriority = result as RFQParameterPriority[];
          this.RFQ.CurrentRFQParameterPriorities = result as RFQParameterPriority[];
          this.SaveRFQ();
        }
      });
  }

  SaveRFQ(): void {
    // this.RFQ.CurrentRFQParameterPriorities = this.AllPriorityParameters;
    if (this.RFQ.RFQID) {
      this.UpdateRFQ();
    } else {
      this.CreateRFQ();
    }
  }

  UpdateRFQ(): void {
    this.IsProgressBarVisibile = true;
    this.RFQ.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
    this.GetRFQHeaderValues();
    this.GetRFQItemValues();
    this.GetRFQParameterPriority();
    this.RFQ.ModifiedBy = this.CurrentUserID.toString();
    this._rfqService.UpdateRFQ(this.RFQ).subscribe(
      (data) => {
        // const TransID = data as number;
        this.RFQ.RFQID = this.SelectedRFQID;
        const aux = new Auxiliary();
        aux.APPID = this.RFQItemAppID;
        aux.HeaderNumber = this.SelectedRFQID.toString();
        aux.CreatedBy = this.CurrentUserID.toString();
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._rfqService.AddRFQAttachment(aux, this.fileToUploadList).subscribe(
            (dat) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('RFQ details updated successfully', SnackBarStatus.success);
              this.GoToAllocateRFQ();
              this.ResetControl();
            },
            (err) => {
              console.error(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
          );
        } else {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('RFQ details updated successfully', SnackBarStatus.success);
          this.GoToAllocateRFQ();
          this.ResetControl();
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.ResetControl();
      }
    );
  }

  CreateRFQ(): void {
    this.IsProgressBarVisibile = true;
    this.RFQ.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
    this.RFQ.RFQID = this.SelectedRFQID;
    this.GetRFQHeaderValues();
    this.GetRFQItemValues();
    this.GetRFQParameterPriority();
    this.RFQ.CreatedBy = this.CurrentUserID.toString();
    this._rfqService.CreateRFQ(this.RFQ).subscribe(
      (data) => {
        // const TransID = data as number;
        this.RFQ.RFQID = this.SelectedRFQID;
        const aux = new Auxiliary();
        aux.APPID = this.RFQItemAppID;
        aux.HeaderNumber = this.SelectedRFQID.toString();
        aux.CreatedBy = this.CurrentUserID.toString();
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._rfqService.AddRFQAttachment(aux, this.fileToUploadList).subscribe(
            (dat) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
              this.GoToAllocateRFQ();
              this.ResetControl();
            },
            (err) => {
              console.error(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
          );
        } else {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
          this.GoToAllocateRFQ();
          this.ResetControl();
        }
        // this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
        // this.ResetControl();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        // this.ResetControl();
      }
    );
  }

  GetRFQHeaderValues(): void {
    this.RFQ.Title = this.RFQFormGroup.get('Title').value;
    this.RFQ.SupplyPlant = this.RFQFormGroup.get('SupplyPlant').value;
    this.RFQ.Currency = this.RFQFormGroup.get('Currency').value;
    this.RFQ.RFQStartDate = this.RFQFormGroup.get('RFQStartDate').value;
    this.RFQ.RFQResponseStartDate = this.RFQFormGroup.get('RFQResponseStartDate').value;
    this.RFQ.IncoTerm = this.RFQFormGroup.get('IncoTerm').value;
    this.RFQ.RFQEndDate = this.RFQFormGroup.get('RFQEndDate').value;
    this.RFQ.RFQResponseEndDate = this.RFQFormGroup.get('RFQResponseEndDate').value;
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'open') {
      this.RFQ.Status = 'InProgress';
    }
  }

  GetRFQItemValues(): void {
    this.RFQ.RFQItems = [];
    const RFQItemsFormArray = this.RFQFormGroup.get('RFQItems') as FormArray;
    RFQItemsFormArray.controls.forEach((x, i) => {
      const rfq: RFQItemView = new RFQItemView();
      rfq.ItemID = x.get('ItemID').value;
      rfq.MaterialDescription = x.get('MaterialDescription').value;
      rfq.OrderQuantity = x.get('OrderQuantity').value;
      rfq.UOM = x.get('UOM').value;
      rfq.ExpectedDeliveryDate = x.get('ExpectedDeliveryDate').value;
      rfq.DelayDays = x.get('DelayDays').value;
      rfq.Schedule = x.get('Schedule').value;
      rfq.Price = x.get('Price').value;
      rfq.SupplierPartNumber = x.get('SupplierPartNumber').value;
      rfq.SelfLifeDays = x.get('SelfLifeDays').value;
      rfq.NumberOfAttachments = x.get('NumberOfAttachments').value ? x.get('NumberOfAttachments').value : 0;
      rfq.AttachmentNames = x.get('AttachmentNames').value;
      rfq.TechRating = x.get('TechRating').value;
      rfq.Notes = x.get('Notes').value;
      // if (this.SelectedRFQStatus.toLocaleLowerCase() === 'open') {
      //   const selectedItem = this.PurchaseRequestionItems.filter(y => y.ItemID === rfq.ItemID)[0];
      //   if (selectedItem) {
      //     rfq.DelayDays = selectedItem.DelayDays;
      //     rfq.SupplierPartNumber = selectedItem.SupplierPartNumber;
      //     rfq.SelfLifeDays = selectedItem.SelfLifeDays;
      //   }
      // } else {
      //   const selectedItem = this.RFQ.RFQItems.filter(y => y.ItemID === rfq.ItemID)[0];
      //   if (selectedItem) {
      //     rfq.DelayDays = selectedItem.DelayDays;
      //     rfq.SupplierPartNumber = selectedItem.SupplierPartNumber;
      //     rfq.SelfLifeDays = selectedItem.SelfLifeDays;
      //   }
      // }
      rfq.APPID = this.RFQItemAppID;
      this.RFQ.RFQItems.push(rfq);
    });
  }

  GetRFQParameterPriority(): void {
    this.RFQ.CurrentRFQParameterPriorities = [];
    const ActivePriorities = this.AllPriorityParameters.filter(x => x.IsActive);
    const len = ActivePriorities.length;
    if (len > 0) {
      ActivePriorities.forEach((pp, i) => {
        const t: RFQParameterPriority = new RFQParameterPriority();
        t.Parameter = pp.Parameter;
        t.Priority = i + 1;
        t.PriorityValue = len - i;
        t.CreatedBy = this.CurrentUserID.toString();
        this.RFQ.CurrentRFQParameterPriorities.push(t);
      });
    }
  }

  GoToAllocateRFQ(): void {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    CurrentPurchaseRequisition.RFQID = this.RFQ.RFQID;
    this._shareParameterService.SetPurchaseRequisition(CurrentPurchaseRequisition);
    this._router.navigate(['/rfq/publish']);
  }

  InsertRFQHeaderValues(): void {
    this.RFQFormGroup.patchValue({
      Title: this.RFQ.Title,
      SupplyPlant: this.RFQ.SupplyPlant,
      Currency: this.RFQ.Currency,
      RFQStartDate: this.RFQ.RFQStartDate,
      RFQResponseStartDate: this.RFQ.RFQResponseStartDate,
      IncoTerm: this.RFQ.IncoTerm,
      RFQEndDate: this.RFQ.RFQEndDate,
      RFQResponseEndDate: this.RFQ.RFQResponseEndDate
    });
  }

  InsertPurchaseRequisitionItemsFormGroup(prItem: PurchaseRequisitionItem): void {
    const row = this._formBuilder.group({
      ItemID: [prItem.ItemID, Validators.required],
      MaterialDescription: [prItem.MaterialDescription, Validators.required],
      OrderQuantity: [prItem.OrderQuantity, Validators.required],
      UOM: [prItem.UOM, Validators.required],
      ExpectedDeliveryDate: [prItem.ExpectedDeliveryDate, Validators.required],
      DelayDays: [prItem.DelayDays],
      Schedule: [prItem.Schedule, Validators.required],
      Price: [prItem.Price, Validators.required],
      SupplierPartNumber: [prItem.SupplierPartNumber],
      SelfLifeDays: [prItem.SelfLifeDays],
      NumberOfAttachments: [''],
      AttachmentNames: [[]],
      TechRating: [prItem.TechRating, Validators.required],
      Notes: [''],
    });
    row.disable();
    row.get('Notes').enable();
    this.RFQItemFormArray.push(row);
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
    // return row;
  }

  InsertRFQItemsFormGroup(rFQItem: RFQItemView): void {
    const row = this._formBuilder.group({
      ItemID: [rFQItem.ItemID, Validators.required],
      MaterialDescription: [rFQItem.MaterialDescription, Validators.required],
      OrderQuantity: [rFQItem.OrderQuantity, Validators.required],
      UOM: [rFQItem.UOM, Validators.required],
      ExpectedDeliveryDate: [rFQItem.ExpectedDeliveryDate, Validators.required],
      DelayDays: [rFQItem.DelayDays],
      Schedule: [rFQItem.Schedule, Validators.required],
      Price: [rFQItem.Price, Validators.required],
      SupplierPartNumber: [rFQItem.SupplierPartNumber],
      SelfLifeDays: [rFQItem.SelfLifeDays],
      NumberOfAttachments: [rFQItem.NumberOfAttachments],
      AttachmentNames: [rFQItem.AttachmentNames],
      TechRating: [rFQItem.TechRating, Validators.required],
      Notes: [rFQItem.Notes, Validators.required],
    });
    row.disable();
    row.get('Notes').enable();
    this.RFQItemFormArray.push(row);
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
    // return row;
  }

  GetPurchaseRequisitionItemsByPRID(): void {
    this._rfqService.GetPurchaseRequisitionItemsByPRID(this.SelectedPurchaseRequisitionID).subscribe(
      (data) => {
        this.PurchaseRequestionItems = data as PurchaseRequisitionItem[];
        if (this.PurchaseRequestionItems && this.PurchaseRequestionItems.length) {
          this.ClearFormArray(this.RFQItemFormArray);
          this.PurchaseRequestionItems.forEach((x, i) => {
            this.InsertPurchaseRequisitionItemsFormGroup(x);
          });
        } else {
          this.ResetRFQItems();
        }
        // this.RFQFormGroup.disable();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetRFQByPurchaseRequisitionID(): void {
    this._rfqService.GetRFQByPurchaseRequisitionID(this.SelectedPurchaseRequisitionID).subscribe(
      (data) => {
        this.RFQ = data as RFQView;
        if (this.RFQ) {
          this.InsertRFQHeaderValues();
          if (this.RFQ.RFQItems && this.RFQ.RFQItems.length) {
            this.ClearFormArray(this.RFQItemFormArray);
            this.RFQ.RFQItems.forEach((x, i) => {
              this.InsertRFQItemsFormGroup(x);
            });
          } else {
            this.ResetRFQItems();
          }
          this.RFQFormGroup.disable();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetRFQByRFQID(): void {
    this._rfqService.GetRFQByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        this.RFQ = data as RFQView;
        if (this.RFQ) {
          this.InsertRFQHeaderValues();
          if (this.RFQ.RFQItems && this.RFQ.RFQItems.length) {
            this.ClearFormArray(this.RFQItemFormArray);
            this.RFQ.RFQItems.forEach((x, i) => {
              this.InsertRFQItemsFormGroup(x);
            });
          } else {
            this.ResetRFQItems();
          }
          if (this.SelectedRFQStatus.toLocaleLowerCase() !== 'open') {
            this.RFQFormGroup.disable();
          }
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }



  handleFileInput(evt, index: number): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
      const OldValue = +this.RFQItemFormArray.controls[index].get('NumberOfAttachments').value;
      this.RFQItemFormArray.controls[index].get('NumberOfAttachments').patchValue(OldValue + 1);
      const AttNames = this.RFQItemFormArray.controls[index].get('AttachmentNames').value as string[];
      AttNames.push(this.fileToUpload.name);
      this.RFQItemFormArray.controls[index].get('AttachmentNames').patchValue(AttNames);
    }
    // console.log(index);
  }

  GetRFQItemAttachments(index: number): void {
    const RFQItemsFormArray = this.RFQFormGroup.get('RFQItems') as FormArray;
    const APPNumber: number = RFQItemsFormArray.controls[index].get('ItemID').value;
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'open') {
      const dat: AuxiliaryView[] = [];
      const AttNames = this.RFQItemFormArray.controls[index].get('AttachmentNames').value as string[];
      AttNames.forEach(x => {
        const aux = new AuxiliaryView();
        aux.APPID = this.RFQItemAppID;
        aux.AttachmentName = x;
        const f = this.fileToUploadList.filter(y => y.name === x)[0];
        if (f) {
          aux.AttachmentFile = f;
        }
        aux.SelectedRFQStatus = 'open';
        dat.push(aux);
      });
      this.OpenAttachmentsDialog(dat);
    } else {
      this._rfqService.GetRFQItemAttachments(this.RFQItemAppID, APPNumber, this.RFQ.RFQID.toString()).subscribe(
        (data) => {
          if (data) {
            const dat = data as AuxiliaryView[];
            this.OpenAttachmentsDialog(dat);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  OpenAttachmentsDialog(data: AuxiliaryView[]): void {
    const dialogConfig: MatDialogConfig = {
      data: data,
      panelClass: 'attachment-dialog'
    };
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

        }
      });
  }
}
