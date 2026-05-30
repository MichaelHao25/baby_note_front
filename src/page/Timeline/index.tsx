import dayjs from "dayjs";
import {
  BlockHeader,
  BlockTitle,
  Link,
  List,
  ListButton,
  ListInput,
  ListItem,
} from "konsta/react";
import { useState } from "react";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import { ImageUploader } from "../../components/ImageUploader";
import ImageViewer from "../../components/ImageViewer";
import {
  useAddTimelineMutation,
  useGetTimelineListQuery,
  useRemoveTimelineItemByIdMutation,
} from "../../store/apiSlice";

export async function loader() {
  return {
    title: "教师量表",
  };
}
const defaultParams = {
  noteTime: dayjs().format("YYYY-MM-DD HH:mm"),
  note: "",
  images: [] as string[],
};
interface ITimelineRequest {
  noteTime: string;
  note: string;
  images: string[];
}

export const Component = () => {
  const [params, updateParams] = useState<ITimelineRequest>(defaultParams);
  const [handler, { isLoading }] = useAddTimelineMutation();
  const { data: { data: { list } = {} } = {} } = useGetTimelineListQuery({
    current: 1,
    pageSize: 100,
  });
  const [removeHandler, { isLoading: removeIsLoading }] =
    useRemoveTimelineItemByIdMutation();

  // 图片预览状态
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const openViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  return (
    <>
      <BlockHeader>时间线</BlockHeader>
      <List strong inset>
        <ListInput
          label="想要记点什么呢？"
          type="textarea"
          placeholder="请输入想要记录的内容"
          value={params.note as string}
          onChange={(e) =>
            updateParams((prev) => {
              return { ...prev, note: e.target.value };
            })
          }
          media={<IconFont icon="icon-jishiben" className="text-2xl" />}
          inputClassName="!h-20 resize-none"
        />

        <ListInput
          label={`时间`}
          type="datetime-local"
          value={params.noteTime}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return {
                ...prev,
                noteTime: value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "",
              };
            });
          }}
          media={<IconFont icon="icon-shijianrili" />}
        />

        <li className="px-4 pb-3">
          <ImageUploader
            module="timeline"
            value={params.images}
            onChange={(urls) =>
              updateParams((prev) => ({ ...prev, images: urls }))
            }
          />
        </li>
      </List>
      <List strong inset>
        <ListButton
          onClick={() => {
            const { note, noteTime, images } = params;
            if (!note) {
              alert("记录的内容不能为空");
              return;
            }
            if (!noteTime) {
              alert("日期不能为空");
              return;
            }
            if (isLoading) {
              return;
            }
            handler({ noteTime, note, images }).then((res) => {
              if (res?.data?.success) {
                const resetParams = {
                  noteTime: dayjs().format("YYYY-MM-DD HH:mm"),
                  note: "",
                  images: [] as string[],
                };
                updateParams(resetParams);
                GlobalNotificationService.next({
                  opened: true,
                  title: "添加成功",
                  subtitle: "本次记录添加成功,继续加油哦",
                  icon: <IconFont icon="icon-chenggong" className="text-3xl" />,
                  duration: 2000,
                });
              } else {
                GlobalNotificationService.next({
                  opened: true,
                  title: "添加失败",
                  subtitle: "本次记录添加失败，请稍后重试",
                  icon: <IconFont icon="icon-shibai" className="text-3xl" />,
                  duration: 2000,
                });
              }
            });
          }}
        >
          添加
        </ListButton>
      </List>
      <BlockTitle>最近的事件</BlockTitle>
      <List strong>
        {(list ?? [])?.map((item: any) => {
          const { note, noteTime, _id, images = [] } = item;
          return (
            <ListItem
              key={_id}
              title={note}
              header={dayjs(noteTime).format("MM-DD HH:mm")}
              after={
                <Link
                  onClick={() => {
                    if (removeIsLoading) {
                      return;
                    }
                    const res = confirm(`确定要删除${note}这条数据吗？`);
                    if (res) {
                      removeHandler({ _id });
                    }
                  }}
                >
                  删除
                </Link>
              }
            >
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {images.map((url: string, idx: number) => (
                    <img
                      key={url}
                      src={url}
                      className="w-full aspect-square object-cover rounded"
                      alt=""
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewer(images, idx);
                      }}
                    />
                  ))}
                </div>
              )}
            </ListItem>
          );
        })}
      </List>

      <ImageViewer
        images={viewerImages}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </>
  );
};

Component.displayName = "Timeline";
