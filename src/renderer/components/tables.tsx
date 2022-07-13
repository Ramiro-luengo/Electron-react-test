import { useState } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import Select from 'react-select';

import {
  TableMappingComponents,
  TableMappingComponent,
  ErrorType,
} from 'renderer/types';
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

  const { id, /* name, */ enrichments } = mappedJoin;

  return (
    <div id={`join_${id}`} className="join">
      {/* <div className="containerTitle">{name}</div> */}
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

const Table = (tableData: MappedTable, joins?: Array<MappedJoin>) => {
  const { name: tableName, mappings, enrichments, tableId } = tableData;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: '14%',
      }}
    >
      <div className="table" id={`table_${tableId}`}>
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

      {/* -------- Joins -------- */}
      {joins?.some((join) => !join.drawn) ? (
        <div className="joinsContainer">
          {joins.filter(({ drawn }) => !drawn).map(Join)}
        </div>
      ) : (
        ''
      )}
      {/* ------- Joins end ------- */}

      {/* -------- Arrows -------- */}
      <Xwrapper>
        {joins
          ? joins.map(({ name, id }) => {
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
            })
          : ''}
      </Xwrapper>
      {/* ------ Arrows end ------ */}
    </div>
  );
};

const TablesContainer = ({ filename }) => {
  const fileData: TableMappingComponents | ErrorType =
    window.fileApi.fileContents(filename);

  if (fileData.error) {
    return <div>Error: {fileData.error}</div>;
  }

  const { tables, joins } = processInstructions(fileData);
  let newJoins = joins;

  return (
    <div className="tablesContainer">
      {tables.map((table) => {
        const tableJoins = newJoins.filter((join) =>
          join.name.includes(table.name)
        );
        newJoins = newJoins.filter((join) => !tableJoins.includes(join.name));
        if (tableJoins) {
          return Table(table, tableJoins);
        }

        return Table(table);
      })}
    </div>
  );
};

const Tables = () => {
  const dirContents = window.fileApi.directoryContents('src/data');
  const colourStyles = {
    option: (styles) => {
      return {
        ...styles,
        color: 'black',
      };
    },
  };

  const firstDir = dirContents[0];
  const [filename, setFilename] = useState(firstDir.name);

  return (
    <div>
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <Select
          name="dir"
          placeholder={firstDir.name}
          styles={colourStyles}
          onChange={(input) => setFilename(input?.value.name)}
          options={dirContents.map((file) => ({
            value: file,
            label: file.name,
          }))}
        />
      </div>
      <TablesContainer filename={filename} />
    </div>
  );
};

export default Tables;
