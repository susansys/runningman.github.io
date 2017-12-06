import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../Model/user';

@Injectable()
export class RunningManService {

   private headers = new Headers({'Content-Type': 'application/json'});
   private usersUrl = 'api/users';  // URL to web api
   private recordUrl = 'api/record';

  constructor(private http: Http) { }

  addUser(userInfo: any): Promise<any> {
    const url = `${this.usersUrl}/add`;
    return this.http.post(url, JSON.stringify(userInfo), {headers: this.headers})
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }


  logon(userInfo: any): Promise<any> {
    const url = `${this.usersUrl}/logon`;
    return this.http.post(url, JSON.stringify(userInfo), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  update(userInfo: any): Promise<any> {
    const url = `${this.usersUrl}/update`;
    return this.http
      .put(url, JSON.stringify(userInfo), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getUserRecord(username): Promise<any> {
    const url = `${this.usersUrl}/record?username=${username}`;
    return this.http
      .get(url + '&' + Math.random())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getWorldRecord(): Promise<any> {
    const url = this.recordUrl;
    return this.http
      .get(url + '?' + Math.random())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
