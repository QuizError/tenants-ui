import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layouts-component',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layouts-component.html',
  styleUrl: './layouts-component.css'
})
export class LayoutsComponent implements OnInit{

  user:any;

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

}
