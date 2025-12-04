import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CloseDialog } from "../close-dialog/close-dialog";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notice-view',
  imports: [MatButtonModule, MatIcon, CloseDialog],
  templateUrl: './notice-view.html',
  styleUrl: './notice-view.css'
})
export class NoticeView {
  readonly dialogRef = inject(MatDialogRef<NoticeView>);
  readonly notice = inject(MAT_DIALOG_DATA)

  title = signal<string>(undefined);

  onclose(){
    this.dialogRef.close({
      ...this.notice,
      msg: 'closed'
    });
  }

}
