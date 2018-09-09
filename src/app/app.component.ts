import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent, HttpHandler, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'POCFunctionApp';
  selectedfile1 = '';
  isFirstFileUploaded = true;
  isSecondFileUploaded = true;
  file_1_name = '';
  file_2_name = '';

  file_1: any;
  file_2: any;

  Directroy: any;

  ApiURL = environment.ApiURl;


  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private toastr: ToastrService) { }


  onFile1Click(event) {
    console.log('File 1 clicked');
    if (event.target.files && event.target.files[0]) {
      this.isFirstFileUploaded = false;
   console.log(event.target.files[0].name);
   this.file_1 = event.target.files[0];
   this.file_1_name = event.target.files[0].name;
     }
    }
  onFile2Click(event) {
    console.log('File 2 clicked');
    if (event.target.files && event.target.files[0]) {
      this.isSecondFileUploaded = false ;
   console.log(event.target.files[0].name);
   this.file_2 = event.target.files[0];
   this.file_2_name = event.target.files[0].name;
     }
    }
  onAnalyseClick() {

    if (this.file_1 != null && this.file_2 != null) {
    this.spinner.show();
    const formData = new FormData();

   formData.append(this.file_1.name, this.file_1);
   formData.append(this.file_2.name, this.file_2);

   const uploadReq = new HttpRequest('POST', this.ApiURL + '/api/Storage/Analyse', formData, {
    reportProgress: true,
  });
  this.http.request(uploadReq).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request started');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Headers received ->', event.headers);
        break;
      case HttpEventType.DownloadProgress:
        const loaded = Math.round(event.loaded / 1024);
        console.log(`Downloading ${ loaded } kb downloaded`);
        break;
      case HttpEventType.Response:
      {
        console.log('Finished -> ', event.body);
        this.Directroy = event.body;
        this.spinner.hide();
        this.toastr.success('Analysis Completed');
      }
    }
  });
    } else {
      this.spinner.hide();
      this.toastr.error('Please Upload the files');
    }
}


      onConvertClick() {
        if (this.Directroy != null ) {
          this.spinner.show();
        const uploadReq = new HttpRequest('POST', this.ApiURL + '/api/Storage/Convert', this.Directroy, {
    reportProgress: true,
  });
  this.http.request(uploadReq).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request started');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Headers received ->', event.headers);
        break;
      case HttpEventType.DownloadProgress:
        const loaded = Math.round(event.loaded / 1024);
        console.log(`Downloading ${ loaded } kb downloaded`);
        break;
      case HttpEventType.Response:
      {
        console.log('Finished -> ', event.body);
        this.Directroy = event.body;
        this.spinner.hide();
      }

    }
  });
      } else {
        this.spinner.hide();
        this.toastr.error('Please do Analyse Before Convert');
      }
    }
    }

// @Injectable()
// export class MyInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>> {
//     request = request.clone({
//       setHeaders: {
//         'X-Custom-Header': 'Agent-007'
//       }
//     });
//     return next.handle(request);
//   }
// }
