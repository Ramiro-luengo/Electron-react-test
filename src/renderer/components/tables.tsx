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
  joins: Array<string>;
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

const processInstructions = (instructions: Array<TableMappingComponent>) => {
  const tableNames: Array<string> = extractUniqueEntityNames(instructions);

  const tables: Array<MappedTable> = [];
  for (let i = 0; i < tableNames.length; i++) {
    const name = tableNames[i];
    const mappings: Set<string> = new Set();
    const enrichments: Set<string> = new Set();
    const joins: Set<string> = new Set();
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
      joins: Array.from(joins).sort(),
    });
  }

  return tables;
};

const Table = ({ name, mappings, enrichments, joins }: MappedTable) => {
  return (
    <div className="tableContainer">
      <div style={{ 'font-weight': 'bold' }}>{name}</div>
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
      <div style={{ 'padding-top': '5%', 'text-decoration': 'underline' }}>
        LDM Table Enrichments:
      </div>
      <ul>
        {enrichments.map((enrichment) => (
          <li>{enrichment}</li>
        ))}
      </ul>
      <div style={{ 'padding-top': '5%', 'text-decoration': 'underline' }}>
        LDM Table Joins:
      </div>
      <ul>
        {joins.map((join) => (
          <li>{join}</li>
        ))}
      </ul>
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
  const tables = processInstructions(instructions);

  return <div className="tablesContainer">{tables.map(Table)}</div>;
};

export default Tables;
