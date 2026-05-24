import dayjs from "dayjs";
import {
  Block,
  BlockHeader,
  Card,
  Chip,
  Link,
  List,
  ListButton,
  ListItem,
  Navbar,
  Page,
  Segmented,
  SegmentedButton,
} from "konsta/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { GrowthChart } from "../../components/GrowthChart";
import IconFont from "../../components/IconFont";
import { useGetBabyQuery, useGetWeightListQuery } from "../../store/apiSlice";
import type { GrowthMetric } from "../../types/growth";
import {
  calculatePercentile,
  convertWeightRecordsToGrowthPoints,
} from "../../utils/growthDataProcessor";

export async function loader() {
  return {
    title: "生长曲线",
  };
}

export const Component = () => {
  const navigate = useNavigate();
  const { data: babyData, isLoading: babyLoading } = useGetBabyQuery();
  const { data: weightData, isFetching: weightFetching } =
    useGetWeightListQuery({ current: 1, pageSize: 100 });

  const [selectedMetric, setSelectedMetric] = useState<GrowthMetric>("weight");

  const baby = babyData?.data;
  const weightRecords = weightData?.data?.list || [];

  // 转换宝宝数据格式
  const babyInfo = baby
    ? {
        _id: baby._id,
        name: baby.name,
        gender: baby.gender,
        birthDate: new Date(baby.birthDate),
        prematureDays: baby.prematureDays,
      }
    : null;

  // 转换数据
  const growthData = babyInfo
    ? convertWeightRecordsToGrowthPoints(
        weightRecords,
        babyInfo.birthDate,
        babyInfo.prematureDays,
      )
    : [];

  // 计算最新评估结果
  const latestData =
    growthData.length > 0 ? growthData[growthData.length - 1] : null;
  const assessment =
    babyInfo && latestData
      ? calculatePercentile(
          latestData.value,
          latestData.age,
          selectedMetric,
          babyInfo.gender,
        )
      : null;

  // 指标选项
  const metricOptions: GrowthMetric[] = [
    "weight",
    "length",
    "bmi",
    "headCircumference",
  ];
  const metricLabels: Record<GrowthMetric, string> = {
    weight: "体重",
    length: "身长",
    bmi: "BMI",
    headCircumference: "头围",
  };
  const metricUnits: Record<GrowthMetric, string> = {
    weight: "kg",
    length: "cm",
    bmi: "",
    headCircumference: "cm",
  };

  return (
    <Page>
      <Navbar
        title="生长曲线"
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

      {/* 宝宝信息 */}
      {babyInfo && !babyLoading && (
        <>
          <BlockHeader>宝宝信息</BlockHeader>
          <List strong inset>
            <ListItem
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold">{babyInfo.name}</span>
                  <span className="text-xs text-gray-500">
                    {dayjs(babyInfo.birthDate).format("YYYY年MM月DD日")}
                  </span>
                </div>
              }
              subtitle={
                babyInfo.prematureDays > 0
                  ? `早产${babyInfo.prematureDays}天`
                  : "足月生产"
              }
              link
              onClick={() => navigate("/baby")}
            />
          </List>
        </>
      )}

      {/* 指标切换 */}
      <BlockHeader>生长指标</BlockHeader>
      <Block>
        <Segmented strong>
          {metricOptions.map((metric) => (
            <SegmentedButton
              key={metric}
              active={selectedMetric === metric}
              onClick={() => setSelectedMetric(metric)}
              style={{
                backgroundColor:
                  selectedMetric === metric
                    ? selectedMetric === "weight"
                      ? "#1890ff"
                      : "#52c41a"
                    : undefined,
                color: selectedMetric === metric ? "#fff" : undefined,
              }}
            >
              {metricLabels[metric]}
            </SegmentedButton>
          ))}
        </Segmented>
      </Block>

      {/* 生长曲线图表 */}
      <Card
        header={`${metricLabels[selectedMetric]}生长曲线`}
        contentWrapPadding="pt-0"
      >
        {weightFetching ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            加载中...
          </div>
        ) : babyInfo && growthData.length > 0 ? (
          <GrowthChart
            config={{
              metric: selectedMetric,
              gender: babyInfo.gender,
              curveType: "age",
              babyData: growthData,
              babyInfo: babyInfo,
            }}
            height={280}
          />
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-400">
            暂无数据，请添加测量记录
          </div>
        )}
      </Card>

      {/* 评估结果 */}
      {assessment && latestData && (
        <>
          <BlockHeader>生长评估</BlockHeader>
          <Block>
            <Card
              className={
                assessment.status === "low"
                  ? "!bg-red-50"
                  : assessment.status === "high"
                    ? "!bg-yellow-50"
                    : "!bg-green-50"
              }
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">当前值</span>
                  <span className="font-bold">
                    {latestData.value}
                    {metricUnits[selectedMetric]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">评估结果</span>
                  <Chip
                    style={{
                      backgroundColor:
                        assessment.status === "low"
                          ? "#fee"
                          : assessment.status === "high"
                            ? "#ffd"
                            : "#efe",
                    }}
                  >
                    P{assessment.percentile}
                  </Chip>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700">{assessment.advice}</p>
                </div>
              </div>
            </Card>
          </Block>
        </>
      )}

      {/* 测量记录列表 */}
      <BlockHeader>最近测量记录</BlockHeader>

      {growthData.length === 0 ? (
        <Card contentWrapPadding="p-8">
          <div className="text-center text-gray-400">
            <p className="mb-4">还没有测量记录</p>
            <ListButton onClick={() => navigate("/weight")}>
              添加第一次测量
            </ListButton>
          </div>
        </Card>
      ) : (
        <List strong inset dividers>
          {growthData
            .slice(-10)
            .reverse()
            .map((item, index) => {
              return (
                <ListItem
                  key={`${item.date.toISOString()}-${index}`}
                  title={
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {item.value}
                        {metricUnits[selectedMetric]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.age.toFixed(1)}月
                      </span>
                    </div>
                  }
                  subtitle={dayjs(item.date).format("YYYY-MM-DD")}
                />
              );
            })}
        </List>
      )}

      {/* 查看更多 */}
      {growthData.length > 10 && (
        <List strong inset>
          <ListButton onClick={() => navigate("/weightList")}>
            查看全部记录
          </ListButton>
        </List>
      )}
    </Page>
  );
};

Component.displayName = "Growth";
