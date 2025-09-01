import dayjs from "dayjs";
import {
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "konsta/react";
import { useNavigate } from "react-router";
import { useGetEatListQuery } from "../../store/apiSlice";

export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  const { isFetching, data } = useGetEatListQuery({
    current: 1,
    pageSize: 100,
  });
  const navigate = useNavigate();

  const { list = [] } = data?.data || {};

  return (
    <>
      <Card className="overflow-x-auto" contentWrap={false}>
        <Table>
          <TableHead>
            <TableRow header>
              <TableCell header>奶量</TableCell>
              <TableCell header className="text-center">
                母乳
              </TableCell>
              <TableCell header className="text-center">
                小便
              </TableCell>
              <TableCell header className="text-center">
                大便
              </TableCell>
              <TableCell header className="text-center">
                喝水
              </TableCell>
              <TableCell header className="text-center">
                喝奶时间
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
                <TableRow key={item.id}>
                  <TableCell>{item.milkAmount}ml</TableCell>
                  <TableCell className="text-center">
                    {item.breastMilk === true && "✅"}
                    {item.breastMilk === false && "❌"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.pee === true && "✅"}
                    {item.pee === false && "❌"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.poo === true && "✅"}
                    {item.poo === false && "❌"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.drinkWater === true && "✅"}
                    {item.drinkWater === false && "❌"}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {dayjs(item.milkTime).format("MM-DD HH:mm")}
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
                      <Link className="text-red-500 text-nowrap">删除</Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

Component.displayName = "Chart";
