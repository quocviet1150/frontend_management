import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.scss']
})
export class DialogCategoryComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Thêm mới";
  action: any = "Thêm mới";
  responseMessage: any;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<DialogCategoryComponent>,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    if (this.dialogData.action === 'Chỉnh sửa') {
      this.dialogAction = 'Chỉnh sửa';
      this.action = "Update"
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Chỉnh sửa') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.loading = true;
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }

    this.categoryService.createCategory(data).subscribe((response: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
    }, (error) => {
      this.loading = false;
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

  edit() {
    this.loading = true;
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }

    this.categoryService.update_category(data).subscribe((response: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
    }, (error) => {
      this.loading = false;
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

  get isFormValid() {
    return this.categoryForm.valid && this.categoryForm.dirty;
  }

}
