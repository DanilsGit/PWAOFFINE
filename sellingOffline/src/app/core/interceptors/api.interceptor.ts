import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_API_URL } from '../tokens/api';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(BASE_API_URL);

  if (req.url.startsWith('/')) {
    const apiReq = req.clone({
      url: `${baseUrl}${req.url}`,
    });
    return next(apiReq);
  }
  return next(req);
};
