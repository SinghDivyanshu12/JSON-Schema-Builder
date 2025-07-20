import React from "react";
import { Button, Space, Input, Select, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FieldType } from "../types/schema";

interface SchemaFieldProp {
  nestIndex: number[];
  remove?: (index: number) => void;
  name: string;
}

const typeOptions = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Nested", value: "nested" },
];

const DEFAULT_FIELD = {
  key: "",
  type: "string" as FieldType,
};

export const SchemaField: React.FC<SchemaFieldProp> = ({
  nestIndex,
  name,
  remove,
}) => {
  const { control, watch, setValue } = useFormContext();

  // Compose the path for this field, e.g., fields.0.fields.1
  const baseName = `${name}`;
  const typePath = `${baseName}.type`;
  const fieldVal = watch(baseName);

  const {
    fields: nestedFields,
    append: nestedAppend,
    remove: nestedRemove,
  } = useFieldArray({
    control,
    name: `${baseName}.fields`,
  });

  // On type change, clear/add fields as appropriate
  const handleTypeChange = (type: FieldType) => {
    setValue(typePath, type);
    if (type === "nested" && !fieldVal.fields) {
      setValue(`${baseName}.fields`, [{ ...DEFAULT_FIELD }]);
    }
    if (type !== "nested") {
      setValue(`${baseName}.fields`, undefined);
    }
  };

  return (
    <div style={{ marginLeft: nestIndex.length * 16 }}>
      <Space align="start">
        {/* Use Controller for AntD Input */}
        <Controller
          name={`${baseName}.key`}
          control={control}
          render={({ field }) => (
            <Input
              style={{ width: 140 }}
              placeholder="Field Key"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={typePath}
          render={({ field }) => (
            <Select
              options={typeOptions}
              value={field.value}
              onChange={handleTypeChange}
              style={{ width: 110 }}
            />
          )}
        />
        {remove && (
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => remove(nestIndex[nestIndex.length - 1])}
          />
        )}
      </Space>
      {/* Nested Fields */}
      {fieldVal?.type === "nested" && (
        <div style={{ marginTop: 10, marginLeft: 20 }}>
          {nestedFields.map((field, idx) => (
            <SchemaField
              key={field.id}
              nestIndex={[...nestIndex, idx]}
              name={`${baseName}.fields.${idx}`}
              remove={nestedRemove}
            />
          ))}
          <Button
            style={{ marginTop: 8 }}
            icon={<PlusOutlined />}
            onClick={() => nestedAppend({ ...DEFAULT_FIELD })}
            size="small"
          >
            Add Field
          </Button>
          <Divider />
        </div>
      )}
    </div>
  );
};
