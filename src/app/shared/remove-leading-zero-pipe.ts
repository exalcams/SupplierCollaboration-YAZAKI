import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeLeadingZero' })
export class RemoveLeadingZeroPipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return value.replace(/^0+/, '');
        }
        return '';
    }
}
