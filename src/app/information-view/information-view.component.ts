import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { forkJoin } from 'rxjs';
import { InformationComponent } from '../information/information.component';

@Component({
  selector: 'app-information',
  templateUrl: './information-view.component.html',
  styleUrls: ['./information-view.component.scss']
})
export class InformationViewComponent implements OnInit {
  @Output() editSuccess: EventEmitter<any> = new EventEmitter();
  @ViewChild('loader') loader!: ElementRef;
  user: any;
  data: any;
  responseMessage: any;
  loading: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  fileName: string | null = null;
  imageSelected: string | ArrayBuffer | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<InformationViewComponent>,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {
    this.user = dialogData.user;
    console.log("data", this.user);


  }

  ngOnInit(): void {
  }

  edit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "30%";
    dialogConfig.disableClose = true;

    this.userService.getUserLogin().subscribe((response: any) => {
      dialogConfig.data = {
        user: response
      };

      const dialogRef = this.dialog.open(InformationComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result === 2) {
          dialogRef.close();
          this.snackbarService.openSnackbar("Chỉnh sửa thông tin thành công", "success");
        } else if (result === 1) {
          dialogRef.close();
          this.snackbarService.openSnackbar("Chỉnh sửa thông tin không thành công", "success");
        }
      });

    });
  }
}


