import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalConfig } from '../components/models/modal-config.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRequest = new Subject<ModalConfig>();
  private modalResponse = new Subject<boolean>();

  open(config: ModalConfig): Observable<boolean> {
    this.modalResponse = new Subject<boolean>();

    this.modalRequest.next(config);
    return this.modalResponse.asObservable();
  }

  onRequest(): Observable<ModalConfig> {
    return this.modalRequest.asObservable();
  }

  confirm() {
    this.modalResponse.next(true);
    this.modalResponse.complete();
  }

  cancel() {
    this.modalResponse.next(false);
    this.modalResponse.complete();
  }
}