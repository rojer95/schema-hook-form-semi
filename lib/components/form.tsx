import { Form } from "@douyinfe/semi-ui";
import { PropsWithChildren } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";

export type SchemaFormProps = {
  defaultValues?: any;
  resolver?: Resolver<any>;
  onSubmit: (values: any) => void;
};

export const SchemaForm = ({
  children,
  onSubmit,
  defaultValues,
  resolver,
}: PropsWithChildren<SchemaFormProps>) => {
  const methods = useForm({
    defaultValues,
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <Form onSubmit={() => methods.handleSubmit(onSubmit)()}>{children}</Form>
    </FormProvider>
  );
};
