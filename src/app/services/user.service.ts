import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  signup(data: any) {
    return this.httpClient.post(this.url + "/user/signup", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
  login(data: any) {
    return this.httpClient.post(this.url + "/user/login", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken");
  }

  changePassword(data: any) {
    return this.httpClient.post(this.url + "/user/change_password", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }


  getUsers() {
    return this.httpClient.get(this.url + "/user/get");
  }


  getUserLogin() {
    return this.httpClient.get(this.url + "/user/get_detail_login");
  }

  update(data: any) {
    return this.httpClient.post(this.url + "/user/update", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  delete(id: any) {
    return this.httpClient.post(this.url + "/user/delete_user/" + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateRole(data: any) {
    return this.httpClient.post(this.url + "/user/update_decentralization", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateUser(id: any, data: any) {
    return this.httpClient.post(this.url + "/user/update_information/" + id, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  uploadImage(id: any, file: File): Observable<any> {
    const formData = new FormData();

    formData.append("file", file);
    return this.httpClient.post(this.url + "/user/update_image/" + id, formData);
  }

}
