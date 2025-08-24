import { Form, Input, Tag } from "antd";
import { useEffect, useRef } from "react";
import AddAttributeModal, {
    type IAddAttributeModalRef,
} from "../AddAttributeModal";
import type { AttrData } from "../../../../types/api";
import { focusIndexList, listObject } from "../AddAttributeModal/config";

interface AttributeSettingElementProps {
    onChange?: (list: AttrData[]) => void;
    attrProps?: AttrData[];
}

export const AttributeSettingElement: React.FC<
    AttributeSettingElementProps
> = ({ onChange, attrProps }) => {
    const addAttributeModalRef = useRef<IAddAttributeModalRef>(null);
    const form = Form.useFormInstance();
    const attrList: AttrData[] = Form.useWatch("attrList", form);

    useEffect(() => {
        form.setFieldsValue({
            attrList: attrProps,
        });
    }, [attrProps]);

    return (
        <>
            <div className={"flex gap-4 items-center"}>
                <span>属性设置</span>
                <AddAttributeModal
                    ref={addAttributeModalRef}
                    value={attrList}
                    onChange={(value) => {
                        form.setFieldsValue({
                            attrList: value,
                        });
                        onChange?.(value);
                    }}
                />
            </div>
            <Form.Item name={"attrList"} hidden>
                <Input type="hidden" />
            </Form.Item>
            <div
                className={
                    "flex justify-start flex-row flex-wrap gap-5 py-5 border-b border-solid border-b-gray-100"
                }
            >
                {attrList?.map((item) => {
                    const {
                        id,
                        name,
                        fileUploadingStatus,
                        optionsList = [],
                        desc,
                        focusIndex,
                        descTitle,
                    } = item;
                    const focusIndexName = focusIndexList.find(
                        (item) => item.type === focusIndex,
                    )?.name;
                    const fileUploadingStatusName = (
                        listObject[focusIndex] ?? []
                    ).find((_, index) => index === fileUploadingStatus)?.name;
                    return (
                        <div
                            key={id}
                            onClick={() => {
                                addAttributeModalRef.current?.open(item);
                            }}
                            className={`
                  p-3 rounded shadow border min-w-50 border-solid border-gray-200 flex flex-col gap-2 cursor-pointer
                  hover:bg-blue-50
                  hover:border-blue-400
                  `}
                        >
                            <div className={"flex justify-between"}>
                                <Tag color="processing">{focusIndexName}</Tag>
                                <Tag color="processing">
                                    {fileUploadingStatusName}
                                </Tag>
                            </div>
                            <div>
                                <span className={"text-gray-500"}>
                                    {focusIndex === 6 ? "上传提示：" : "说明："}
                                </span>
                                <span>{focusIndex === 6 ? desc : name}</span>
                            </div>
                            {[5].includes(focusIndex) === false && (
                                <div>
                                    <span className={"text-gray-500"}>
                                        {[0, 1].includes(focusIndex) &&
                                            "选项："}
                                        {[6].includes(focusIndex) &&
                                            "上传要求："}
                                        {[2, 3].includes(focusIndex) &&
                                            "填写要求："}
                                    </span>
                                    {[6].includes(focusIndex) ? (
                                        <span>必须提交</span>
                                    ) : [2, 3].includes(focusIndex) ? (
                                        <span>{descTitle}</span>
                                    ) : (
                                        <span>
                                            {optionsList?.map((item) => {
                                                if (!item.name) {
                                                    return null;
                                                }
                                                return (
                                                    <Tag key={item.name}>
                                                        {item.name}
                                                    </Tag>
                                                );
                                            })}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};
