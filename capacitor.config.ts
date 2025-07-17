import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.92f2f4e60eea4f82be89c9543cb175a7',
  appName: 'sol-crediario-manager-win',
  webDir: 'dist',
  server: {
    url: "https://92f2f4e6-0eea-4f82-be89-c9543cb175a7.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;