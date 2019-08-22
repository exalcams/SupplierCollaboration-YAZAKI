import { Component, OnDestroy, OnInit, ViewEncapsulation, Compiler, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MasterService } from 'app/services/master.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails, UserNotification, ChangePassword } from 'app/models/master';
import { ChangePassDialogComponent } from './change-pass-dialog/change-pass-dialog.component';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy, OnChanges {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    CurrentLoggedInUser: string;
    CurrentLoggedInUserProfile: string;
    authenticationDetails: AuthenticationDetails;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    NotificationCount: number;
    AllNotificationByUserID: UserNotification[] = [];
    SetIntervalID: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _router: Router,
        private _authService: AuthService,
        private _compiler: Compiler,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private _masterService: MasterService
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;
        this.authenticationDetails = new AuthenticationDetails();
        this.CurrentLoggedInUser = 'Support';
        this.CurrentLoggedInUserProfile = 'assets/images/avatars/support.png';
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });

        // Retrive authorizationData
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.CurrentLoggedInUser = this.authenticationDetails.displayName;
            // if (this.authenticationDetails.profile && this.authenticationDetails.profile !== 'Empty') {
            //     this.CurrentLoggedInUserProfile = this.authenticationDetails.profile;
            // }
        }

        // Getting Notification
        this.GetAllNotificationByUserID();

        // this.SetIntervalID = setInterval(() => {
        //     this.GetAllNotificationByUserID();
        // }, 10000);
        this._masterService.GetNotification().subscribe(
            (data) => {
                this.GetAllNotificationByUserID();
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    GetAllNotificationByUserID(): void {
        if (this.authenticationDetails.userID) {
            this._masterService.GetAllNotificationByUserID(this.authenticationDetails.userID.toString()).subscribe(
                (data) => {
                    this.AllNotificationByUserID = data as UserNotification[];
                    this.NotificationCount = this.AllNotificationByUserID.length;
                },
                (err) => {
                    console.error(err);
                }
            );

        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const retrievedObject = localStorage.getItem('authorizationData');
        this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
        this.CurrentLoggedInUser = this.authenticationDetails.displayName;
        console.log(this.authenticationDetails);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    UpdateNotification(SelectedNotification: UserNotification): void {
        if (SelectedNotification) {
            SelectedNotification.HasSeen = true;
            this._masterService.UpdateNotification(SelectedNotification).subscribe(
                (data) => {
                    // console.log('success');
                    this.GetAllNotificationByUserID();
                },
                (err) => {
                    console.error(err);
                }
            );
        }
    }

    logOutClick(): void {
        this._authService.SignOut(this.authenticationDetails.userID).subscribe(
            (data) => {
                localStorage.removeItem('authorizationData');
                localStorage.removeItem('menuItemsData');
                localStorage.removeItem('userPreferenceData');
                this._compiler.clearCache();
                this._router.navigate(['auth/login']);
                this.notificationSnackBarComponent.openSnackBar('Signed out successfully', SnackBarStatus.success);
            },
            (err) => {
                console.error(err);
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
        );
        // this._router.navigate(['auth/login']);
        // this.notificationSnackBarComponent.openSnackBar('Signed out successfully', SnackBarStatus.success);
    }

    ChangePasswordClick(): void {
        // this._router.navigate(['auth/changePassword']);
        const dialogConfig: MatDialogConfig = {
            data: null,
            panelClass: 'change-pass-dialog'
        };
        const dialogRef = this.dialog.open(ChangePassDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    const changePassword = result as ChangePassword;
                    changePassword.UserID = this.authenticationDetails.userID;
                    changePassword.UserName = this.authenticationDetails.userName;
                    this._authService.ChangePassword(changePassword).subscribe(
                        (res) => {
                            console.log(res);
                            this.notificationSnackBarComponent.openSnackBar('Password updated successfully, please log with new password', SnackBarStatus.success);
                            localStorage.removeItem('authorizationData');
                            localStorage.removeItem('menuItemsData');
                            this._compiler.clearCache();
                            this._router.navigate(['auth/login']);
                        }, (err) => {
                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                            // this._router.navigate(['/auth/login']);
                            console.error(err);
                        }
                    );
                }
            });
    }
}
