import { AbstractControl } from '@angular/forms';

export function ValidateReference(control: AbstractControl): { [s: string]: boolean } {
    if (control.value.includes('Select process')) {
        return { validReference: true };
    }
    return null;
}
