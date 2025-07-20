import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Button, Tabs, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SchemaField } from "./SchemaField";
import { JsonPreview } from "./JsonPreview";
import { FieldType } from "../types/schema";

const DEFAULT_FIELD = {
  key: "",
  type: "string" as FieldType,
};

export const SchemaBuilder: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      fields: [
        { ...DEFAULT_FIELD },
      ],
    },
  });

  const { control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  const allFields = watch("fields");

  return (
    <FormProvider {...methods}>
      <div style={{ maxWidth: 700, margin: "32px auto" }}>
        <Tabs
          defaultActiveKey="builder"
          items={[
            {
              key: "builder",
              label: "Builder",
              children: (
                <>
                  <Typography.Title level={4}>JSON Schema Builder</Typography.Title>
                  {fields.map((field, index) => (
                    <SchemaField
                      key={field.id}
                      nestIndex={[index]}
                      name={`fields.${index}`}
                      remove={remove}
                    />
                  ))}
                  <Button
                    style={{ marginTop: 16 }}
                    icon={<PlusOutlined />}
                    onClick={() => append({ ...DEFAULT_FIELD })}
                  >
                    Add Field
                  </Button>
                </>
              ),
            },
            {
              key: "json",
              label: "JSON Preview",
              children: <JsonPreview fields={allFields} />,
            },
          ]}
        />
      </div>
    </FormProvider>
  );
};
