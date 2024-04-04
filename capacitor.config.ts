import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Band Scramble',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: 'http://10.1.10.172:3000',
    cleartext: true

  }
};

export default config;
