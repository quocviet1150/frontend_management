import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService,
  ) { }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = router.data;
    expectedRoleArray = expectedRoleArray.expectedRole;
    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = '';
    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        expectedRole = tokenPayload.role;
      }
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && tokenPayload.role == expectedRole){
        return true;
      }
      this.snackbarService.openSnackbar(GlobalConstants.unauthroized,GlobalConstants.error);
      this.router.navigate(['/vietnq/dashboard']);
      return false;
    } else{
      this.router.navigate(['/']);
      localStorage.clear;
      return false;
    }
  }
}
