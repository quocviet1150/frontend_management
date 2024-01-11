import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  generateReport(data: any) {
    return this.httpClient.post(this.url + "/bill/generate_report", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getPdf(data: any): Observable<Blob> {
    return this.httpClient.post(this.url + "/bill/get_pdf", data, { responseType: 'blob' });
  }

  getBill() {
    return this.httpClient.get(this.url + "/bill/get_bills");
  }

  delete(id:any){
    return this.httpClient.post(this.url + "/bill/delete/"+ id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
