import dayjs from "dayjs";
import { BlockHeader, Link, List, ListButton, ListInput, ListItem, Navbar, Page, Radio } from "konsta/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import {
  useAddBabyMutation,
  useGetBabyQuery,
  useUpdateBabyMutation,
} from "../../store/apiSlice";

export async function loader() {
  return {
    title: "宝宝信息",
  };
}

export const Component = () => {
  const navigate = useNavigate();
  const { data: babyData, isLoading } = useGetBabyQuery();
  const [addBaby, { isLoading: isAdding }] = useAddBabyMutation();
  const [updateBaby, { isLoading: isUpdating }] = useUpdateBabyMutation();

  const existingBaby = babyData?.data;
  const [name, setName] = useState(existingBaby?.name ?? "");
  const [gender, setGender] = useState(existingBaby?.gender ?? "male");
  const [birthDate, setBirthDate] = useState(
    existingBaby?.birthDate
      ? dayjs(existingBaby.birthDate).format("YYYY-MM-DD")
      : ""
  );
  const [prematureDays, setPrematureDays] = useState(
    existingBaby?.prematureDays?.toString() ?? "0"
  );

  // 当数据加载完成后同步表单
  useEffect(() => {
    if (existingBaby) {
      setName(existingBaby.name ?? "");
      setGender(existingBaby.gender ?? "male");
      setBirthDate(
        existingBaby.birthDate
          ? dayjs(existingBaby.birthDate).format("YYYY-MM-DD")
          : ""
      );
      setPrematureDays(existingBaby.prematureDays?.toString() ?? "0");
    }
  }, [existingBaby]);

  const handleSave = async () => {
    if (!name.trim()) {
      GlobalNotificationService.next({
        opened: true,
        title: "请输入婴儿姓名",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }
    if (!birthDate) {
      GlobalNotificationService.next({
        opened: true,
        title: "请选择出生日期",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }

    const isEditing = !!existingBaby?._id;
    const body = { name: name.trim(), gender, birthDate, prematureDays: Number(prematureDays) || 0 };

    try {
      let res;
      if (isEditing) {
        res = await updateBaby({ _id: existingBaby._id, body });
      } else {
        res = await addBaby(body);
      }

      if (res?.data?.success) {
        GlobalNotificationService.next({
          opened: true,
          title: "保存成功",
          subtitle: "宝宝信息已保存",
          icon: <IconFont icon="icon-chenggong" className="text-3xl" />,
          duration: 2000,
        });
        navigate("/");
      } else {
        GlobalNotificationService.next({
          opened: true,
          title: "保存失败",
          subtitle: "请稍后重试",
          icon: <IconFont icon="icon-shibai" className="text-3xl" />,
          duration: 2000,
        });
      }
    } catch {
      GlobalNotificationService.next({
        opened: true,
        title: "保存失败",
        subtitle: "请稍后重试",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  return (
    <Page>
      <Navbar
        title="宝宝信息"
        left={
          <Link onClick={() => navigate(-1)}>
            <IconFont icon="icon-houtui" className="text-base" />
          </Link>
        }
      />

      <BlockHeader>宝宝信息</BlockHeader>
      <List strong inset>
        <ListInput
          label="姓名"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入婴儿姓名"
          media={<IconFont icon="icon-yinger" />}
        />
        <ListItem
          label
          title="男"
          media={<IconFont icon="icon-nanhai" />}
          after={<Radio
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
          />}
        />
        <ListItem
          label
          title="女"
          media={<IconFont icon="icon-nvhai" />}
          after={<Radio
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
          />}
        />
        <ListInput
          label="出生日期"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          media={<IconFont icon="icon-shijianrili" />}
        />
        <ListInput
          label="早产天数"
          type="number"
          value={prematureDays}
          onChange={(e) => setPrematureDays(e.target.value)}
          placeholder="0 表示非早产"
          media={<IconFont icon="icon-shijianrili" />}
        />
      </List>
      <List strong inset>
        <ListButton
          onClick={handleSave}
          linkProps={{ disabled: isAdding || isUpdating }}
        >
          保存
        </ListButton>
      </List>
    </Page>
  );
};

Component.displayName = "Baby";