import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './', // Set the root to the pages directory
  build: {
    outDir: '../dist', // Output to a dist directory at the root
    rollupOptions: {
      input: {
        app:path.resolve(__dirname,"pages/admin-login.html"),
        adminLogin: path.resolve(__dirname, 'pages/admin-login.html'),
        admin: path.resolve(__dirname, 'pages/admin.html'),
        attendance: path.resolve(__dirname, 'pages/attendance.html'),
        sessionSettings: path.resolve(__dirname, 'pages/session-settings.html'),
      },
    },
  },
});
