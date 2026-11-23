import { HttpHeaders } from '@angular/common/http';

export function getAuthHttpHeaders(): HttpHeaders {
  return new HttpHeaders({
    Authorization: `bearer ${localStorage.getItem('token') ?? ''}`,
  });
}