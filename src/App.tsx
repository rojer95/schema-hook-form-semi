import { IconUpload } from "@douyinfe/semi-icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputGroup,
  InputNumber,
  Radio,
  RadioGroup,
  Space,
  TagInput,
} from "@douyinfe/semi-ui";
import { AutoCompleteProps } from "@douyinfe/semi-ui/lib/es/autoComplete";
import { InputNumberProps } from "@douyinfe/semi-ui/lib/es/inputNumber";
import { UploadProps } from "@douyinfe/semi-ui/lib/es/upload";
import { scan } from "react-scan";
import * as yup from "yup";
import { zh } from "yup-locales";
import { Field, FieldArray, SchemaForm } from "../lib";
import { FieldArrayTable } from "../lib/components/field-array";
import { yupResolver } from "@hookform/resolvers/yup";

yup.setLocale(zh);
scan({ enabled: true });

const schema = yup.object({
  name: yup.string().required().max(24).label("姓名"),
  sex: yup.string().required().oneOf(["1", "0"]).required().label("性别"),
  active: yup.boolean().required().label("激活"),
  idtype: yup
    .string()
    .required()
    .oneOf(["idcard", "passport"])
    .required()
    .label("身份类型"),
  idcard: yup.string().when("idtype", {
    is: "idcard",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.strip(),
  }),
  passport: yup.string().when("idtype", {
    is: "passport",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.strip(),
  }),
});

export default () => {
  const treeData = [
    {
      label: "亚洲",
      value: "Asia",
      key: "0",
      children: [
        {
          label: "中国",
          value: "China",
          key: "0-0",
          children: [
            {
              label: "北京",
              value: "Beijing",
              key: "0-0-0",
            },
            {
              label: "上海",
              value: "Shanghai",
              key: "0-0-1",
            },
          ],
        },
      ],
    },
    {
      label: "北美洲",
      value: "North America",
      key: "1",
    },
  ];

  return (
    <>
      <SchemaForm
        onSubmit={(values) => {
          console.log("values", values);
        }}
        resolver={yupResolver(schema)}
      >
        <Field.Input name="name" label="姓名" />
        <Field.RadioGroup name="sex" label="性别" required>
          <Radio value={"1"}>男</Radio>
          <Radio value={"0"}>女</Radio>
        </Field.RadioGroup>
        <Field.Switch name="active" label="激活" />
        <Field.TextArea name="TextArea" label="TextArea" />
        <Field.Select
          name="Select"
          label="Select"
          onComponentProps={() => ({
            style: { width: 200 },
            optionList: [
              { label: "AAA", value: "AAA" },
              { label: "BBB", value: "BBB" },
              { label: "CCC", value: "CCC" },
            ],
          })}
        />
        <Field.Checkbox name="Checkbox" label="Checkbox">
          你好
        </Field.Checkbox>

        <Field.CheckboxGroup name="CheckboxGroup" label="CheckboxGroup">
          <Checkbox value="A">A</Checkbox>
          <Checkbox value="B">B</Checkbox>
          <Checkbox value="C">C</Checkbox>
          <Checkbox value="D">D</Checkbox>
          <Checkbox value="E">E</Checkbox>
        </Field.CheckboxGroup>
        <Field.DatePicker
          name="DatePicker"
          label="DatePicker"
          onComponentProps={{ type: "dateTimeRange" }}
        />
        <Field.TimePicker name="TimePicker" label="TimePicker" />
        <Field.Slider name="Slider" label="Slider" />

        <InputGroup label={{ text: "Input Group" }} labelPosition="top">
          <Field.Input name="InputGroup1" />
          <Field.Input name="InputGroup2" />
        </InputGroup>

        <Field.TreeSelect
          name="TreeSelect"
          label="TreeSelect"
          onComponentProps={() => ({
            treeData,
          })}
        />

        <Field.Cascader
          name="Cascader"
          label="Cascader"
          onComponentProps={() => ({
            treeData,
          })}
        />

        <Field.Rating name="Rating" label="Rating" />

        <Field.AutoComplete
          name="AutoComplete"
          label="AutoComplete"
          onComponentProps={() =>
            ({
              data: ["gmail.com", "163.com", "qq.com"],
            } as AutoCompleteProps<string>)
          }
        />

        <Field.Upload
          name="Upload"
          label="Upload"
          onComponentProps={() =>
            ({
              action: "//semi.design/api/upload",
            } as UploadProps)
          }
        >
          <Button icon={<IconUpload />} theme="light">
            点击上传
          </Button>
        </Field.Upload>

        <Field name="TagInput" label="TagInput" component={TagInput}></Field>

        <Form.Section text="身份信息">
          <div style={{ display: "flex" }}>
            <Field
              name="idtype"
              label="证件类型"
              component={RadioGroup}
              onComponentProps={() => ({
                options: [
                  { label: "身份证", value: "idcard" },
                  { label: "护照", value: "passport" },
                ],
              })}
            />
            <Field
              name="idcard"
              label="证件号"
              component={Input}
              watch={["idtype"]}
              onProps={([idtype]) => ({ visible: idtype === "idcard" })}
            />
            <Field
              name="passport"
              label="护照号"
              component={Input}
              watch={["idtype"]}
              onProps={([idtype]) => ({ visible: idtype === "passport" })}
            />
          </div>
        </Form.Section>
        <Form.Section>
          <FieldArray name="skus">
            {({ fields, append, remove }) => {
              return (
                <>
                  <FieldArrayTable
                    columns={[
                      {
                        dataIndex: "name",
                        title: "名称",
                        render: (name) => (
                          <Field name={name} component={Input} noLabel />
                        ),
                      },
                      {
                        dataIndex: "price",
                        title: "价格",
                        render: (name) => (
                          <Field
                            name={name}
                            component={InputNumber}
                            onComponentProps={() =>
                              ({ precision: 2, min: 0 } as InputNumberProps)
                            }
                            noLabel
                          />
                        ),
                      },
                      {
                        dataIndex: "action",
                        title: "操作",
                        width: 100,
                        render: (_, index) => (
                          <Space>
                            <Button
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              删除
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                    fields={fields}
                  />
                  <div>
                    <Button
                      onClick={() => {
                        append({ name: "" });
                      }}
                    >
                      添加一行
                    </Button>
                  </div>
                </>
              );
            }}
          </FieldArray>
        </Form.Section>
        <Button htmlType="submit">提交</Button>
      </SchemaForm>
    </>
  );
};
