import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  name: string = '';
  description: string = '';
  file: File | null = null;
  fileName: string | null = null;
  productForm: any = FormGroup;
  shortLink: string = "";
  responseMessage: any;
  onAddImage = new EventEmitter();
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private imageService: UploadImageService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<UploadImageComponent>,) { }

  ngOnInit(): void {

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


  uploadImage(): void {
    if (this.file) {
      this.imageService.uploadImage(this.file, this.name, this.description).subscribe(
        (response: any) => {
          this.onAddImage.emit();
          this.dialogRef.close();
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
      // Handle the case where 'file' is null
      console.error("File is null");
      // Perform additional actions or show a specific error message
    }
  }

  deleteImage(): void {
    // Thực hiện các hành động cần thiết để xóa ảnh
    this.selectedImage = null; // Đặt giá trị của ảnh về null
    this.fileName = null; // Đặt giá trị của tên file về null hoặc giá trị mặc định khác

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ''; 
    }
}
}
