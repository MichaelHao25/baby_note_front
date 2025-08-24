import { Form, Input, Tabs } from "antd";
import { EvaluationFormula } from "../EvaluationFormula";
import { RuleModal } from "../RuleModal";

interface TitleInfoItem {
    rule: string;
    key?: string | number;
    list?: string[];
}

interface RuleTabsElementProps {}

export const RuleTabsElement = ({}: RuleTabsElementProps) => {
    const form = Form.useFormInstance();
    const titleinfoList = Form.useWatch("titleinfoList", form) ?? [];
    return (
        <>
            <Form.Item name={"titleinfoList"} hidden>
                <Input type="hidden" />
            </Form.Item>
            <Tabs
                tabBarExtraContent={{ right: <EvaluationFormula /> }}
                defaultActiveKey="0"
                type="editable-card"
                onChange={(key) => {
                    console.log("key", key);
                }}
                addIcon={
                    <RuleModal
                        value={titleinfoList}
                        onChange={(value) => {
                            form.setFieldsValue({
                                titleinfoList: value,
                            });
                        }}
                    />
                }
                items={titleinfoList.map((item: TitleInfoItem) => {
                    const { rule, key } = item;
                    return {
                        label: rule,
                        key,
                        closeIcon: null,
                        children: <></>,
                    };
                })}
            />
        </>
    );
};
