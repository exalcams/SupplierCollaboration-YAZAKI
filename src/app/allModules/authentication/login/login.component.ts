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
import { AuthenticationDetails } from 'app/models/master';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    navigation: FuseNavigation[] = [];
    authenticationDetails: AuthenticationDetails;
    MenuItems: string[];
    children: FuseNavigation[] = [];
    subChildren: FuseNavigation[] = [];
    private _unsubscribeAll: Subject<any>;
    message = 'Snack Bar opened.';
    actionButtonLabel = 'Retry';
    action = true;
    setAutoHide = true;
    autoHide = 2000;

    addExtraClass: false;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;

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

        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = false;
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    LoginClicked(): void {
        if (this.loginForm.valid) {
            this.IsProgressBarVisibile = true;
            this._authService.login(this.loginForm.get('userName').value, this.loginForm.get('password').value).subscribe(
                data => {
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
        if (this.MenuItems.indexOf('AdvanceShipment') >= 0) {
            this.children.push({
                id: 'advanceShipment',
                title: 'Advance Shipment',
                translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                icon: 'shipment',
                isSvgIcon: true,
                url: '/order/shipment'
            });
        }
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
        if (this.MenuItems.indexOf('OrderAcknowledgment') >= 0) {
            this.children.push({
                id: 'orderAcknowledgment',
                title: 'Order Acknowledgment',
                translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                icon: 'orderIcon',
                isSvgIcon: true,
                url: '/orderacknowledgment/acknowledgment'
            });
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

        if (this.MenuItems.indexOf('App') >= 0 || this.MenuItems.indexOf('Role') >= 0 || this.MenuItems.indexOf('User') >= 0) {
            this.children.push({
                id: 'master',
                title: 'Master',
                // translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                // icon: 'orderIcon',
                isSvgIcon: true,
                children: this.subChildren
            });
        }
        if (true) {
            this.children.push(
                {
                    id: 'prvendor',
                    title: 'PR Screen (Vendor)',
                    translate: 'NAV.SAMPLE.TITLE',
                    type: 'item',
                    icon: 'orderIcon',
                    isSvgIcon: true,
                    url: '/pages/prvendor',
                }
            );
        }
        if (true) {
            this.children.push(
                {
                    id: 'rfq',
                    title: 'RFQ Screen',
                    translate: 'NAV.SAMPLE.TITLE',
                    type: 'item',
                    icon: 'orderIcon',
                    isSvgIcon: true,
                    url: '/pages/rfq',
                }
            );
        }
        if (true) {
            this.children.push(
                {
                    id: 'supplierInvite',
                    title: 'Supplier Invite',
                    translate: 'NAV.SAMPLE.TITLE',
                    type: 'item',
                    icon: 'orderIcon',
                    isSvgIcon: true,
                    url: '/pages/supplierInvite',
                }
            );
        }
        if (true) {
            this.children.push(
                {
                    id: 'vendorcomparison',
                    title: 'Vendor comparison',
                    translate: 'NAV.SAMPLE.TITLE',
                    type: 'item',
                    icon: 'orderIcon',
                    isSvgIcon: true,
                    url: '/pages/vendorcomparison',
                }
            );
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
