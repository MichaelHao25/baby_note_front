import { CheckOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Select, Tag, Tooltip } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useLazySearchTeachersQuery } from "../../store/apiSlice";
import type { Teacher } from "../../types/api";
const typeMap = ["输入姓名，添加评价人", "输入姓名，添加审核人"];
interface ITeacherSelectProps {
    extra?: HTMLElement | null;
    /**
     * 审核还是评价 0 评价 1 审核
     */
    type?: keyof typeof typeMap;
    value?: string[];
    onChange?: (value: string[]) => void;
}
export const TeacherSelect = (props: ITeacherSelectProps) => {
    const { extra, type, value, onChange } = props;
    // All teachers list
    const refOnChange = useRef<((value: string[]) => void) | undefined>(
        undefined,
    );
    refOnChange.current = onChange;
    const [
        searchTeachers,
        { data: teachers, isFetching: searchTeachersIsFetching },
    ] = useLazySearchTeachersQuery();
    const { data: teachersDataReponse = [] } = teachers ?? {};
    const teachersData = teachersDataReponse ?? [];
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState("0");
    // State to track selected teachers
    const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]); // Initially select a few teachers
    const [selectedTeachersIds, setSelectedTeachersIds] = useState<string[]>(
        [],
    );
    const [hiddenType, setHiddenType] = useState<string[]>([]);
    // Function to toggle teacher selection
    const toggleTeacherSelection = (teacher: Teacher) => {
        if (selectedTeachers.some((t) => t.id === teacher.id)) {
            setSelectedTeachers(
                selectedTeachers.filter((t) => t.id !== teacher.id),
            );
            setSelectedTeachersIds(
                selectedTeachersIds.filter((id) => id !== teacher.id),
            );
        } else {
            setSelectedTeachers([...selectedTeachers, teacher]);
            setSelectedTeachersIds([...selectedTeachersIds, teacher.id]);
        }
    };
    useEffect(() => {
        if (refOnChange.current && value) {
            searchTeachers({
                schoolCode: "RBI850",
                searchText: "",
                searchType: "0",
            }).then((res) => {
                const allTeachers = (res.data?.data ?? [])
                    .map((item) => item.teachers)
                    .flat(2);
                const selectedTeachers = value
                    .map((id) =>
                        allTeachers.find((t) => t.id.toString() === id),
                    )
                    .filter((t) => t !== undefined);
                setSelectedTeachers(selectedTeachers);
                setSelectedTeachersIds(selectedTeachers.map((t) => t.id));
            });
        }
    }, []);
    useEffect(() => {
        if (refOnChange.current) {
            if (value?.toString() !== selectedTeachersIds.toString()) {
                refOnChange.current(selectedTeachersIds);
            }
        }
    }, [selectedTeachersIds, value]);

    // useEffect(() => {
    //     if (value) {
    // const allTeachers = teachersData
    //     .map((item) => item.teachers)
    //     .flat(2);
    // setSelectedTeachers(
    //     value
    //         .map((id) => allTeachers.find((t) => t.id === id))
    //         .filter((t): t is Teacher => t !== undefined),
    // );
    //     }
    // }, [value]);

    const dom = (
        <div className="mb-6 mt-[-10px]">
            {/* <div className="flex items-center mb-5 gap-4">
        <span>已选：55人</span>
        <Button type="primary">展开所有</Button>
      </div>  */}
            {searchType === "2" && (
                <div className="flex items-center gap-2 mb-4">
                    <div>选中学科：</div>
                    <Checkbox.Group
                        value={teachersData
                            .map((item) => item.id)
                            .filter((id) => !hiddenType.includes(id))}
                    >
                        {teachersData.map((item) => (
                            <Checkbox
                                key={item.id}
                                value={item.id}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    if (hiddenType.includes(id)) {
                                        setHiddenType(
                                            hiddenType.filter(
                                                (id2) => id2 !== id,
                                            ),
                                        );
                                    } else {
                                        setHiddenType([...hiddenType, id]);
                                    }
                                }}
                            >
                                {item.teacherName}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
            )}
            {teachersData
                .filter((item) => !hiddenType.includes(item.id))
                .map((item) => {
                    const { teacherName = "0", teachers = [], id } = item;
                    return (
                        <Fragment key={id}>
                            <div className="rounded bg-gray-200 p-2 min-h-7">
                                {teacherName}
                            </div>
                            {
                                <div className="flex flex-wrap gap-2 my-4">
                                    {teachers.map((teacher) => {
                                        const isSelected =
                                            selectedTeachers.some(
                                                (t) => t.id === teacher.id,
                                            );
                                        return (
                                            <Tag
                                                key={teacher.id}
                                                color={
                                                    isSelected
                                                        ? "green"
                                                        : "default"
                                                }
                                                className="px-3 py-1 text-sm cursor-pointer"
                                                onClick={() =>
                                                    toggleTeacherSelection(
                                                        teacher,
                                                    )
                                                }
                                            >
                                                {teacher.name}
                                            </Tag>
                                        );
                                    })}
                                    <Tag
                                        color="red"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setHiddenType([...hiddenType, id])
                                        }
                                    >
                                        不选择
                                    </Tag>
                                </div>
                            }
                        </Fragment>
                    );
                })}

            {selectedTeachers.length > 0 && (
                <div className="mb-5">
                    <div className="border border-gray-300 rounded-md p-4 min-h-[100px] bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                            {selectedTeachers
                                .filter((teacher) =>
                                    selectedTeachers.some(
                                        (t) => t.id === teacher.id,
                                    ),
                                )
                                .map((teacher) => (
                                    <Tag
                                        key={teacher.id}
                                        className="px-3 py-1 text-sm"
                                        closable
                                        onClose={() => {
                                            setSelectedTeachers(
                                                selectedTeachers.filter(
                                                    (t) => t.id !== teacher.id,
                                                ),
                                            );
                                        }}
                                    >
                                        {teacher.name}
                                    </Tag>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className="flex justify-between pb-5 gap-2">
                <div className={"flex gap-2"}>
                    <Select
                        value={searchType}
                        className="w-34!"
                        loading={searchTeachersIsFetching}
                        onChange={(value) => {
                            setSearchType(value);
                            if (value !== "0") {
                                searchTeachers({
                                    schoolCode: "RBI850",
                                    searchText: "",
                                    searchType: value,
                                });
                                setHiddenType([]);
                                setSearchText("");
                            }
                        }}
                        options={[
                            { label: "搜索姓名添加", value: "0" },
                            { label: "选择班主任", value: "1" },
                            { label: "根据学科选择", value: "2" },
                        ]}
                    />
                    <Input
                        hidden={searchType !== "0"}
                        placeholder={
                            type === 0
                                ? "输入姓名，添加审核人"
                                : "输入姓名，添加评价人"
                        }
                        className={"w-40! flex-none"}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        hidden={searchType !== "0"}
                        type="primary"
                        loading={searchTeachersIsFetching}
                        onClick={() => {
                            searchTeachers({
                                schoolCode: "RBI850",
                                searchText: searchText,
                                searchType,
                            });
                            setHiddenType([]);
                            setSearchText("");
                        }}
                    >
                        添加
                    </Button>
                </div>
                {/* <Button type="primary">一键添加</Button> */}
            </div>
            {selectedTeachers.length > 0 || teachersData.length > 0
                ? extra
                    ? ReactDOM.createPortal(dom, extra)
                    : dom
                : ""}
        </>
    );
};
