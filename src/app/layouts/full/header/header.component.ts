import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InformationComponent } from 'src/app/information/information.component';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  @ViewChild('loader') loader!: ElementRef;
  user: any = [];
  role: any;
  responseMessage: any;
  private logoutTimer: any;
  loading: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private snackbarService: SnackbarService,
  ) {
    this.getUserLogin();
    if (this.userIsLoggedIn()) {
      this.startLogoutTimer();
    }
  }

  private startLogoutTimer() {
    const logoutTimeInMilliseconds = 2 * 60 * 60 * 1000;
    this.logoutTimer = setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    }, logoutTimeInMilliseconds);
  }
  // private resetLogoutTimer() {
  //   clearTimeout(this.logoutTimer);
  //   this.startLogoutTimer();
  // }


  onUserActivity() {
    this.resetLogoutTimer();
  }


  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }


  getUserLogin() {
    this.userService.getUserLogin().subscribe((response: any) => {
      this.loading = true
      this.user = response.userDetail;
      console.log(response);
      
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }, (error) => {
      setTimeout(() => {
        this.loading = false;
      }, 500);
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.data = {
      message: 'đăng xuất không?',
      confirmation: true
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitstatusChange.subscribe((response) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

  edit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "30%";

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

  userIsLoggedIn(): boolean {
    return true;
  }

  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    if (this.userIsLoggedIn()) {
      this.startLogoutTimer();
    }
  }
}
