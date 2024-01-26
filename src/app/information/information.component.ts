import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { forkJoin } from 'rxjs';

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
  selectedImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  fileName: string | null = null;

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

  handleUploadImage() {
    forkJoin([
      this.uploadImage(),
      this.updateUser()
    ]).subscribe(() => {
      console.log('Both uploadImage and updateUser completed successfully.');
    }, (error) => {
      console.error('An error occurred:', error);
    });
  }

  updateUser() {
    this.loading = true;
    var id = this.user.id;
    var data = {
      name: this.user.name,
      contactNumber: this.user.contactNumber
    };
    this.uploadImage();
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

  uploadImage(): void {
    if (this.file) {
      var id = this.user.id;
      this.userService.uploadImage(id, this.file).subscribe(
        (response: any) => {
          this.responseMessage = response.message;
          this.snackbarService.openSnackbar(this.responseMessage, "success");
        },
        (error) => {
          console.log(error);
          this.dialogRef.close();
          if (error.error && error.error.message) {
            this.responseMessage = error.error.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }

          this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
        }
      );
    } else {
      this.responseMessage = GlobalConstants.FileZeroError;
    }
  }

  deleteImage(): void {
    this.selectedImage = null;
    this.fileName = null;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

    onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.readAndPreviewImage(file);
    } else {
      this.file = null;
      this.selectedImage = null;
    }
  }

  readAndPreviewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.selectedImage = e.target.result;
        this.file = file;
        this.fileName = file.name;
      }
    };
    reader.readAsDataURL(file);
  }


}
