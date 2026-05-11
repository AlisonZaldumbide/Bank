import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { existsValidator } from './exists.validator';

describe('existsValidator', () => {
    let mockService: any;

    beforeEach(() => {
        mockService = {
            getIdExists: jest.fn()
        };
    });

    it('should return null if control value is empty', (done) => {
        const validator = existsValidator(mockService);
        const control = new FormControl('');
        (validator(control) as import('rxjs').Observable<any>).subscribe(result => {
            expect(result).toBeNull();
            expect(mockService.getIdExists).not.toHaveBeenCalled();
            done();
        });
    });

    it('should return validation error if id exists', (done) => {
        mockService.getIdExists.mockReturnValue(of(true));

        const validator = existsValidator(mockService);
        const control = new FormControl('existing-id');

        (validator(control) as import('rxjs').Observable<any>).subscribe(result => {
            expect(result).toEqual({ idExists: true });
            expect(mockService.getIdExists).toHaveBeenCalledWith('existing-id');
            done();
        });
    });

    it('should return null if id does not exist', (done) => {
        mockService.getIdExists.mockReturnValue(of(false));

        const validator = existsValidator(mockService);
        const control = new FormControl('new-id');

        (validator(control) as import('rxjs').Observable<any>).subscribe(result => {
            expect(result).toBeNull();
            expect(mockService.getIdExists).toHaveBeenCalledWith('new-id');
            done();
        });
    });

    it('should return null if service throws error', (done) => {
        mockService.getIdExists.mockReturnValue(throwError(() => new Error('Error de red')));

        const validator = existsValidator(mockService);
        const control = new FormControl('error-id');

        (validator(control) as import('rxjs').Observable<any>).subscribe(result => {
            expect(result).toBeNull();
            expect(mockService.getIdExists).toHaveBeenCalledWith('error-id');
            done();
        });
    });
});
