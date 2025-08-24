import { AutoComplete } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useSearchTeacherQuery } from "../../../store/apiSlice.ts";

interface TeacherAutoCompleteProps {
  selectItem: (item: any) => void;
  onSearchChange?: (searchText: string) => void;
}

const TeacherAutoComplete = memo<TeacherAutoCompleteProps>(({ selectItem, onSearchChange }) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const { data, isLoading, isSuccess, refetch } = useSearchTeacherQuery({
    schoolCode: "RBI850",
    searchType: "0",
    searchText: value,
  });

  const onSearch = async (searchText: string) => {
    // @ts-ignore
    await refetch({
      schoolCode: "RBI850",
      searchType: "0",
      searchText,
    });
  };

  const onSelect = (data: any) => {
    selectItem?.(data);
  };

  const onChange = (data: string, obj) => {
    setValue(obj?.label);
  };

  useEffect(() => {
    if (data && isSuccess) {
      const list = data.data[0]?.teachers;
      if (list) {
        const newOptions = list.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        console.log("newOptions", newOptions);
        setOptions(newOptions);
      }
    }
  }, [data, isSuccess]);

  return (
    <>
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 200 }}
        onBlur={() => {
          onSearchChange?.(value);
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="输入教师名称搜索"
      />
    </>
  );
});

export default TeacherAutoComplete;
