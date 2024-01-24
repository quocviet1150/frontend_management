import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver'
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  responseMessage: any;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  billForm: any = FormGroup;

  constructor(
    private billService: BillService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategorys();
    this.billForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    })

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cancelOrder();
      });
  }

  getCategorys() {
    this.categoryService.getFilteredCategorys().subscribe((response: any) => {
      this.categorys = response;
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    })
  }

  getProductsByCategory(value: any) {
    console.log('tesst');

    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.billForm.controls['price'].setValue('');
      this.billForm.controls['quantity'].setValue('');
      this.billForm.controls['total'].setValue('');
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    })
  }

  getProductDetails(value: any) {
    this.productService.getProductsById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.billForm.controls['price'].setValue(response.price);
      this.billForm.controls['quantity'].setValue("1");
      this.billForm.controls['total'].setValue(this.price * 1);
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    })
  }

  setQuantity(value: any) {
    var temp = this.billForm.controls['quantity'].value;
    if (temp > 0) {
      this.billForm.controls['total'].setValue(this.billForm.controls['quantity'].value
        * this.billForm.controls['price'].value)
    } else if (temp != '') {
      this.billForm.controls['quantity'].setValue('1');
      this.billForm.controls['total'].setValue(this.billForm.controls['quantity'].value
        * this.billForm.controls['price'].value)
    }
  }

  validateProductAdd() {
    if (this.billForm.controls['total'].value === 0 || this.billForm.controls['total'].value === null || this.billForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.billForm.controls['name'].value === null ||
      this.billForm.controls['contactNumber'].value === null || this.billForm.controls['paymentMethod'].value === null) {
      return true;
    } else {
      return false
    }
  }

  add() {
    var formData = this.billForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);

    if (productName === undefined) {
      const originalQuantity = formData.quantity;

      this.productService.decrementProductQuantity(formData.product.id, formData.quantity).subscribe(
        (response: any) => {
          this.totalAmount = this.totalAmount + formData.total;
          this.dataSource.push({
            id: +formData.product.id,
            name: formData.product.name,
            category: formData.category.name,
            quantity: originalQuantity, // Sử dụng số lượng trước khi giảm
            price: formData.price,
            total: +formData.total
          });
          this.dataSource = [...this.dataSource];
          this.snackbarService.openSnackbar("Thêm sản phẩm thành công", GlobalConstants.success);
        },
        (error: any) => {
          if (error.status === 400 && error.error?.message === 'Out of stock') {
            this.snackbarService.openSnackbar('Không thể giảm số lượng sản phẩm.', GlobalConstants.error);
          } else {
            this.snackbarService.openSnackbar('Sản phẩm đã hết hàng.', GlobalConstants.error);
          }
        }
      );
    } else {
      this.snackbarService.openSnackbar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  cancelOrder() {
    const quantity = this.dataSource[0]?.quantity || 0;
    const id = this.dataSource[0]?.id;

    this.productService.incrementProductQuantity(id, quantity).subscribe(
      (response: any) => {
        this.totalAmount = 0;
        this.dataSource = [];
        this.snackbarService.openSnackbar('Reset sản phẩm thành công.', GlobalConstants.success);
      },
    );
  }


  handleDeleteAction(value: any, element: any) {
    this.cancelOrder();
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource]
  }

  submitAction() {
    var formData = this.billForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response: any) => {
      this.downloadFile(response?.uuid);
      this.billForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    }, (error: any) => {
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)

    })

  }

 downloadFile(fileName: string) {
  var data = {
    uuid: fileName
  };

  this.billService.getPdf(data).subscribe(
    (response: any) => {
      saveAs(response, fileName + '.pdf');
    },
    (error: any) => {
      console.error('Lỗi khi tải file PDF:', error);
    }
  );
}

}
