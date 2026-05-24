import dayjs from "dayjs";
import { BlockHeader, Link, List, ListButton, ListInput, Navbar, Page } from "konsta/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import {
  useGetWeightItemByIdQuery,
  useUpdateWeightMutation,
} from "../../store/apiSlice";

interface IWeightForm {
  weight: number | string;
  height: number | string;
  weightTime: string;
  note: string;
}

export async function loader() {
  return {
    title: "编辑体重记录",
  };
}

export const Component = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetWeightItemByIdQuery(
    { _id: id! },
    { skip: !id }
  );
  const [updateWeight, { isLoading: isUpdating }] = useUpdateWeightMutation();

  const [form, setForm] = useState<IWeightForm>({
    weight: "",
    height: "",
    weightTime: dayjs().format("YYYY-MM-DD HH:mm"),
    note: "",
  });

  const weightItem = data?.data;

  useEffect(() => {
    if (weightItem) {
      setForm({
        weight: weightItem.weight ?? "",
        height: weightItem.height ?? "",
        weightTime: weightItem.weightTime
          ? dayjs(weightItem.weightTime).format("YYYY-MM-DD HH:mm")
          : "",
        note: weightItem.note ?? "",
      });
    }
  }, [weightItem]);

  const handleSave = async () => {
    const { weight, height, weightTime, note } = form;
    const parseWeight = weight !== "" ? Number(weight) : undefined;
    const parseHeight = height !== "" ? Number(height) : undefined;

    if (parseWeight !== undefined && isNaN(parseWeight)) {
      GlobalNotificationService.next({
        opened: true,
        title: "请输入合格的体重数据",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }
    if (parseHeight !== undefined && isNaN(parseHeight)) {
      GlobalNotificationService.next({
        opened: true,
        title: "请输入合格的身高数据",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }
    if (parseWeight === undefined && parseHeight === undefined) {
      GlobalNotificationService.next({
        opened: true,
        title: "体重和身高至少填写一项",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }
    if (!weightTime) {
      GlobalNotificationService.next({
        opened: true,
        title: "日期不能为空",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
      return;
    }
    if (isUpdating) return;

    const submitData: Record<string, unknown> = { weightTime, note };
    if (parseWeight !== undefined) submitData.weight = parseWeight;
    if (parseHeight !== undefined) submitData.height = parseHeight;

    try {
      const res = await updateWeight({ _id: id!, ...submitData });
      if (res?.data?.success) {
        GlobalNotificationService.next({
          opened: true,
          title: "修改成功",
          icon: <IconFont icon="icon-chenggong" className="text-3xl" />,
          duration: 2000,
        });
        navigate(-1);
      } else {
        GlobalNotificationService.next({
          opened: true,
          title: "修改失败",
          subtitle: "请稍后重试",
          icon: <IconFont icon="icon-shibai" className="text-3xl" />,
          duration: 2000,
        });
      }
    } catch {
      GlobalNotificationService.next({
        opened: true,
        title: "修改失败",
        subtitle: "请稍后重试",
        icon: <IconFont icon="icon-shibai" className="text-3xl" />,
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <Page>
        <Navbar title="编辑体重记录" centerTitle left={<Link onClick={() => navigate(-1)}><IconFont icon="icon-houtui" className="text-base" /></Link>} />
        <div className="p-4 text-center">加载中...</div>
      </Page>
    );
  }

  return (
    <Page>
      <Navbar
        title="编辑体重记录"
        centerTitle
        left={
          <Link onClick={() => navigate(-1)}>
            <IconFont icon="icon-houtui" className="text-base" />
          </Link>
        }
      />
      <BlockHeader>体重/身高记录</BlockHeader>
      <List strong inset>
        <ListInput
          label="本次的体重?(单位kg)"
          type="number"
          accept="number"
          value={form.weight}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, weight: e.target.value }))
          }
          pattern="[0-9.]*"
          placeholder="请输入本次的体重单位kg"
          media={<IconFont icon="icon-yinger" />}
        />
        <ListInput
          label="本次的身高?(单位cm)"
          type="number"
          accept="number"
          value={form.height}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, height: e.target.value }))
          }
          pattern="[0-9.]*"
          placeholder="请输入本次的身高单位cm"
          media={<IconFont icon="icon-yinger" />}
        />
        <ListInput
          label="称重时间"
          type="datetime-local"
          value={form.weightTime}
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => ({
              ...prev,
              weightTime: value
                ? dayjs(value).format("YYYY-MM-DD HH:mm")
                : "",
            }));
          }}
          media={<IconFont icon="icon-shijianrili" />}
        />
        <ListInput
          label="备注"
          type="textarea"
          placeholder="请输入其他的备注信息"
          value={form.note}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, note: e.target.value }))
          }
          media={<IconFont icon="icon-jishiben" className="text-2xl" />}
          inputClassName="!h-20 resize-none"
        />
      </List>
      <List strong inset>
        <ListButton onClick={handleSave} linkProps={{ disabled: isUpdating }}>
          保存修改
        </ListButton>
      </List>
    </Page>
  );
};

Component.displayName = "EditWeight";