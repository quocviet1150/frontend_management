import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { GlobalConstants } from '../shared/global-constants';
import { UploadImageService } from '../services/upload-image.service';
import { SnackbarService } from '../services/snackbar.service';
import * as bootstrap from 'bootstrap';

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
    private renderer: Renderer2, 
    private el: ElementRef
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

  openImageModal(base64Image: string): void {
    const modalImage = this.el.nativeElement.querySelector('#modalImage');
    this.renderer.setAttribute(modalImage, 'src', 'data:image/jpg;base64,' + base64Image);
    this.renderer.setStyle(modalImage, 'width', '500px');
    this.renderer.setStyle(modalImage, 'height', '500px');
    const modal = new bootstrap.Modal(this.el.nativeElement.querySelector('#imageModal'));
    modal.show();
  }

}
