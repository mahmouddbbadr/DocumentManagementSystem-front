import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const localToken = localStorage.getItem("userToken");
  if (localToken) {
    const myreq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${ localToken }`
    }
  });
  return next(myreq);
  } else {
    return next(req);
  }
};
