import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment.prod';
import { Producto } from '../../interfaces/productos.interface';
@Component({
  selector: 'app-file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.css"]
})
export class FileUploadComponent {

    @Input()
    requiredFileType:string = '';


    fileName = '';
    uploadProgress!:number;
    uploadSub!: Subscription;

    constructor(private http: HttpClient) {}

    onFileSelected(event: any) {
        const file:File = event.target.files[0];
      
        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("archivo", file);
            

            const upload$ = this.http.post(`http://localhost:4000/upload`, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                finalize(() => this.reset())
            );
          
            this.uploadSub = upload$.subscribe(event => {
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / 10));
              }
            })
        }
    }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = new Subscription();
  }
}