import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { forkJoin } from 'rxjs';

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
  ) {
    this.user = dialogData.user;
    console.log("data", this.user);


  }

  ngOnInit(): void {
  }
}


