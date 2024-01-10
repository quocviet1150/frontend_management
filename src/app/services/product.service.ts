import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  createProduct(data: any) {
    return this.httpClient.post(this.url + "/product/create_product", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateProduct(data: any) {
    return this.httpClient.post(this.url + "/product/update_product", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  updateStatus(data: any) {
    return this.httpClient.post(this.url + "/product/update_status", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getProducts() {
    return this.httpClient.get(this.url + "/product/get_product");
  }

  delete(id: any) {
    return this.httpClient.post(this.url + "/product/delete_product/" + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getProductsByCategory(id: any) {
    return this.httpClient.get(this.url + "/product/get_by_category/" + id);
  }


  getProductsById(id: any) {
    return this.httpClient.get(this.url + "/product/get_by_id/" + id);
  }

}
