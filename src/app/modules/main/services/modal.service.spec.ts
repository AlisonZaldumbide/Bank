import { ModalService } from './modal.service';
import { ModalConfig } from '../components/models/modal-config.model';
import { take } from 'rxjs/operators';

describe('ModalService', () => {
    let service: ModalService;

    const mockConfig: ModalConfig = {
        title: 'Confirmación',
        confirmTitle: 'Sí',
        cancelTitle: 'No',
        type: 'Info'
    };

    beforeEach(() => {
        service = new ModalService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit a modal request when open is called', (done) => {
        service.onRequest().pipe(take(1)).subscribe(config => {
            expect(config).toEqual(mockConfig);
            done();
        });

        service.open(mockConfig);
    });

    it('should return true when confirm is called', (done) => {
        const response$ = service.open(mockConfig);

        response$.subscribe(response => {
            expect(response).toBe(true);
            done();
        });

        service.confirm();
    });

    it('should return false when cancel is called', (done) => {
        const response$ = service.open(mockConfig);

        response$.subscribe(response => {
            expect(response).toBe(false);
            done();
        });

        service.cancel();
    });

    it('should complete the observable after confirm', (done) => {
        const response$ = service.open(mockConfig);

        let completed = false;

        response$.subscribe({
            next: () => { },
            complete: () => {
                completed = true;
                expect(completed).toBe(true);
                done();
            }
        });

        service.confirm();
    });

    it('should complete the observable after cancel', (done) => {
        const response$ = service.open(mockConfig);

        let completed = false;

        response$.subscribe({
            next: () => { },
            complete: () => {
                completed = true;
                expect(completed).toBe(true);
                done();
            }
        });

        service.cancel();
    });
});
