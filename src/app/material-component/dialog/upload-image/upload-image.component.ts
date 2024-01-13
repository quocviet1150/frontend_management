import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  productForm: any = FormGroup;
  shortLink: string = "";
  responseMessage: any;

  constructor(private imageService: UploadImageService, private formBuilder: FormBuilder, private snackbarService: SnackbarService,) { }

  ngOnInit(): void {

  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }


  uploadImage(): void {
    if (this.file) {
      this.imageService.uploadImage(this.file, this.name, this.description).subscribe(
        (response: any) => {
          this.responseMessage = response.message;
          this.snackbarService.openSnackbar(this.responseMessage, "success");
        },
        (error) => {
          console.log(error);
  
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
}