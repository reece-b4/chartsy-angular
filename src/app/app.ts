import { Component, OnInit } from '@angular/core';
import { getAllTasks, postTask } from '@/api';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';
import { RouterOutlet } from '@angular/router';
import { TaskInput, Tasks } from '@/chartsyBE-types/';
// import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { materialImports } from '@/app/ui.imports'; // Adjust the import path as necessary

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
  fileContent: string = '';
  counter: number = 0;

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
    } catch (e) {
      alert('Error sharing file: ' + e);
    }
  }
  readFile() {
    // not yet implemented
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
        // created_at: '2025-05-01T13:53:37.650Z',
        // updated_at: null,
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

  trackByTaskId(index: number, task: any): number {
    return task.id;
  }
}
