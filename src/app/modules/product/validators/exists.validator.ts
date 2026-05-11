import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

export function existsValidator(_svc: ProductService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(id =>
                _svc.getIdExists(id).pipe(
                    map(exists => (exists ? { idExists: true } : null)),
                    catchError(() => of(null))
                )
            )
        );
    };
}
