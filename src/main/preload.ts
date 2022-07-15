/* eslint-disable no-restricted-syntax */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import fs from 'fs';
import path from 'path';

import LineByLine from 'n-readlines';
import JSON_minify from './jsonMinify';

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

const preprocessJsFile = (filepath: string) => {
  const liner = new LineByLine(filepath);

  let mappings = false;
  let stop = false;
  let jsonData = '[\n';
  let line;

  while ((line = liner.next())) {
    let lineStr: string = line.toString();

    if (
      lineStr.includes('mappings') &&
      lineStr.includes('()') &&
      lineStr.includes('{')
    ) {
      mappings = true;
      line = liner.next();
      continue;
    }

    if (mappings && lineStr.trim() === ']') {
      stop = true;
      jsonData += ']\n';
    }

    if (mappings && !stop) {
      const preserveRe = lineStr.match('preserve: (.*),');
      const ldmFieldRe = lineStr.match('"ldmField": (.*),');
      const ldmPathRe = lineStr.match('"ldmPath": (.*),');
      const conditionRe = lineStr.match('condition: (.*)');

      if (preserveRe) {
        lineStr = preserveRe.input?.replaceAll('preserve', '"preserve"');
      }
      if (conditionRe) {
        lineStr = conditionRe.input?.replaceAll('condition:', '"condition":');
        lineStr = lineStr.replaceAll("'", '"');
      }
      if (ldmFieldRe || ldmPathRe) {
        lineStr = lineStr.replaceAll("'", '"');
      }

      jsonData += `${lineStr}\n`;
    }
  }

  return jsonData;
};

// Source: https://dev.to/taw/electron-adventures-episode-22-file-manager-in-react-hi2
const fileContents = (filepath: string) => {
  const localPath: string = path.join(dataPath, filepath);

  return JSON.parse(fs.readFileSync(localPath));
};

const directoryContents = (dir: string) => {
  let results = fs.readdirSync(dir, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    type: entry.isDirectory() ? 'directory' : 'file',
  }));

  for (const result of results) {
    const filename = path.parse(result.name);

    if (filename.ext === '.js') {
      let localPath = path.join(dataPath, result.name.replace('.js', '.json'));

      if (!fs.existsSync(localPath)) {
        console.log(`Generating file ${localPath}`);
        localPath = path.join(dataPath, result.name);
        const strFileData: string = preprocessJsFile(localPath);
        const fileData = JSON.parse(JSON_minify(strFileData));

        fs.writeFileSync(
          localPath.replaceAll('.js', '.json'),
          JSON.stringify(fileData)
        );
      }
    }
  }

  results = fs.readdirSync(dir, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    type: entry.isDirectory() ? 'directory' : 'file',
  }));

  return results.filter((result) => path.parse(result.name).ext === '.json');
};

contextBridge.exposeInMainWorld('fileApi', {
  fileContents,
  directoryContents,
});
