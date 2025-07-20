import React from "react";
import { Card } from "antd";
import { SchemaField as SchemaFieldType } from "../types/schema";

function generateSchema(fields: SchemaFieldType[]) {
  if (!fields) return {};
  const result: Record<string, any> = {};
  fields.forEach((f) => {
    if (!f.key) return;
    if (f.type === "nested") {
      result[f.key] = generateSchema(f.fields || []);
    } else if (f.type === "string") {
      result[f.key] = "string";
    } else if (f.type === "number") {
      result[f.key] = 0;
    }
  });
  return result;
}

export const JsonPreview: React.FC<{ fields: SchemaFieldType[] }> = ({ fields }) => {
  const data = generateSchema(fields);
  return (
    <Card>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
};
