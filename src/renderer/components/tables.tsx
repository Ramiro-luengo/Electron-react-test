type TableMappingComponent = {
  sourcePath: string;
  ldmField: string;
  ldmPath: string;
  preserve: boolean;
  condition: string;
};

const Tables = () => {
  // Ignore typehint bug.
  const fileData: Array<TableMappingComponent> =
    window.fileApi.fileContents(`table_mapping.json`);

  return (
    <div>
      <table>
        <tr key="header">
          {Object.keys(fileData[0]).map((key) => (
            <th>{key}</th>
          ))}
        </tr>
        {fileData.map((item) => (
          <tr>
            {Object.values(item).map((val) => (
              <td>{val}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Tables;
