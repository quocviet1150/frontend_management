import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  oldPassword = true;
  newPassword = true;
  confirmPassword = true;
  changePasswordForm: any = FormGroup;
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackbarService: SnackbarService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    })
  }

  validateSubmit(): boolean {
    return this.changePasswordForm.controls['newPassword'].value !== this.changePasswordForm.controls['confirmPassword'].value;
  }

  handlePassword() {
    this.loading = true;
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }

    this.userService.changePassword(data).subscribe((response: any) => {
      this.loading = false;
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage, "success");
      this.router.navigate(['/']);
    }, (error) => {
      this.loading = false;
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
      }

    })

  }

  get isFormValid() {
    return this.changePasswordForm.valid && this.changePasswordForm.dirty;
  }

}
