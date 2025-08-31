import { BlockHeader } from "konsta/react";

export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  return (
    <>
      <BlockHeader>开发中....3</BlockHeader>
    </>
  );
};

Component.displayName = "Yellow";
