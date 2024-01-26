import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @Output() editSuccess: EventEmitter<any> = new EventEmitter();
  @ViewChild('loader') loader!: ElementRef;
  user: any;
  data: any;
  responseMessage: any;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<InformationComponent>,
    private snackbarService: SnackbarService,
  ) {
    this.user = dialogData.user;

  }

  ngOnInit(): void {
  }

  updateUser() {
    this.loading = true;
    var id = this.user.id;
    var data = {
      name: this.user.name,
      contactNumber: this.user.contactNumber
    };

    this.userService.updateUser(id, data).subscribe((response: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.dialogRef.close('success');
    }, (error) => {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      this.dialogRef.close('error');
    });
  }

}
