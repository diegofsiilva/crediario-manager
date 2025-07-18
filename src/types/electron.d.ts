// src/types/electron.d.ts
import { ElectronAPI } from 'electron';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}