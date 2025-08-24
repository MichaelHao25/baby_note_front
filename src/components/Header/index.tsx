import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router";

interface IProps {
  title: React.ReactNode;
  extComponent?: React.ReactNode;
}
export const Header = (props: IProps) => {
  const { title, extComponent } = props;
  const navigate = useNavigate();
  return (
    <div className="flex relative p-2 justify-between">
      <h5 className=" absolute inset-0 flex justify-center items-center ">
        {title}
      </h5>
      <div>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          icon={<LeftOutlined />}
        >
          返回
        </Button>
      </div>
      <div className="flex gap-2">{extComponent}</div>
    </div>
  );
};
