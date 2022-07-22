/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */

import Select from 'react-select';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';
import { useState, useEffect } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';

import { TableMappingComponent } from 'renderer/types';
import './table.css';

interface MappedJoin {
  id: string;
  joinName: string;
  mainTableName: string;
  secondaryTableName: string;
  columns: Array<string>;
  enrichments: Array<string>;
}

interface MappedTable {
  id: number;
  name: string;
  mappings: Array<string>;
  enrichments: Array<string>;
  joins: Array<MappedJoin>;
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
  const { id, enrichments, columns } = mappedJoin;

  return (
    <div id={`join_${id}`} key={`join_${id}`} className="join canvasElement">
      <div className="containerTitle">LDM Table Enrichments:</div>
      <ul>
        {enrichments.map((enrichment) => (
          <li>{enrichment}</li>
        ))}
      </ul>
      <div className="containerTitle">Columns</div>
      <ul>
        {columns.map((col) => (
          <li>{col}</li>
        ))}
      </ul>
    </div>
  );
};

const processInstructions = (instructions: Array<TableMappingComponent>) => {
  const tableNames: Array<string> = extractUniqueEntityNames(instructions);

  const tables: Array<MappedTable> = [];
  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];
    const mappings: Set<string> = new Set();
    const tableEnrichments: Set<string> = new Set();
    const tableJoins: Array<MappedJoin> = [];
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

      const splittedName = sourcePath.split('|');
      if (
        sourcePath.includes('lookupAndJoinTables') &&
        splittedName[1].replaceAll("'", '').trim() === tableName
      ) {
        const indexes = [2, 4];
        if (splittedName.length <= 4) {
          indexes[1] = 2;
        }

        tableJoins.push({
          id: `${tableName}_${tableJoins.length}`,
          joinName: splittedName.slice(1).join('|'),
          mainTableName: tableName,
          secondaryTableName: splittedName[3].replaceAll("'", '').trim(),
          columns: [
            splittedName[indexes[0]].replaceAll("'", '').trim(),
            splittedName[indexes[1]].replaceAll("'", '').trim(),
          ],
          enrichments: ldmField.split('|').slice(1),
        });
      }
    }

    tables.push({
      id: i,
      name: tableName,
      mappings: Array.from(mappings).sort(),
      enrichments: Array.from(tableEnrichments).sort(),
      joins: tableJoins,
    });
  }

  return tables;
};

const preProcessJoins = (joins: Array<MappedJoin>) => {
  let groupedJoins = {};

  if (joins.length <= 1) return joins;

  for (const idx in joins) {
    const join = joins[idx];
    const { id: mainId, mainTableName, secondaryTableName } = join;

    for (const otherJoin of joins.filter(({ id }) => id !== mainId)) {
      if (
        mainTableName === otherJoin.mainTableName &&
        otherJoin.secondaryTableName === secondaryTableName
      ) {
        if (groupedJoins[mainTableName]) {
          if (
            !groupedJoins[mainTableName]
              .map(({ id }) => id)
              .includes(otherJoin.id)
          ) {
            groupedJoins[mainTableName].push(otherJoin);
          }
        } else {
          groupedJoins[mainTableName] = [otherJoin];
        }
      }
    }
  }

  groupedJoins = Object.values(groupedJoins).flat();

  if (groupedJoins.length === 0) {
    return groupedJoins;
  }

  const splitIntoChunks = (array, chunkSize) =>
    [].concat.apply(
      [],
      array.map((_, i) => {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );

  const retJoins = [
    groupedJoins.reduceRight((prevValue, currValue) => {
      currValue.columns.forEach((col) => prevValue.columns.push(col));
      currValue.enrichments.forEach((e) => prevValue.enrichments.push(e));
      return prevValue;
    }),
  ].map((j) => {
    return {
      ...j,
      columns: splitIntoChunks(j.columns, 2).map((c) => c.join(' | ')),
    };
  });

  return retJoins;
};

const Table = (
  tables: Array<MappedTable>,
  tableData: MappedTable,
  updateXarrow: () => void, // Hook from Xarrow Lib.
  idx: number,
  scale: number
) => {
  const {
    name: tableName,
    mappings,
    enrichments,
    id: tableId,
    joins,
  } = tableData;

  const processedJoins: Array<MappedJoin> = preProcessJoins(joins);

  return (
    <div
      key={`${tableName}__${idx}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '50px',
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
        <div className="joinsContainer">{processedJoins?.map(Join)}</div>
      </Draggable>
      {/* ------- Joins end ------- */}

      {/* -------- Arrows -------- */}
      {/* <Xwrapper> */}
      {processedJoins?.map(({ id, /* columns, */ secondaryTableName }) => (
        <div>
          <Xarrow
            strokeWidth={1}
            showHead={false}
            path="straight"
            lineColor="white"
            SVGcanvasStyle={{ transform: `scale(${1 / scale})` }}
            // labels={{
            //   middle: (
            //     <div style={{ color: 'white', fontSize: 11 }}>{columns[0]}</div>
            //   ),
            // }}
            start={`table_${tableId}`}
            end={`join_${id}`}
          />
          <Xarrow
            strokeWidth={1}
            showHead={false}
            path="straight"
            lineColor="white"
            SVGcanvasStyle={{ transform: `scale(${1 / scale})` }}
            // labels={{
            //   middle: (
            //     <div style={{ color: 'white', fontSize: 11 }}>{columns[1]}</div>
            //   ),
            // }}
            start={`table_${
              tables.find(
                ({ name: sec_t_name }) => sec_t_name === secondaryTableName
              )?.id
            }`}
            end={`join_${id}`}
          />
        </div>
      ))}
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
  let tables: Array<MappedTable>;

  try {
    const fileData = window.fileApi.fileContents(dataPath, filename);
    tables = processInstructions(fileData);
  } catch (err: unknown) {
    if (err.message.includes('not found')) {
      return <div>Error: File {filename} not found</div>;
    }
    console.log(err);
    return <div>Parsing/Processing error in file {filename}</div>;
  }

  // Allows for dumping the tables structure into console.
  // console.log(JSON.stringify(tables));

  return (
    <div className="tablesContainer">
      {tables.map((table, idx) => {
        return Table(tables, table, updateXarrow, idx, scale);
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

  useEffect(() => {
    updateXarrow();
  }, [filename, translation]);

  return (
    <div className="canvas">
      <Link className="link" to="/">
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
          onChange={setTranslation}
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
