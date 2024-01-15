import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../shared/global-constants';
import { UploadImageService } from '../services/upload-image.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {

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
