import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {

  onEdit = new EventEmitter();
  userForm: any = FormGroup;
  dialogAction: any = "Chỉnh sửa quyền người dùng";
  action: any = "Chỉnh sửa quyền người dùng";
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogUserComponent>,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      role: [null, [Validators.required]],
    });

    if (this.dialogData.action === 'Chỉnh sửa quyền người dùng') {
      this.dialogAction = 'Chỉnh sửa quyền người dùng';
      this.action = "Chỉnh sửa quyền người dùng"
      this.userForm.patchValue(this.dialogData.data);
    }

  }

  handleSubmit() {
    this.edit();
  }

  edit() {
    var formData = this.userForm.value;
    var data = {
      id: this.dialogData.data.id,
      role: formData.role,
    }

    this.userService.updateRole(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEdit.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
    }, (error) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

}
