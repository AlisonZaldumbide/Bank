import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ModalConfig } from '../models/modal-config.model';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  public visible: boolean;
  public modalConfig!: ModalConfig;

  constructor(
    private readonly _modalSvc: ModalService,
    private readonly _changeDetector: ChangeDetectorRef,
  ) {
    this.visible = false;
  }

  ngOnInit(): void {
    this._modalSvc.onRequest().subscribe(config => {
      this.modalConfig = config;
      this.visible = true;
      this._changeDetector.detectChanges();
    });
  }

  onConfirm(): void {
    this._modalSvc.confirm();
    this.visible = false;
    this._changeDetector.detectChanges();
  }

  onCancel(): void {
    this._modalSvc.cancel();
    this.visible = false;
    this._changeDetector.detectChanges();
  }
}