import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function toDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export const revisionDateValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const release = group.get('date_release')?.value;
  const revision = group.get('date_revision')?.value;

  if (!release || !revision) {
    return null;
  }

  const releaseDate = toDateOnly(release);
  const revisionDate = toDateOnly(revision);
  const expectedDate = new Date(releaseDate);
  expectedDate.setFullYear(expectedDate.getFullYear() + 1);

  const expectedValue = expectedDate.getTime();
  return revisionDate.getTime() === expectedValue ? null : { revisionDateInvalid: true };
};
