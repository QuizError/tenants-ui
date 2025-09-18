import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-layouts-component',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NgIf],
  templateUrl: './layouts-component.html',
  styleUrls: ['./layouts-component.css']
})
export class LayoutsComponent implements OnInit {

  user: any;
  isInternalUser: boolean = false;

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.isInternalUser = this.user?.userType === 'INTERNAL';
    }
  }
}
