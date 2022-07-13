import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import fs from 'fs';
import path from 'path';

const dataPath = 'src/data';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

// Source: https://dev.to/taw/electron-adventures-episode-22-file-manager-in-react-hi2
const fileContents = (filepath: string) => {
  const localData: string = path.join(dataPath, filepath);

  let fileData = { error: `File ${filepath} doesn't exist.` };
  try {
    if (fs.existsSync(localData)) {
      fileData = JSON.parse(fs.readFileSync(localData));
    }
  } catch (err) {
    fileData = { error: `File ${filepath} parsing error` };
  }

  return fileData;
};

const directoryContents = (dir: string) => {
  const results = fs.readdirSync(dir, { withFileTypes: true });

  return results.map((entry) => ({
    name: entry.name,
    type: entry.isDirectory() ? 'directory' : 'file',
  }));
};

contextBridge.exposeInMainWorld('fileApi', {
  fileContents,
  directoryContents,
});
