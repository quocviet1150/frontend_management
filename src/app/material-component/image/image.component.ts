import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { Router } from '@angular/router';
import { UploadImageComponent } from '../dialog/upload-image/upload-image.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  imageData: any[] | undefined;
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private imageService: UploadImageService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getImage();
  }

  getImage() {
    this.loading = true;
    this.imageService.getImageDataAll().subscribe((response: any) => {
      this.imageData = response;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }, (error: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 500);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    }
    );
  }

  onChange(status: any, id: any) {
    this.loading = true;
    var data = {
      status: status,
      id: id
    }

    this.imageService.updateStatus(data).subscribe((response: any) => {
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
      setTimeout(() => {
        this.loading = false;
      }, 200);
    }, (error: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  handleDelete(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' xóa sản phẩm ' + values.name,
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitstatusChange.subscribe((response) => {
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any) {
    this.loading = true
    this.imageService.delete(id).subscribe((response: any) => {
      this.getImage();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, 'success')
      setTimeout(() => {
        this.loading = false;
      }, 200);
    }, (error: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 200);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  handleAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Thêm mới'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(UploadImageComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddImage.subscribe((response) => {
      this.getImage();
    })

  }

}
