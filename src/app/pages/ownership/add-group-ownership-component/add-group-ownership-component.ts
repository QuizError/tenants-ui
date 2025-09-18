import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwnershipService } from '../../../services/ownership-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-property-component',
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-ownership-component.html',
  styleUrl: './add-group-ownership-component.css'
})
export class AddGroupOwnershipComponent implements OnInit {

  addGroupForm: FormGroup

  ownershipData: any

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private ownershipService: OwnershipService){
    this.addGroupForm = fb.group({
      name:[''],
      ownershipType:[''],
    })
  }

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
    }
  }

  onSubmit(){
    this.ownershipService.postGroupOwnershipData(this.addGroupForm.value).subscribe(res=>{
      this.router.navigateByUrl('groups')
    })
  }

  onCancel(){
    this.router.navigateByUrl('groups')
  }
}
