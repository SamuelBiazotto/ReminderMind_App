import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectivityProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ConnectivityProvider Provider');
  }

  Post(path, data, headers): Promise<any> {
    console.log(path);
    console.log(data);
    console.log(headers);
    return this.http.post(path, data, {headers, responseType: 'json'})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  Delete(path, headers): Promise<any> {
    return this.http.delete(path, {headers, responseType: 'json'})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  Put(path, data, headers): Promise<any> {
    return this.http.put(path, data, {headers, responseType: 'json'})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  Get(path, headers): Promise<any> {
    return this.http.get(path, {headers: headers, responseType: 'json'})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }


  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
