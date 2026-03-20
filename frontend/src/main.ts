import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config'; // ✅ Use the centralized config

bootstrapApplication(App, appConfig); // ✅ No duplicate providers here
