import { Channels } from 'main/preload';

import { TableMappingComponents } from './types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    fileApi: {
      fileContents(dataPath: string, filename: string): TableMappingComponents;
      directoryContents(dir: string): Array<{ name: string; type: string }>;
      saveFile(dataPath: string, filename: string, data: any): void;
      openDir(): Promise<{ filePaths: Array<string>; canceled: boolean }>;
    };
  }
}

export {};
