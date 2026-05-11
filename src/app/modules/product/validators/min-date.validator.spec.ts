import { FormControl } from '@angular/forms';
import { minDateValidator } from './min-date.validator';

describe('minDateValidator', () => {

    it('should return null if control value is null', () => {
        const control = new FormControl(null);
        const result = minDateValidator(control);
        expect(result).toBeNull();
    });

    it('should return null if selected date is today', () => {
        const today = new Date();
        const formatted = today.toISOString().split('T')[0];
        const control = new FormControl(formatted);
        const result = minDateValidator(control);
        expect(result).toBeNull();
    });

    it('should return null if selected date is in the future', () => {
        const future = new Date();
        future.setDate(future.getDate() + 5);
        const formatted = future.toISOString().split('T')[0];
        const control = new FormControl(formatted);
        const result = minDateValidator(control);
        expect(result).toBeNull();
    });

    it('should return error if selected date is in the past', () => {
        const past = new Date();
        past.setDate(past.getDate() - 1);
        const formatted = past.toISOString().split('T')[0];
        const control = new FormControl(formatted);
        const result = minDateValidator(control);
        expect(result).toEqual({ minDate: true });
    });
});
