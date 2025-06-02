import { Component, OnInit } from '@angular/core';
import { getAllTasks, postTask } from '@/api';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';
import { RouterOutlet } from '@angular/router';
import { TaskInput, Tasks } from '@/chartsyBE-types/';
import { CommonModule } from '@angular/common';
import { materialImports } from '@/app/ui.imports';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ...materialImports],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements OnInit {
  tasks: Tasks = [];
  info: { platform: string } | null = null;
  filename: string = 'tasks.txt';
  fileContent: any = null;
  error: string | null = null;
  counter: number = 0;
  readfileAvailable = false;

  async ngOnInit(): Promise<void> {
    try {
      this.tasks = await getAllTasks();
      console.log(this.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }

    try {
      this.info = await Device.getInfo();
      console.log(this.info.platform);
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  }

  async shareFile(): Promise<void> {
    try {
      await Share.share({
        title: 'Tasks Note',
        text: JSON.stringify(this.tasks, null, 2),
        dialogTitle: 'save your file',
      });
      alert('File written!');
      this.readfileAvailable = true;
    } catch (e) {
      alert('Error sharing file: ' + e);
    }
  }


async readFile(): Promise<void> {
    try {
      const filePicker = document.createElement('input');
      filePicker.type = 'file';
      filePicker.accept = '.json,.txt,.log'; // or '*' for all types

      filePicker.onchange = async () => {
        const file = filePicker.files?.[0];
        if (!file) return;

        const text = await file.text();

        try {
          this.fileContent = JSON.parse(text);
        } catch (err) {
          this.error = 'Invalid JSON format.';
          this.fileContent = text;
        }
      };

      filePicker.click();
    } catch (err) {
      this.error = 'Unable to open file: ' + (err as any)?.message;
    }
  }

  async postTaskItem(): Promise<void> {
    try {
      const task: TaskInput = {
        title: 'Task new',
        description: 'new posted task' + this.counter,
        status: 'complete',
        due: '2026-10-01T09:00:00.000Z',
        priority: 'high',
        tags: ['pensions', 'documentation'],
      };

      this.counter++;

      await postTask(task);
      alert('Task posted!');

      this.tasks = await getAllTasks();
    } catch (e: any) {
      console.error('Error posting task:', e);
      alert('Error posting task: ' + (e?.message || e));
    }
  }

  trackByTaskId(_index: number, task: any): number {
    return task.id;
  }

  async getCurrentLocation(): Promise<void> {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current location:', coordinates.coords);
    alert(`Lat: ${coordinates.coords.latitude}, Lng: ${coordinates.coords.longitude}`);
  } catch (error) {
    console.error('Error getting location:', error);
    alert('Failed to get location: ' + error);
  }
}


imageDataUrl: string | null = null;

async takePhoto(): Promise<void> {
  console.log('takePhoto() clicked');

  try {
    const isNative = Capacitor.isNativePlatform(); 

    const source: CameraSource = isNative
      ? CameraSource.Camera 
      : CameraSource.Photos; 

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source,
    });

    this.imageDataUrl = image.dataUrl!;
    console.log('Image captured:', this.imageDataUrl);
  } catch (error: any) {
    console.error('Camera error:', error);
    alert('Camera error: ' + (error?.message || error));
  }
}
}
