import {
  BlockTitle,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  Popover,
  Tabbar,
  TabbarLink,
  ToolbarPane,
} from "konsta/react";
import { useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import IconFont from "../../components/IconFont";

const config = [
  {
    path: "/",
    icon: <IconFont icon="icon-zhishifufeiqiapianicon-" className="text-4xl" />,
    label: "吃饭饭",
  },
  {
    path: "/weight",
    icon: <IconFont icon="icon-tizhongcheng" className="text-4xl" />,
    label: "称体重",
  },
  {
    path: "/yellow",
    icon: (
      <IconFont icon="icon-xinshengerhuangdanceding" className="text-4xl" />
    ),
    label: "测黄疸",
  },
  {
    path: "/chart",
    icon: <IconFont icon="icon-tubiao" className="text-4xl" />,
    label: "报表",
  },
];
export const HomeLayout = () => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const popoverTargetRef = useRef(null);
  const navigate = useNavigate();

  const openPopover = () => {
    setPopoverOpened(true);
  };
  return (
    <Page>
      <Navbar
        title="安安记事本"
        large
        transparent
        centerTitle
        right={
          <Link onClick={(e) => openPopover()} ref={popoverTargetRef}>
            <IconFont icon="icon-gengduo" className="text-2xl" />
          </Link>
        }
      />
      <BlockTitle>
        最近七天的平均喝奶情况(480ml)相较于上周(430ml)有所上涨
      </BlockTitle>

      <Popover
        opened={popoverOpened}
        target={popoverTargetRef.current}
        onBackdropClick={() => setPopoverOpened(false)}
      >
        <List nested>
          <ListItem
            title="待开发"
            link
            onClick={() => setPopoverOpened(false)}
          />
          <ListItem
            title="待开发"
            link
            onClick={() => setPopoverOpened(false)}
          />
          <ListItem
            title="待开发"
            link
            onClick={() => setPopoverOpened(false)}
          />
        </List>
      </Popover>
      <Outlet />
      <div className="h-16"></div>
      <Tabbar labels={true} icons={true} className="left-0 bottom-0 fixed">
        <ToolbarPane>
          {config.map((item) => {
            return (
              <TabbarLink
                key={item.path}
                active={window.location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                }}
                icon={item.icon}
                label={item.label}
              />
            );
          })}
        </ToolbarPane>
      </Tabbar>
    </Page>
  );
};
