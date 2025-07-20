export type FieldType = 'string' | 'number' | 'nested';

export interface SchemaField {
  key: string;
  type: FieldType;
  fields?: SchemaField[]; // nested children
}

