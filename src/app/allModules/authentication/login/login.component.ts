import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
// import { LoginService } from 'app/services/login.service';
// import { UserDetails } from 'app/models/user-details';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { MenuUpdataionService } from 'app/services/menu-update.service';
import { AuthenticationDetails, UserPreference } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    navigation: FuseNavigation[] = [];
    authenticationDetails: AuthenticationDetails;
    MenuItems: string[];
    children: FuseNavigation[] = [];
    subChildren: FuseNavigation[] = [];
    subChildren1: FuseNavigation[] = [];
    subChildren2: FuseNavigation[] = [];
    subChildren3: FuseNavigation[] = [];
    private _unsubscribeAll: Subject<any>;
    message = 'Snack Bar opened.';
    actionButtonLabel = 'Retry';
    action = true;
    setAutoHide = true;
    autoHide = 2000;

    addExtraClass: false;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;
    fuseConfig: any;

    constructor(
        private _fuseNavigationService: FuseNavigationService,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _authService: AuthService,
        private _menuUpdationService: MenuUpdataionService,
        // private _loginService: LoginService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this._unsubscribeAll = new Subject();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = false;
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

    }

    LoginClicked(): void {
        if (this.loginForm.valid) {
            this.IsProgressBarVisibile = true;
            this._authService.login(this.loginForm.get('userName').value, this.loginForm.get('password').value).subscribe(
                data => {
                    this._authService.GetUserPreferenceByUserID(data.userID as Guid).subscribe(
                        (data1) => {
                            let userPre = data1 as UserPreference;
                            if (!userPre) {
                                userPre = new UserPreference();
                                userPre.NavbarPrimaryBackground = 'fuse-navy-700';
                                userPre.NavbarSecondaryBackground = 'fuse-navy-700';
                                userPre.ToolbarBackground = 'blue-800';
                            }
                            localStorage.setItem('userPreferenceData', JSON.stringify(userPre));
                            this.UpdateUserPreference();
                        },
                        (err1) => {
                            console.error(err1);
                        }
                    );
                    this.IsProgressBarVisibile = false;
                    localStorage.setItem('authorizationData', JSON.stringify(data));
                    this.UpdateMenu();
                    this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
                    this._router.navigate(['dashboard']);
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    console.error(err);
                    // console.log(err instanceof Object);
                    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                }
            );
            // this._router.navigate(['dashboard']);
            // this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
        } else {
            Object.keys(this.loginForm.controls).forEach(key => {
                const abstractControl = this.loginForm.get(key);
                abstractControl.markAsDirty();
            });
        }
    }

    UpdateUserPreference(): void {
        this._fuseConfigService.config
            //   .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;
                // Retrive user preference from Local Storage    
                const userPre = localStorage.getItem('userPreferenceData');
                if (userPre) {
                    const userPrefercence: UserPreference = JSON.parse(userPre) as UserPreference;
                    if (userPrefercence.NavbarPrimaryBackground && userPrefercence.NavbarPrimaryBackground !== '-') {
                        this.fuseConfig.layout.navbar.primaryBackground = userPrefercence.NavbarPrimaryBackground;
                    } else {
                        this.fuseConfig.layout.navbar.primaryBackground = 'fuse-navy-700';
                    }
                    if (userPrefercence.NavbarSecondaryBackground && userPrefercence.NavbarSecondaryBackground !== '-') {
                        this.fuseConfig.layout.navbar.secondaryBackground = userPrefercence.NavbarSecondaryBackground;
                    } else {
                        this.fuseConfig.layout.navbar.secondaryBackground = 'fuse-navy-700';
                    }
                    if (userPrefercence.ToolbarBackground && userPrefercence.ToolbarBackground !== '-') {
                        this.fuseConfig.layout.toolbar.background = userPrefercence.ToolbarBackground;
                        this.fuseConfig.layout.toolbar.customBackgroundColor = true;
                    } else {
                        this.fuseConfig.layout.toolbar.background = 'blue-800';
                        this.fuseConfig.layout.toolbar.customBackgroundColor = true;
                    }
                } else {
                    this.fuseConfig.layout.navbar.primaryBackground = 'fuse-navy-700';
                    this.fuseConfig.layout.navbar.secondaryBackground = 'fuse-navy-700';
                    this.fuseConfig.layout.toolbar.background = 'blue-800';
                    this.fuseConfig.layout.toolbar.customBackgroundColor = true;
                }

            });
        this._fuseConfigService.config = this.fuseConfig;
    }

    UpdateMenu(): void {
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
            // console.log(this.MenuItems);
        } else {
        }
        if (this.MenuItems.indexOf('Dashboard') >= 0) {
            this.children.push({
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                icon: 'dashIcon',
                isSvgIcon: true,
                url: '/dashboard'
            });
        }
        // if (this.MenuItems.indexOf('AdvanceShipment') >= 0) {
        //     this.children.push({
        //         id: 'advanceShipment',
        //         title: 'Advance Shipment',
        //         translate: 'NAV.SAMPLE.TITLE',
        //         type: 'item',
        //         icon: 'shipment',
        //         isSvgIcon: true,
        //         url: '/order/shipment'
        //     });
        // }
        if (this.MenuItems.indexOf('GateTransaction') >= 0) {
            this.children.push({
                id: 'gateEntry',
                title: 'Gate Entry',
                translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                icon: 'shipment',
                isSvgIcon: true,
                url: '/gateTransaction/gateentry'
            });
        }
        // if (this.MenuItems.indexOf('OrderAcknowledgment') >= 0) {
        //     this.children.push({
        //         id: 'orderAcknowledgment',
        //         title: 'Order Acknowledgment',
        //         translate: 'NAV.SAMPLE.TITLE',
        //         type: 'item',
        //         icon: 'orderIcon',
        //         isSvgIcon: true,
        //         url: '/orderacknowledgment/acknowledgment'
        //     });
        // }
        if (true) {
            this.subChildren2.push(
                {
                    id: 'creation',
                    title: 'Creation',
                    type: 'item',
                    url: '/rfq/creation',
                }
            );
        }
        if (true) {
            this.subChildren2.push(
                {
                    id: 'publish',
                    title: 'Publish & Invite',
                    type: 'item',
                    url: '/rfq/publish',
                }
            );
        }
        if (true) {
            this.subChildren2.push(
                {
                    id: 'evaluation',
                    title: 'Evaluation',
                    type: 'item',
                    url: '/rfq/evaluation',
                }
            );
        }
        if (true) {
            this.subChildren2.push(
                {
                    id: 'awarded',
                    title: 'Awarded',
                    type: 'item',
                    url: '/rfq/awarded',
                }
            );
        }
        if (true) {
            this.children.push({
                id: 'rfq',
                title: 'RFQ',
                // translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                // icon: 'orderIcon',
                isSvgIcon: true,
                children: this.subChildren2
            });
        }
        if (true) {
            this.subChildren3.push(
                {
                    id: 'vendorAssignment',
                    title: 'Vendor Assignment',
                    type: 'item',
                    url: '/documentCollection/vendor_assignment'
                }
            );
        }
        if (true) {
            this.subChildren3.push(
                {
                    id: 'capaAssignment',
                    title: 'CAPA Assignment',
                    type: 'item',
                    url: '/documentCollection/capa_assignment'
                }
            );
        }
        if (true) {
            this.children.push({
                id: 'documentCollection',
                title: 'Document Collection',
                type: 'collapsable',
                children: this.subChildren3
            });
        }
        if (this.MenuItems.indexOf('PaymentReportPO') >= 0) {
            this.subChildren1.push(
                {
                    id: 'paymentReportPO',
                    title: 'PO',
                    type: 'item',
                    url: '/paymentReport/po'
                },
            );
        }
        if (this.MenuItems.indexOf('PaymentReportInvoice') >= 0) {
            this.subChildren1.push(
                {
                    id: 'paymentReportInvoice',
                    title: 'Invoice',
                    type: 'item',
                    url: '/paymentReport/invoice'
                },
            );
        }
        if (this.MenuItems.indexOf('PaymentReportReference') >= 0) {
            this.subChildren1.push(
                {
                    id: 'paymentReportReference',
                    title: 'Reference',
                    type: 'item',
                    url: '/paymentReport/reference'
                }
            );
        }
        if (this.MenuItems.indexOf('PaymentReportPO') >= 0 || this.MenuItems.indexOf('PaymentReportInvoice') >= 0 || this.MenuItems.indexOf('PaymentReportReference') >= 0) {
            this.children.push({
                id: 'paymentReport',
                title: 'Payment Report',
                // translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                icon: 'paymentReport',
                isSvgIcon: true,
                children: this.subChildren1
            }
            );
        }
        if (this.MenuItems.indexOf('App') >= 0) {
            this.subChildren.push({
                id: 'menuapp',
                title: 'App',
                type: 'item',
                url: '/master/menuApp'
            });
        }
        if (this.MenuItems.indexOf('Role') >= 0) {
            this.subChildren.push({
                id: 'role',
                title: 'Role',
                type: 'item',
                url: '/master/role'
            });
        }
        if (this.MenuItems.indexOf('User') >= 0) {
            this.subChildren.push({
                id: 'user',
                title: 'User',
                type: 'item',
                url: '/master/user'
            });
        }
        if (this.MenuItems.indexOf('UserPreference') >= 0) {
            this.subChildren.push({
                id: 'user',
                title: 'Preference',
                type: 'item',
                url: '/master/userPreference'
            });
        }
        if (this.MenuItems.indexOf('App') >= 0 || this.MenuItems.indexOf('Role') >= 0 || this.MenuItems.indexOf('User') >= 0 || this.MenuItems.indexOf('UserPreference')) {
            this.children.push({
                id: 'master',
                title: 'Master',
                // translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                icon: 'master',
                isSvgIcon: true,
                children: this.subChildren
            });
        }
        this.navigation.push({
            id: 'applications',
            // title: '',
            title: '',
            translate: 'NAV.APPLICATIONS',
            type: 'group',
            children: this.children
        });
        // Saving local Storage
        localStorage.setItem('menuItemsData', JSON.stringify(this.navigation));
        // Update the service in order to update menu
        this._menuUpdationService.PushNewMenus(this.navigation);
    }
}
