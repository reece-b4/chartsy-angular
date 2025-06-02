import { Component, OnInit } from '@angular/core';
import { WeatherService } from '@/app/services/weather.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-weather-widget',
  imports: [NgIf],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css',
  standalone: true,
})
export class WeatherWidgetComponent implements OnInit {
  weather: any = null;
  error: string | null = null;
  loading = true;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.weatherService.getWeather(latitude, longitude).subscribe({
          next: (data: any) => {
            this.weather = data.current_weather;
            this.loading = false;
          },
          error: (err: any) => {
            this.error = 'Failed to fetch weather.';
            this.loading = false;
          }
        });
      },
      (err) => {
        this.error = 'GPS access denied.';
        this.loading = false;
      }
    );
  }
}
