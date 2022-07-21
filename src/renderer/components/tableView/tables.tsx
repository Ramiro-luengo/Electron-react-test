/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';
import { MapInteractionCSS } from 'react-map-interaction';
import Draggable from 'react-draggable';
import Select from 'react-select';

import { TableMappingComponent } from 'renderer/types';
import './table.css';

interface MappedTable {
  name: string;
  mappings: Array<string>;
  enrichments: Array<string>;
  tableId: number;
}

interface MappedJoin {
  name: string;
  id: string;
  enrichments: Array<string>;
  drawn: boolean;
}

const extractUniqueEntityNames = (
  tableMappings: Array<TableMappingComponent>
) => {
  const uniqueTableNames: Set<string> = new Set();

  for (let i = 0; i < tableMappings.length; i++) {
    const element: TableMappingComponent = tableMappings[i];

    if (element.sourcePath.includes('extractTableByName')) {
      uniqueTableNames.add(
        element.sourcePath.split('|')[1].trim().replaceAll("'", '')
      );
    }
  }

  return Array.from(uniqueTableNames);
};

const Join = (mappedJoin: MappedJoin) => {
  // Set to true so we don't re-draw the join.
  mappedJoin.drawn = true;

  const { id, enrichments } = mappedJoin;

  return (
    <div
      data={JSON.stringify(mappedJoin)}
      id={`join_${id}`}
      key={`join_${id}`}
      className="join canvasElement"
    >
      <div className="containerTitle">LDM Table Enrichments:</div>
      <ul>
        {enrichments.map((enrichment) => (
          <li>{enrichment}</li>
        ))}
      </ul>
    </div>
  );
};

const processInstructions = (instructions: Array<TableMappingComponent>) => {
  const tableNames: Array<string> = extractUniqueEntityNames(instructions);

  const tables: Array<MappedTable> = [];
  const joins: Array<MappedJoin> = [];
  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];
    const mappings: Set<string> = new Set();
    const tableEnrichments: Set<string> = new Set();
    for (let j = 0; j < instructions.length; j++) {
      const instruction = instructions[j];
      const { sourcePath, ldmField } = instruction;

      if (
        ldmField.includes('enrichLDMTable') &&
        sourcePath.includes(`extractTableByName | '${tableName}'`)
      ) {
        const value = ldmField.split('|').slice(1);
        value.forEach((v) => {
          tableEnrichments.add(v);
          if (v.includes('Map')) {
            mappings.add(v);
          }
        });
      }

      if (sourcePath.includes('lookupAndJoinTables')) {
        // Accounts for duplicated joins.
        const joinName = sourcePath.split('|').slice(1).join('|');
        if (joins.every(({ name }) => joinName !== name))
          joins.push({
            name: joinName,
            id: '',
            drawn: false,
            enrichments: ldmField.split('|').slice(1),
          });
      }
    }

    tables.push({
      name: tableName,
      mappings: Array.from(mappings).sort(),
      enrichments: Array.from(tableEnrichments).sort(),
      tableId: i,
    });
  }

  const processedJoins = joins.sort().map((joinValue, idx) => {
    return {
      name: joinValue.name,
      id: idx,
      enrichments: joinValue.enrichments,
      drawn: joinValue.drawn,
    };
  });

  return {
    tables,
    joins: processedJoins,
  };
};

const preProcessJoins = (joins: Array<MappedJoin>) => {
  /* Filter joins with same tables on both sides. */
  /* 1. Get table names */
  /* 2. Form each join from those. */
  const groupedJoins: Array<Array<MappedJoin>> = new Array<Array<MappedJoin>>();
  for (let idx = 0; idx < joins.length; idx++) {
    const join = joins[idx];
    const { name } = join;

    for (const otherJoin of joins) {
      if (name === otherJoin.name) {
        continue;
      }
      const parsedNames = [name.split('|')[0], name.split('|')[2]];
      const otherParsedNames = [
        otherJoin.name.split('|')[0],
        otherJoin.name.split('|')[2],
      ];
      if (JSON.stringify(parsedNames) === JSON.stringify(otherParsedNames)) {
        groupedJoins[idx].push();
      }
    }
  }
  console.log(groupedJoins);

  return joins;
};

const Table = (
  tableData: MappedTable,
  updateXarrow: () => void, // Hook from Xarrow Lib.
  joins: Array<MappedJoin>,
  idx: number,
  scale: number
) => {
  const { name: tableName, mappings, enrichments, tableId } = tableData;

  // const processedJoins = preProcessJoins(joins);
  const processedJoins = joins;

  return (
    <div
      key={`${tableName}__${idx}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '14%',
      }}
    >
      <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
        <div
          className="table canvasElement"
          id={`table_${tableId}`}
          key={`table_${tableId}`}
        >
          <div style={{ fontWeight: 'bold' }}>{tableName}</div>
          <div className="containerTitle">LDM Table Mappings:</div>
          <ul>
            {mappings.map((mapping) => (
              <li>{mapping}</li>
            ))}
          </ul>
          <div className="containerTitle">LDM Table Enrichments:</div>
          <ul>
            {enrichments.map((enrichment) => (
              <li>{enrichment}</li>
            ))}
          </ul>
        </div>
      </Draggable>

      {/* -------- Joins -------- */}
      <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
        {processedJoins?.some((join) => !join.drawn) ? (
          <div className="joinsContainer">
            {processedJoins?.filter(({ drawn }) => !drawn).map(Join)}
          </div>
        ) : (
          <div />
        )}
      </Draggable>
      {/* ------- Joins end ------- */}

      {/* -------- Arrows -------- */}
      {/* <Xwrapper> */}
      {joins?.map(({ name, id }) => {
        const splittedName: Array<string> = name
          .split('|')
          .map((v) => v.replaceAll("'", '').trim());
        const labelIdx: number = splittedName.indexOf(tableName) + 1;

        return (
          <Xarrow
            strokeWidth={1}
            showHead={false}
            path="straight"
            lineColor="white"
            SVGcanvasStyle={{ transform: `scale(${1 / scale})` }}
            labels={{
              middle: (
                <div style={{ color: 'white', fontSize: 11 }}>
                  {splittedName[labelIdx]}
                </div>
              ),
            }}
            start={`table_${tableId}`}
            end={`join_${id}`}
          />
        );
      })}
      {/* </Xwrapper> */}
      {/* ------ Arrows end ------ */}
    </div>
  );
};

const TablesContainer = ({
  filename,
  scale,
  updateXarrow,
  dataPath,
}: {
  filename: string;
  scale: number;
  updateXarrow: () => void;
  dataPath: string;
}) => {
  let fileData;

  try {
    fileData = window.fileApi.fileContents(dataPath, filename);
  } catch (err) {
    if (err.message.includes('not found')) {
      return <div>Error: File {filename} not found</div>;
    }
    console.dir(err);
    return <div>Error: Parsing error in file {filename}</div>;
  }

  const { tables, joins } = processInstructions(fileData);
  let newJoins = joins;

  return (
    <div className="tablesContainer">
      {tables.map((table, idx) => {
        const tableJoins = newJoins.filter((join) =>
          join.name.includes(table.name)
        );
        newJoins = newJoins.filter((join) => !tableJoins.includes(join.name));
        return Table(table, updateXarrow, tableJoins, idx, scale);
      })}
    </div>
  );
};

const Tables = () => {
  const [dataPath, setDataPath] = useState('src/data');
  const [dirContents, setDirContents] = useState(
    window.fileApi.directoryContents(dataPath)
  );

  const firstFile = dirContents[0];
  const updateXarrow = useXarrow();
  const [filename, setFilename] = useState(firstFile.name);
  const defaultTranslation = {
    scale: 1,
    translation: { x: 0, y: 0 },
  };
  const [translation, setTranslation] = useState(defaultTranslation);

  useEffect(() => {
    console.log(`Setting dataPath to: ${dataPath}`);
    const newDirContents = window.fileApi.directoryContents(dataPath);
    setDirContents(newDirContents);
    setFilename(newDirContents[0].name);
  }, [dataPath]);

  return (
    <div className="canvas">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                // return result.filePaths[0];
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
            placeholder={firstFile.name}
            onChange={(input) => setFilename(input?.value.name)}
            options={dirContents.map((file) => ({
              value: file,
              label: file.name,
            }))}
          />
        </div>
        <button
          className="button"
          type="button"
          onClick={() => {
            setTranslation(defaultTranslation);
          }}
        >
          Reset zoom
        </button>
      </div>
      <Xwrapper>
        <MapInteractionCSS
          showControls
          btnClass="controlBtn"
          value={translation}
          onChange={(t) => {
            setTranslation(t);
            updateXarrow();
          }}
        >
          <TablesContainer
            dataPath={dataPath}
            filename={filename}
            scale={translation.scale}
            updateXarrow={updateXarrow}
          />
        </MapInteractionCSS>
      </Xwrapper>
    </div>
  );
};

export default Tables;
