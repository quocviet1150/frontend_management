import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  imageData: any[] | undefined;
  responseMessage: any;

  constructor(
    private imageService: UploadImageService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.getImage();
  }

  getImage() {
    this.imageService.getImageData().subscribe((response: any) => {
      this.imageData = response;
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    }
    );
  }
}
