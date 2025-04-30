import React, { useContext } from "react";
import {
  FieldArrayPath,
  FieldArrayWithId,
  FieldPath,
  FieldValues,
  useFieldArray,
  UseFieldArrayReturn,
} from "react-hook-form";

export type FieldArrayProps = {
  name: FieldPath<FieldValues>;
  children: (useFieldArrayReturn: UseFieldArrayReturn) => React.ReactNode;
};

const FieldArrayContext = React.createContext<{
  fieldArrayName: FieldPath<FieldValues>;
}>({
  fieldArrayName: "",
});

export const FieldArray = ({ name, children }: FieldArrayProps) => {
  const useFieldArrayReturn = useFieldArray({ name });
  return (
    <FieldArrayContext.Provider value={{ fieldArrayName: name }}>
      {children(useFieldArrayReturn)}
    </FieldArrayContext.Provider>
  );
};

export type FieldArrayTableProps = {
  columns: {
    width?: number;
    dataIndex: string;
    title: React.ReactNode;
    render: (name: FieldPath<FieldValues>, index: number) => React.ReactNode;
  }[];
  fields: FieldArrayWithId<FieldValues, FieldArrayPath<FieldValues>, string>[];
};

export const FieldArrayTable = ({ columns, fields }: FieldArrayTableProps) => {
  const { fieldArrayName } = useContext(FieldArrayContext);
  return (
    <table className="semi-table semi-table-small">
      <colgroup className="semi-table-colgroup">
        {columns.map((column) => (
          <col
            key={column.dataIndex}
            className="semi-table-col"
            style={{
              width: column.width,
              minWidth: column.width,
            }}
          />
        ))}
      </colgroup>
      <thead className="semi-table-thead">
        <tr className="semi-table-row">
          {columns.map((column) => (
            <td key={column.dataIndex} className="semi-table-row-head">
              {column.title as React.ReactNode}
            </td>
          ))}
        </tr>
      </thead>
      <tbody className="semi-table-tbody">
        {fields.map((field, index) => {
          return (
            <tr key={field.id} className="semi-table-row">
              {columns.map((column) => (
                <td className="semi-table-row-cell" key={column.dataIndex}>
                  {column.render(
                    `${fieldArrayName}.${index}.${column.dataIndex}`,
                    index
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
