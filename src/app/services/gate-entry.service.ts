import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GateEntryService {
  baseAddress: string;
  clientId: string;

  constructor(private _httpClient: HttpClient) {
    this.baseAddress = environment.baseAddress;
    this.clientId = environment.clientId;
  }}
