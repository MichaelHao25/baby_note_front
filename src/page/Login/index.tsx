import {
  Button,
  List,
  ListButton,
  ListInput,
  Navbar,
  Page,
  Preloader,
  Toast,
} from "konsta/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { GlobalToastService } from "../../components/GlobalToast/Toast";
import IconFont from "../../components/IconFont";

export async function loader() {
  return {
    title: "教师量表",
  };
}
interface IParams {
  username: string;
  password: string;
}
export const Component = () => {
  const navigate = useNavigate();
  const [params, updateParams] = useState<IParams>({
    username: "",
    password: "",
  });
  return (
    <Page>
      <Navbar title="登录" large transparent centerTitle />
      <List strong inset>
        <ListInput
          placeholder={"请输入用户名"}
          value={params.username}
          onChange={(e) => {
            updateParams((prev) => {
              return { ...prev, username: e.target.value };
            });
          }}
          media={<IconFont icon="icon-gerenzhongxin" className="text-2xl" />}
          label="用户名"
        ></ListInput>
        <ListInput
          placeholder={"请输入密码"}
          value={params.password}
          onChange={(e) => {
            updateParams((prev) => {
              return { ...prev, password: e.target.value };
            });
          }}
          media={<IconFont icon="icon-mima" className="text-2xl" />}
          label="密码"
          type="password"
          onClear={() => {
            updateParams({
              ...params,
              password: "",
            });
          }}
          clearButton={params.password.length > 0}
        ></ListInput>
      </List>
      <List strong inset>
        <ListButton>注册</ListButton>
        <ListButton
          onClick={() => {
            navigate("/");
            GlobalToastService.next({
              opened: true,
              position: "center",
              children: "登录成功",
              button: (
                <Button
                  rounded
                  clear
                  small
                  inline
                  onClick={() => {
                    GlobalToastService.next(null);
                  }}
                >
                  关闭
                </Button>
              ),
            });
          }}
        >
          <Preloader />
          登录
        </ListButton>
      </List>
      <Toast
        position="center"
        opened={true}
        button={
          <Button rounded clear small inline onClick={() => {}}>
            Close
          </Button>
        }
      >
        <div className="shrink">Hello this is right toast!</div>
      </Toast>
    </Page>
  );
};

Component.displayName = "Login";
