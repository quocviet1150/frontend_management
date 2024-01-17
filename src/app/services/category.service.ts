import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  createCategory(data: any) {
    return this.httpClient.post(this.url + "/category/create_category", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  update_category(data: any) {
    return this.httpClient.post(this.url + "/category/update_category", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getCategorys() {
    return this.httpClient.get(this.url + "/category/get_category");
  }

  getFilteredCategorys() {
    return this.httpClient.get(this.url + "/category/get_category?filterValue=true");
  }

  update(data: any) {
    return this.httpClient.post(this.url + "/category/update", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

}
