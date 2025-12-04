import { Component, input, output } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-close-dialog',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './close-dialog.html',
  styleUrl: './close-dialog.css'
})
export class CloseDialog {

  title = input<string>();
  closeModal = output();

  onclose(){
    this.closeModal.emit()
  }
}
