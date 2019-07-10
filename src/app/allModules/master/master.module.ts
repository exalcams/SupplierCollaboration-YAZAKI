import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule } from '@fuse/components';
import { FileUploadModule } from 'ng2-file-upload';
import { MenuAppComponent } from './menu-app/menu-app.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { UserSideBarComponent } from './user/user-side-bar/user-side-bar.component';
import { UserMainContentComponent } from './user/user-main-content/user-main-content.component';
import { RoleSideBarComponent } from './role/role-side-bar/role-side-bar.component';
import { RoleMainContentComponent } from './role/role-main-content/role-main-content.component';
import { MenuAppSideBarComponent } from './menu-app/menu-app-side-bar/menu-app-side-bar.component';
import { MenuAppMainContentComponent } from './menu-app/menu-app-main-content/menu-app-main-content.component';

const menuRoutes: Routes = [
    {
        path: 'menuApp',
        component: MenuAppComponent,
    },
    {
        path: 'role',
        component: RoleComponent,
    },
    {
        path: 'user',
        component: UserComponent,
    },
];
@NgModule({
    declarations: [
       UserComponent,
       UserSideBarComponent,
       UserMainContentComponent,
       RoleComponent,
       RoleSideBarComponent,
       RoleMainContentComponent,
       MenuAppComponent,
       MenuAppSideBarComponent,
       MenuAppMainContentComponent,
    ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        FuseSharedModule,
        FileUploadModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [

    ]
})
export class MasterModule {
}

