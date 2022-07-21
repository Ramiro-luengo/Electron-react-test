import Select from 'react-select';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import SaveIcon from '../../../../assets/save-icon.svg';
import 'react-toastify/dist/ReactToastify.css';
import './edit.css';

const safeAccessFileData = (dataPath: string, filename: string) => {
  let fileData;

  try {
    fileData = window.fileApi.fileContents(dataPath, filename);
  } catch (err) {
    if (err.message.includes('not found')) {
      fileData = <div>Error: File {filename} not found</div>;
    }

    console.dir(err);
    fileData = <div>Error: Parsing error in file {filename}</div>;
  }
  return fileData;
};

const EditTables = () => {
  const [dataPath, setDataPath] = useState('src/data');
  const [dirContents, setDirContents] = useState(
    window.fileApi.directoryContents(dataPath)
  );
  const firstFile = dirContents[0].name;
  const [filename, setFilename] = useState(firstFile);
  useEffect(() => {
    console.log(`Setting dataPath to: ${dataPath}`);
    const newDirContents = window.fileApi.directoryContents(dataPath);
    setDirContents(newDirContents);
    setFilename(newDirContents[0].name);
  }, [dataPath]);

  const [data, setData] = useState(safeAccessFileData(dataPath, firstFile));

  useEffect(() => {
    setData(safeAccessFileData(dataPath, filename));
  }, [filename, dataPath]);

  const notifyFileSaved = () => toast(`${filename} was saved!`);

  const saveData = () => {
    window.fileApi.saveFile(dataPath, filename, data);
    console.log(`${filename} was saved!`);
    notifyFileSaved();
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <Link to="/">
        <button className="button" type="button">
          Home
        </button>
      </Link>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '10px',
        }}
      >
        <button
          className="button"
          type="button"
          onClick={() => {
            window.fileApi
              .openDir()
              .then((result) => {
                if (result.canceled) {
                  console.log('Directory selection was canceled');
                  return;
                }

                setDataPath(result.filePaths[0]);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          Select a directory for mappings
        </button>
        <div className="fileSelect">
          <Select
            name="dir"
            placeholder={firstFile}
            onChange={(input) => setFilename(input?.value.name)}
            options={dirContents.map((file) => ({
              value: file,
              label: file.name,
            }))}
          />
        </div>
        <div
          className="saveImg"
          id="keyboard"
          role="button"
          onClick={() => saveData()}
          onKeyDown={(e) => {
            console.log(e);
            if (e.key === '90' && e.ctrlKey) {
              saveData();
            }
          }}
          tabIndex={0}
        >
          <img width="40px" height="40px" src={SaveIcon} alt="Placeholder" />
        </div>
      </div>
      {data.type === 'div' ? (
        <div className="Center">{data}</div>
      ) : (
        <div style={{ paddingTop: '10px' }}>
          <ReactJson
            theme="hopscotch"
            src={data}
            name="instructions"
            style={{ fontSize: 20 }}
            iconStyle="circle"
            enableClipboard={false}
            displayDataTypes={false}
            onEdit={({ updated_src }) => setData(updated_src)}
            onDelete={({ updated_src }) => setData(updated_src)}
            onAdd={({ updated_src }) => setData(updated_src)}
          />
        </div>
      )}
    </div>
  );
};

export default EditTables;
