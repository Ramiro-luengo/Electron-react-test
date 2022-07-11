import { Channels } from 'main/preload';

import { TableMappingComponents, ErrorType } from './types';

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
      fileContents(filename: string): TableMappingComponents | ErrorType;
    };
  }
}

export {};
