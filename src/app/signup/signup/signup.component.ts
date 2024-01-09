import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  password = true;
  confirmPassword = true;
  signupForm: any = FormGroup;
  responseMessage: any;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      userName: [null, [Validators.required, Validators.pattern(GlobalConstants.userNameRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }
  validateSubmit(): boolean {
    return this.signupForm.controls['password'].value !== this.signupForm.controls['confirmPassword'].value;
  }

  handleSubmit() {

    this.loading = true;
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      userName: formData.userName,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe((response: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, "");
      this.router.navigate(['/']);
    }, (error) => {
      this.loading = false;
      if (error.error?.message) {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  get isFormValid() {
    return this.signupForm.valid && this.signupForm.dirty;
  }


}
