import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadStatus: string = '';
  uploadedFiles: any[] = []; // Store file list

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Upload file (POST request)
  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadStatus = 'Please select a file first.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const apiUrl = 'http://localhost:5156/api/FileUpload';
    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        console.log('File uploaded successfully', response);
        this.uploadStatus = 'File uploaded successfully!';
        this.getUploadedFiles(); // Fetch files after upload
      },
      error: (error) => {
        console.error('Error uploading file', error);
        this.uploadStatus = 'File upload failed.';
      }
    });
  }

  // Retrieve uploaded files (GET request)
  getUploadedFiles(): void {
    const apiUrl = 'http://localhost:5156/api/FileUpload';
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        console.log('Files retrieved:', data);
        this.uploadedFiles = data; // Update file list
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error retrieving files', error);
      }
    });
  }

  // Download a file (GET request for a specific file)
  downloadFile(fileName: string): void {
    const apiUrl = `http://localhost:5156/api/FileUpload/${fileName}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading file', error);
      }
    });
  }
}
