import dayjs from "dayjs";
import {
  Card,
  Link,
  Navbar,
  Page,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "konsta/react";
import { useNavigate } from "react-router";
import IconFont from "../../components/IconFont";
import {
  useGetWeightListQuery,
  useRemoveWeightItemByIdMutation,
} from "../../store/apiSlice";

export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  const { isFetching, data } = useGetWeightListQuery({
    current: 1,
    pageSize: 100,
  });
  const [removeHandler, { isLoading: removeIsLoading }] =
    useRemoveWeightItemByIdMutation();
  const navigate = useNavigate();

  const { list = [] } = data?.data || {};

  return (
    <Page>
      <Navbar
        title="最近一百条体重记录"
        centerTitle
        left={
          <Link
            onClick={() => {
              navigate(-1);
            }}
          >
            <IconFont icon="icon-houtui" className="text-base" />
          </Link>
        }
      />

      <Card className="overflow-x-auto" contentWrap={false}>
        <Table>
          <TableHead>
            <TableRow header>
              <TableCell header>体重</TableCell>
              <TableCell header className="text-center">
                时间
              </TableCell>
              <TableCell header className="text-center">
                备注
              </TableCell>
              <TableCell header className="text-center">
                操作
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item: any) => {
              return (
                <TableRow key={item._id}>
                  <TableCell>{item.weight}kg</TableCell>
                  <TableCell className="text-center text-nowrap">
                    {dayjs(item.weightTime).format("MM-DD HH:mm")}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {item.note}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex gap-2">
                      <Link
                        className="text-blue-500 text-nowrap"
                        onClick={() => {
                          navigate(`/edit/${item._id}`);
                        }}
                      >
                        编辑
                      </Link>
                      <Link
                        className="text-red-500 text-nowrap"
                        onClick={() => {
                          if (removeIsLoading) {
                            return;
                          }
                          const res = confirm(
                            `确定要删除${dayjs(item.milkTime).format("MM-DD HH:mm")}这条数据吗？`
                          );
                          if (res) {
                            removeHandler({ _id: item._id });
                          }
                        }}
                      >
                        删除
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </Page>
  );
};

Component.displayName = "MilkAmountList";
