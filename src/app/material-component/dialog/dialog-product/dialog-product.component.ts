import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrls: ['./dialog-product.component.scss']
})
export class DialogProductComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = "Thêm mới";
  action: any = "Thêm mới";
  responseMessage: any;
  categorys: any = [];
  loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<DialogProductComponent>,
    private snackbarService: SnackbarService,) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      description: [null, [Validators.required]],
      quantity_product: [null, [Validators.required]],
      price: [null, [Validators.required]],
      createdDate: []
    });
    if (this.dialogData.action === 'Chỉnh sửa') {
      this.dialogAction = 'Chỉnh sửa';
      this.action = "Chỉnh sửa"
      this.productForm.patchValue(this.dialogData.data);
    }
      this.getCategory();

  }

  getCategory() {
    this.loading = true
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.categorys = response;
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this.dialogRef.close();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  handleSubmit() {
    if (this.dialogAction === 'Chỉnh sửa') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.loading = true
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      quantity_product: formData.quantity_product,
    }

    this.productService.createProduct(data).subscribe((response: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.onAddProduct.emit();
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
    this.loading = true
    var formData = this.productForm.value;
    const createdDate = this.dialogData.data.createdDate;
    debugger
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      createdDate: createdDate,
      quantity_product: formData.quantity_product,
    }

    this.productService.updateProduct(data).subscribe((response: any) => {
      this.loading = false;
      this.dialogRef.close();
      this.onEditProduct.emit();
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
    return this.productForm.valid && this.productForm.dirty;
  }

}
