import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnershipService } from '../../../services/ownership-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { group } from '@angular/animations';

@Component({
  selector: 'app-update-group-ownership-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-group-ownership-component.html',
  styleUrls: ['./update-group-ownership-component.css']
})
export class UpdateGroupOwnershipComponent implements OnInit {

  updateGroupForm: FormGroup
  
    groupData: any
  
  
    groupUid: { uid: string} = {uid : ''}
  
    constructor(
      private router: Router, 
      private activatedReoute: ActivatedRoute, 
      private fb: FormBuilder,
      private ownershipService: OwnershipService){
      this.updateGroupForm = fb.group({
        uid:[''],
        name:[''],
        ownershipType:[''],
      })
    }
  
    user:any;
  
    groupsData:any;
  
      ngOnInit(): void {
  
        this.groupUid = {
          uid : this.activatedReoute.snapshot.params['uid']
        }
  
        this.ownershipService.getGroupOwnershipByUid(this.groupUid.uid).subscribe(group => {
          this.groupData = group;
  
          this.updateGroupForm.setValue({
            uid: this.groupData.data.uid,
            name: this.groupData.data.name,
            ownershipType: this.groupData.data.ownershipType,
          })
        })
  
      const savedUser = localStorage.getItem('employeeApp');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  
  
  
    onSubmit(){
      this.ownershipService.postGroupOwnershipData(this.updateGroupForm.value).subscribe(res=>{
        this.router.navigateByUrl('groups')
      })
    }
  
    onCancel(){
      this.router.navigateByUrl('groups')
    }
  }