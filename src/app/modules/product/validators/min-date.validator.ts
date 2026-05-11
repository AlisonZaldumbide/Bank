import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selected = control.value;
    const [year, month, day] = selected.split('-').map(Number);

    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();

    const selectedTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    return selectedTime >= todayTime ? null : { minDate: true };
}
