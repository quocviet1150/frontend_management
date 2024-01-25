import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  hide = true;
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<LoginComponent>,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required, Validators.pattern(GlobalConstants.userNameRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    var formData = this.loginForm.value;
    var data = {
      userName: formData.userName,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) => {
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      this.router.navigate(['/vietnq/dashboard']);
    }, (error) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }


  get isFormValid() {
    return this.loginForm.valid && this.loginForm.dirty;
  }

}
