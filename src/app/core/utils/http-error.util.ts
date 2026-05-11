import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../modules/product/models/api-error.model';

export function mapHttpError(error: HttpErrorResponse): ApiError {
  return {
    name: error.error?.name || 'UnknownError',
    message: error.error?.message || 'Unexpected error occurred.',
    errors: error.error?.errors || null
  };
}
