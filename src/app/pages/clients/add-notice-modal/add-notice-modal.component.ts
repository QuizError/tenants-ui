import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notice, NoticeType } from '../../../interfaces/notice';

@Component({
  selector: 'app-add-notice-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-notice-modal.component.html',
  styleUrls: ['./add-notice-modal.component.css']
})
export class AddNoticeModalComponent {
  @Input() isVisible = false;
  @Input() rentalUid: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() noticeCreated = new EventEmitter<Partial<Notice>>();

  notice: Partial<Notice> = {
    message: '',
    details: '',
    noticeType: 'General',
    rentalUid: ''
  };

  noticeTypes: NoticeType[] = [
    'Exit', 
    'Warning', 
    'RentArrears', 
    'Termination', 
    'Eviction', 
    'Maintenance', 
    'Entry', 
    'UtilityShutdown', 
    'General', 
    'RentIncrease'
  ];

  ngOnChanges(): void {
    if (this.rentalUid) {
      this.notice.rentalUid = this.rentalUid;
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.noticeCreated.emit({
        ...this.notice,
        rentalUid: this.rentalUid
      });
      this.resetForm();
    }
  }

  private isFormValid(): boolean {
    return !!this.notice.message && 
           !!this.notice.details && 
           !!this.notice.noticeType && 
           !!this.rentalUid;
  }

  private resetForm(): void {
    this.notice = {
      message: '',
      details: '',
      noticeType: 'General',
      rentalUid: this.rentalUid
    };
  }
}
