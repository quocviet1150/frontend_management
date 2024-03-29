import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  url = environment.apiUrl

  constructor(
    private httpClient: HttpClient
  ) { }

  uploadImage(file: File, name: any, description: any): Observable<any> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append('name', name);
    formData.append('description', description);

    return this.httpClient.post(this.url + "/image/upload", formData);
  }


  getImageData() {
    return this.httpClient.get(this.url + "/image/get_image");
  }

  updateStatus(data: any) {
    return this.httpClient.post(this.url + "/image/update_status", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getImageDataAll() {
    return this.httpClient.get(this.url + "/image/get_image_all");
  }

  delete(id: any) {
    return this.httpClient.post(this.url + "/image/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
