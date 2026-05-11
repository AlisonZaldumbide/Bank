import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';
import { of } from 'rxjs';
import { ModalConfig } from '../models/modal-config.model';

describe('ModalComponent', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let modalServiceMock: jest.Mocked<ModalService>;
    let detectChangesSpy: jest.SpyInstance;

    const mockModalConfig: ModalConfig = {
        title: 'Confirmar acción',
        confirmTitle: 'Aceptar',
        cancelTitle: 'Cancelar',
        type: 'Info'
    };

    beforeEach(async () => {
        modalServiceMock = {
            onRequest: jest.fn().mockReturnValue(of(mockModalConfig)),
            confirm: jest.fn(),
            cancel: jest.fn(),
            open: jest.fn()
        } as unknown as jest.Mocked<ModalService>;

        await TestBed.configureTestingModule({
            declarations: [ModalComponent],
            providers: [
                { provide: ModalService, useValue: modalServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;

        detectChangesSpy = jest.spyOn(
            component['_changeDetector'],
            'detectChanges'
        );

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should show modal and assign config on init', fakeAsync(() => {
        tick();
        expect(modalServiceMock.onRequest).toHaveBeenCalled();
        expect(component.visible).toBe(true);
        expect(component.modalConfig).toEqual(mockModalConfig);
        expect(detectChangesSpy).toHaveBeenCalled();
    }));

    it('should call confirm and hide modal on confirm', fakeAsync(() => {
        tick();
        component.onConfirm();
        expect(modalServiceMock.confirm).toHaveBeenCalled();
        expect(component.visible).toBe(false);
        expect(detectChangesSpy).toHaveBeenCalled();
    }));

    it('should call cancel and hide modal on cancel', fakeAsync(() => {
        tick();
        component.onCancel();
        expect(modalServiceMock.cancel).toHaveBeenCalled();
        expect(component.visible).toBe(false);
        expect(detectChangesSpy).toHaveBeenCalled();
    }));
});
