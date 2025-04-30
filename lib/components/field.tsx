import {
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Form,
  Input,
  InputGroup,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Switch,
  TagInput,
  TextArea,
  TimePicker,
  TreeSelect,
  Upload,
} from "@douyinfe/semi-ui";
import type { SlotProps } from "@douyinfe/semi-ui/lib/es/form";
import { get, isNil, omit } from "lodash-es";
import React, { PropsWithChildren, useMemo } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormState,
  useWatch,
} from "react-hook-form";

import type {
  AutoCompleteItems,
  AutoCompleteProps,
} from "@douyinfe/semi-ui/lib/es/autoComplete";
import type { CascaderProps } from "@douyinfe/semi-ui/lib/es/cascader";
import {
  CheckboxGroupProps,
  CheckboxProps,
} from "@douyinfe/semi-ui/lib/es/checkbox";
import type { DatePickerProps } from "@douyinfe/semi-ui/lib/es/datePicker";
import type { InputProps, TextAreaProps } from "@douyinfe/semi-ui/lib/es/input";
import type { RadioGroupProps } from "@douyinfe/semi-ui/lib/es/radio";
import type { RatingProps } from "@douyinfe/semi-ui/lib/es/rating";
import type { SelectProps } from "@douyinfe/semi-ui/lib/es/select";
import type { SliderProps } from "@douyinfe/semi-ui/lib/es/slider";
import type { SwitchProps } from "@douyinfe/semi-ui/lib/es/switch";
import type { TagInputProps } from "@douyinfe/semi-ui/lib/es/tagInput";
import type { TimePickerProps } from "@douyinfe/semi-ui/lib/es/timePicker";
import type { TreeSelectProps } from "@douyinfe/semi-ui/lib/es/treeSelect";
import type { UploadProps } from "@douyinfe/semi-ui/lib/es/upload";
import { ErrorMessage } from "@hookform/error-message";

export type JSXComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type FieldProps<ComponentProps = any> = {
  name: FieldPath<FieldValues>;
  component: JSXComponent;
  style?: React.CSSProperties;
  watch?: string[];
  visible?: boolean;
  refActive?: boolean;
  valueKey?: string;
  onKeyChangeFnName?: string;
  onKeyChangeFnValueKey?: string;
  onProps?: (
    watchValue: any[]
  ) => Partial<
    Omit<
      FieldProps<ComponentProps>,
      | "name"
      | "watch"
      | "onProps"
      | "onComponentProps"
      | "valueKey"
      | "onKeyChangeFnName"
    >
  >;
  onComponentProps?: ((watchValue: any[]) => ComponentProps) | ComponentProps;
  required?: boolean;
} & Pick<SlotProps, "label" | "className" | "labelPosition" | "noLabel">;

const OmitProps = [
  "name",
  "watch",
  "onProps",
  "onComponentProps",
  "valueKey",
  "onKeyChangeFnName",
  "onKeyChangeFnValueKey",
];

const Field = ({
  name,
  watch = [],
  onComponentProps,
  onProps,
  valueKey = "value",
  onKeyChangeFnName = "onChange",
  onKeyChangeFnValueKey = undefined,
  refActive = true,
  ...props
}: PropsWithChildren<FieldProps>) => {
  const { errors } = useFormState();

  const watchValues = useWatch({
    name: watch,
    disabled: isNil(watch) || watch.length === 0,
  });

  const {
    visible = true,
    label,
    labelPosition,
    className,
    noLabel,
    children,
    component,
    style,
  } = useMemo(() => {
    if (typeof onProps === "function") {
      return {
        ...props,
        ...omit(onProps(watchValues), OmitProps),
      };
    }

    return { ...props };
  }, [watchValues]);

  return visible ? (
    <Form.Slot
      label={label}
      className={className}
      labelPosition={labelPosition}
      noLabel={noLabel}
      error={{ error: <ErrorMessage errors={errors} name={name} /> }}
    >
      <Controller
        name={name}
        render={({ field }) =>
          React.createElement(
            component,
            {
              ...omit(field, ["ref", "value", "onChange"]),
              style,
              ...(typeof onComponentProps === "function"
                ? onComponentProps(watchValues)
                : onComponentProps || {}),
              [valueKey]: field.value,
              [onKeyChangeFnName]: (e: any) => {
                const value = onKeyChangeFnValueKey
                  ? get(e, onKeyChangeFnValueKey)
                  : e;
                field.onChange(value);
              },
              ref: refActive ? field.ref : undefined,
            },
            children
          )
        }
      ></Controller>
    </Form.Slot>
  ) : null;
};

type InnerFieldProps<ComProps = any> = PropsWithChildren<
  Omit<FieldProps<ComProps>, "component">
>;

Field.Input = (props: InnerFieldProps<InputProps>) => {
  return <Field {...props} component={Input} />;
};

Field.RadioGroup = ({
  children,
  ...props
}: InnerFieldProps<RadioGroupProps>) => {
  return (
    <Field {...props} component={RadioGroup}>
      {children}
    </Field>
  );
};

Field.Switch = ({ children, ...props }: InnerFieldProps<SwitchProps>) => {
  return (
    <Field {...props} component={Switch} valueKey="checked" refActive={false} />
  );
};

Field.TextArea = (props: InnerFieldProps<TextAreaProps>) => {
  return <Field {...props} component={TextArea} />;
};

Field.Select = ({ children, ...props }: InnerFieldProps<SelectProps>) => {
  return (
    <Field {...props} component={Select}>
      {children}
    </Field>
  );
};

Field.Checkbox = ({ children, ...props }: InnerFieldProps<CheckboxProps>) => {
  return (
    <Field
      {...props}
      component={Checkbox}
      valueKey="checked"
      onKeyChangeFnValueKey="target.checked"
    >
      {children}
    </Field>
  );
};

Field.CheckboxGroup = ({
  children,
  ...props
}: InnerFieldProps<CheckboxGroupProps>) => {
  return (
    <Field {...props} component={CheckboxGroup}>
      {children}
    </Field>
  );
};

Field.DatePicker = ({
  children,
  ...props
}: InnerFieldProps<DatePickerProps>) => {
  return (
    <Field {...props} component={DatePicker}>
      {children}
    </Field>
  );
};

Field.TimePicker = ({
  children,
  ...props
}: InnerFieldProps<TimePickerProps>) => {
  return (
    <Field {...props} component={TimePicker}>
      {children}
    </Field>
  );
};

Field.Slider = ({ children, ...props }: InnerFieldProps<SliderProps>) => {
  return (
    <Field {...props} component={Slider}>
      {children}
    </Field>
  );
};

Field.InputGroup = InputGroup;

Field.TreeSelect = ({
  children,
  ...props
}: InnerFieldProps<TreeSelectProps>) => {
  return (
    <Field {...props} component={TreeSelect}>
      {children}
    </Field>
  );
};

Field.TreeSelect = ({
  children,
  ...props
}: InnerFieldProps<TreeSelectProps>) => {
  return (
    <Field {...props} component={TreeSelect}>
      {children}
    </Field>
  );
};

Field.Cascader = ({ children, ...props }: InnerFieldProps<CascaderProps>) => {
  return (
    <Field {...props} component={Cascader}>
      {children}
    </Field>
  );
};

Field.Rating = ({ children, ...props }: InnerFieldProps<RatingProps>) => {
  return (
    <Field {...props} component={Rating}>
      {children}
    </Field>
  );
};

function FieldAutoComplete<T extends AutoCompleteItems>({
  children,
  ...props
}: InnerFieldProps<AutoCompleteProps<T>>) {
  return (
    <Field {...props} component={AutoComplete}>
      {children}
    </Field>
  );
}

Field.AutoComplete = FieldAutoComplete;

Field.Upload = ({ children, ...props }: InnerFieldProps<UploadProps>) => {
  return (
    <Field {...props} component={Upload}>
      {children}
    </Field>
  );
};

Field.TagInput = ({ children, ...props }: InnerFieldProps<TagInputProps>) => {
  return (
    <Field {...props} component={TagInput}>
      {children}
    </Field>
  );
};

Field.Section = Form.Section;

export { Field };
