import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() { }

  get apiBaseUrl(): string {
    return environment.apiUrl;
  }

  getApiUrl(endpoint: string): string {
    // Check if the endpoint exists in the environment configuration
    const endpointPath = environment.endpoints[endpoint as keyof typeof environment.endpoints] || `/${endpoint}`;
    return `${this.apiBaseUrl}${endpointPath}`;
  }
}
