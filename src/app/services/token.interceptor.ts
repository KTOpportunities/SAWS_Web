import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Dataservice } from "./data.service";
import { TokeStorageService } from "./token-storage.service";

@Injectable()

export class TokeninterceptorService implements HttpInterceptor {
  constructor(
    public data: Dataservice,
    private authorize: TokeStorageService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authorize.getToken()}`,
      },
      withCredentials: true,
    });
    return next.handle(request);
  }
}
