import { Form } from "@douyinfe/semi-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { lazy, ObjectSchema } from "yup";

export type SchemaFormProps = {
  defaultValues?: any;
  yupSchema?:
    | ObjectSchema<any, any, any, any>
    | ReturnType<typeof lazy<ObjectSchema<any, any, any, any>>>;
  onSubmit: (values: any) => void;
};

export const SchemaForm = ({
  children,
  onSubmit,
  defaultValues,
  yupSchema,
}: PropsWithChildren<SchemaFormProps>) => {
  const methods = useForm({
    defaultValues,
    resolver: yupSchema ? yupResolver(yupSchema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <Form onSubmit={() => methods.handleSubmit(onSubmit)()}>{children}</Form>
    </FormProvider>
  );
};
