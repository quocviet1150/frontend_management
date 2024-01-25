import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'createdDate', 'paymentMethod', 'total', 'view'];
  dataSource: any = [];
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private billService: BillService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.tableData();
  }

  tableData() {
    this.loading = true;
    this.billService.getBill().subscribe((response: any) => {
      response.forEach((bill: any) => {
        const createdDate = new Date(bill.createdDate);
        const formattedDate = this.formatDate(createdDate);
        bill.createdDate = formattedDate;
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

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
  }

  handleDeleteAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' xóa hóa đơn' + value.name,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent);
    const sub = dialogRef.componentInstance.onEmitstatusChange.subscribe((response) => {
      this.deleteBill(value.id);
      dialogRef.close();
    })

  }

  deleteBill(id: any) {
    this.loading = true
    this.billService.delete(id).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success")
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, (error: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 300);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  handleDowloadAction(value: any) {
    this.loading = true
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.total.toString(),
      productDetail: value.productDetail,
    }
    this.downloadFile(value.uuid, data)
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  downloadFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((response) => {
      saveAs(response, fileName + '.pdf');
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
