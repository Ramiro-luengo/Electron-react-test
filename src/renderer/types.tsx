type TableMappingComponent = {
  sourcePath: string;
  ldmField: string;
  ldmPath: string;
  preserve: boolean;
  condition: string;
};
type TableMappingComponents = {
  data: Array<TableMappingComponent>;
};

type ErrorType = {
  error: string;
};

export { TableMappingComponents, TableMappingComponent, ErrorType };
