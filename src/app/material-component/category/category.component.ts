import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { DialogCategoryComponent } from '../dialog/dialog-category/dialog-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild('loader') loader!: ElementRef;

  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;
  loading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.loading = true;
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }, (error: any) => {
      setTimeout(() => {
        this.loading = false;
      }, 500);
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
    const dialogRef = this.dialog.open(DialogCategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
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
    const dialogRef = this.dialog.open(DialogCategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
      this.tableData();
    })
  }

  onChange(status: any, id: any) {
    this.loading = true;
    var data = {
      status: status.toString(),
      id: id
    }

    this.categoryService.update(data).subscribe((response: any) => {
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
}
