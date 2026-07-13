import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {

  
  private searchSource = new BehaviorSubject<string>('');
  search$ = this.searchSource.asObservable();

  updateSearch(value: string) {
    this.searchSource.next(value);
  }
}
