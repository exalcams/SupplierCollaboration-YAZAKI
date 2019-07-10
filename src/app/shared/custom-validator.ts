import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidator {
    static confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const password = control.parent.get('newPassword');
        const confirmPassword = control.parent.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (confirmPassword.value === '') {
            return null;
        }

        if (password.value === confirmPassword.value) {
            return null;
        }

        return { 'passwordsNotMatching': true };
    }

}
