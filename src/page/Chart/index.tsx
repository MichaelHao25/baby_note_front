import dayjs from "dayjs";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "konsta/react";
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

  const { list = [] } = data?.data || {};

  return (
    <>
      <Card className="overflow-x-auto" contentWrap={false}>
        <Table>
          <TableHead>
            <TableRow header>
              <TableCell header>奶量</TableCell>
              <TableCell header className="text-right">
                母乳
              </TableCell>
              <TableCell header className="text-right">
                小便
              </TableCell>
              <TableCell header className="text-right">
                大便
              </TableCell>
              <TableCell header className="text-right">
                喝奶时间
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item: any) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.milkAmount}ml</TableCell>
                  <TableCell className="text-right">
                    {item.breastMilk ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.pee ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.poo ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-right">
                    {dayjs(item.milkTime).format("YYYY-MM-DD HH:mm")}
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
