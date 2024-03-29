import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { DialogUserComponent } from '../dialog/dialog-user/dialog-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  displayedColumns: string[] = ['name', 'userName', 'contactNumber', 'createdDate', 'role', 'status'];
  dataSource: any = [];
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.loading = true
    this.userService.getUsers().subscribe((response: any) => {
      response.forEach((user: any) => {
        const createdDate = new Date(user.createdDate);
        const formattedDate = this.formatDate(createdDate);
        user.createdDate = formattedDate;
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

  onChange(status: any, id: any) {
    this.loading = true
    var data = {
      status: status.toString(),
      id: id
    }

    this.userService.update(data).subscribe((response: any) => {
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage, "success");
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
      message: ' xóa người dùng ' + values.name,
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitstatusChange.subscribe((response) => {
      this.deleteUser(values.id);
      dialogRef.close();
    })
  }

  deleteUser(id: any) {
    this.loading = true
    this.userService.delete(id).subscribe((response: any) => {
      this.tableData();
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

  handleEdit(values: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Chỉnh sửa quyền người dùng',
      data: values
    };
    dialogConfig.width = "550px";
    const dialogRef = this.dialog.open(DialogUserComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEdit.subscribe((response) => {
      this.tableData();
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
