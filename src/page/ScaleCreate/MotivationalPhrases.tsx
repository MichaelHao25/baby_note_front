import React, { useEffect, useState } from "react";
import { Input, Button, Drawer } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { isEqual } from "lodash";

interface MotivationalPhrasesProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

const MotivationalPhrases: React.FC<MotivationalPhrasesProps> = (props) => {
    const { value = [], onChange = () => {} } = props;

    const [phrases, setPhrases] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    // useEffect(() => {
    //   if (!isEqual(value, phrases)) {
    //     setPhrases(value);
    //   }
    // }, [value, phrases])

    const handlePhraseChange = (index: number, value: string) => {
        const newPhrases = [...phrases];
        newPhrases[index] = value;
        setPhrases(newPhrases);
    };

    const handleAddPhrase = () => {
        setPhrases([...phrases, ""]);
    };

    const handleDeletePhrase = (index: number) => {
        const newPhrases = phrases.filter((_, i) => i !== index);
        setPhrases(newPhrases);
    };

    return (
        <>
            <Drawer
                open={open}
                title="设置激励的话"
                footer={null}
                width={680}
                onClose={() => setOpen(false)}
                afterOpenChange={(open) => {
                    if (open) {
                        setPhrases(value);
                    } else {
                        onChange(phrases);
                    }
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="text-gray-500">
                        自评提交后，将会从下面随机选择一段显示
                    </div>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddPhrase}
                    >
                        新增段落
                    </Button>
                </div>

                <div className="space-y-4">
                    {phrases.map((phrase, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 flex-col"
                        >
                            <div className="flex items-center gap-2 justify-between w-full">
                                <div>第{index + 1}段</div>
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeletePhrase(index)}
                                />
                            </div>
                            <div className="w-full">
                                <Input.TextArea
                                    value={phrase}
                                    onChange={(e) =>
                                        handlePhraseChange(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
            <Button type={"primary"} onClick={() => setOpen(true)}>
                设置
            </Button>
        </>
    );
};

export default MotivationalPhrases;
