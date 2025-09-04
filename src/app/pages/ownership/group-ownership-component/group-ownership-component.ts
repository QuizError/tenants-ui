import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { OwnershipService } from '../../../services/ownership-service';

@Component({
  selector: 'app-group-ownership-component',
  imports: [],
  templateUrl: './group-ownership-component.html',
  styleUrl: './group-ownership-component.css'
})
export class GroupOwnershipComponent implements OnInit{

  constructor(private router:Router, private ownershipService: OwnershipService, private cdr: ChangeDetectorRef){}

  user:any;

  groupsData:any;

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser)

      const cachedGroups = localStorage.getItem('userGroups');

      if (cachedGroups) {
        this.groupsData = JSON.parse(cachedGroups);
      }
      this.getMyGroups(this.user.uid)
    }
  }


  getMyGroups(uid:string){
    this.ownershipService.getMyGroupsByUserUid(uid).subscribe(res=>{
      this.groupsData = res; 
      console.log(this.groupsData)
      console.log(this.groupsData.length)
      localStorage.setItem('userGroups',JSON.stringify(this.groupsData))
      this.cdr.detectChanges();
    })
  }

}
