import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {
  constructor() { }

  setItem(_key: string, _value: any): void {
    alert("Save button clicked!")
    //localStorage.setItem(key, JSON.stringify (value))
  }
  getItem(_key: string): any {
    alert("Load button clicked!")
    //const data = localStorage.getItem(key)
    //return data ? JSON.parse(data) : null
  }
}
