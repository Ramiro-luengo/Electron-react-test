import Xarrow from 'react-xarrows';

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

const Join = (join: string, idx: number, tableIdx: number) => {
  return (
    <div id={`join_${tableIdx}_${idx}`} className="joinContainer">
      {join}
    </div>
  );
};

const processInstructions = (instructions: Array<TableMappingComponent>) => {
  const tableNames: Array<string> = extractUniqueEntityNames(instructions);

  const tables: Array<MappedTable> = [];
  const joins: Set<string> = new Set();
  for (let i = 0; i < tableNames.length; i++) {
    const name = tableNames[i];
    const mappings: Set<string> = new Set();
    const enrichments: Set<string> = new Set();
    for (let j = 0; j < instructions.length; j++) {
      const instruction = instructions[j];
      const { sourcePath, ldmField } = instruction;

      if (
        ldmField.includes('enrichLDMTable') &&
        sourcePath.includes(`extractTableByName | '${name}'`)
      ) {
        const value = ldmField.split('|').slice(1);
        value.forEach((v) => {
          enrichments.add(v);
          if (v.includes('Map')) {
            mappings.add(v);
          }
        });
      }

      if (
        sourcePath.includes('lookupAndJoinTables') &&
        sourcePath.includes(name)
      ) {
        joins.add(sourcePath.split('|').slice(1).join('|'));
      }
    }

    tables.push({
      name,
      mappings: Array.from(mappings).sort(),
      enrichments: Array.from(enrichments).sort(),
      tableId: i,
    });
  }

  return { tables, joins: Array.from(joins).sort() };
};

const Table = (tableData: MappedTable, joins?: Array<string>) => {
  const { name, mappings, enrichments, tableId } = tableData;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: 'inherit',
      }}
    >
      <div className="tableContainer" id={`table_${tableId}`}>
        <div style={{ fontWeight: 'bold' }}>{name}</div>
        <div
          style={{
            'padding-top': '5%',
            'text-decoration': 'underline',
          }}
        >
          LDM Table Mappings:
        </div>
        <ul>
          {mappings.map((mapping) => (
            <li>{mapping}</li>
          ))}
        </ul>
        <div style={{ paddingTop: '5%', textDecoration: 'underline' }}>
          LDM Table Enrichments:
        </div>
        <ul>
          {enrichments.map((enrichment) => (
            <li>{enrichment}</li>
          ))}
        </ul>
      </div>
      {joins ? (
        <div className="joinsContainer">
          {joins.map((join, idx) => Join(join, idx, tableId))}
        </div>
      ) : (
        ''
      )}
      {joins
        ? joins.map((_, idx) => (
            <Xarrow
              strokeWidth={1}
              showHead={false}
              color="white"
              start={`table_${tableId}`}
              end={`join_${tableId}_${idx}`}
            />
          ))
        : ''}
    </div>
  );
};

const Tables = () => {
  const fileData: TableMappingComponents | ErrorType =
    window.fileApi.fileContents(`table_mapping.json`);

  if (fileData.error) {
    return <div>Error: {fileData.error}</div>;
  }

  const instructions = fileData.data;
  const { tables, joins } = processInstructions(instructions);
  let newJoins = joins;
  return (
    <div>
      <div className="tablesContainer">
        {tables.map((table) => {
          const tableJoins = newJoins.filter((join) =>
            join.includes(table.name)
          );
          newJoins = newJoins.filter((join) => !tableJoins.includes(join));
          if (tableJoins) {
            return Table(table, tableJoins);
          }

          return Table(table);
        })}
      </div>
    </div>
  );
};

export default Tables;
