import { FormControl, FormGroup } from '@angular/forms';
import { revisionDateValidator } from './revision-date.validator';

describe('revisionDateValidator', () => {
  it('should return null when revision date is exactly one year later', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-05-11'),
      date_revision: new FormControl('2026-05-11')
    }, { validators: revisionDateValidator });

    expect(form.errors).toBeNull();
  });

  it('should return error when revision date is not exactly one year later', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-05-11'),
      date_revision: new FormControl('2026-05-10')
    }, { validators: revisionDateValidator });

    expect(form.errors).toEqual({ revisionDateInvalid: true });
  });
});
