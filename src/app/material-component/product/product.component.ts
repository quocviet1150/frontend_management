import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { DialogProductComponent } from '../dialog/dialog-product/dialog-product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  displayedColumns: string[] = ['name', 'categoryName', 'description', 'createdDate', 'updateDate', "quantity_product", 'price', 'edit']
  dataSource: any;
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.loading = true;
    this.productService.getProducts().subscribe((response: any) => {
      response.forEach((product: any) => {
        const createdDate = new Date(product.createdDate);
        const formattedDate = this.formatDate(createdDate);
        product.createdDate = formattedDate;

        const updateDate = new Date(product.updateDate);
        const formattedDate2 = this.formatDate(updateDate);
        product.updateDate = formattedDate2;

        if (product.quantity_product === 0) {
          product.quantity_product = 'Hết hàng';
        }
      });
      this.dataSource = new MatTableDataSource(response);
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
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Thêm mới'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(DialogProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response) => {
      this.tableData();
    })

  }

  handleEdit(values: any) {

    if (values.quantity_product === 'Hết hàng') {
      values.quantity_product = 0;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Chỉnh sửa',
      data: values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(DialogProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.tableData();
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
    this.productService.delete(id).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, 'success')
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
    })
  }

  onChange(status: any, id: any) {
    this.loading = true
    var data = {
      status: status.toString(),
      id: id
    }

    this.productService.updateStatus(data).subscribe((response: any) => {
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

}
