import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatRippleModule, MatDialogModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { ChangePassDialogComponent } from './change-pass-dialog/change-pass-dialog.component';

@NgModule({
    declarations: [
        ToolbarComponent,
        ChangePassDialogComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        MatInputModule,
        MatFormFieldModule,
        MatRippleModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        ToolbarComponent
    ],
    entryComponents: [
        ChangePassDialogComponent
    ]
})
export class ToolbarModule {
}
