import { Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit']
  dataSource: any;
  responseMessage: any;
  length1: any;
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
    this.productService.getProducts().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
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
    this.productService.delete(id).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, 'success')
    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id
    }

    this.productService.updateStatus(data).subscribe((response: any) => {
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

}
