import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import "./App.css";
import GlobalSpinner from "./components/GlobalSpinner";
import { HomeLayout } from "./Layout/HomeLayout";
import { Page404 } from "./page/404";
import type { RootState } from "./store";
import { store } from "./store/index";
import { handleUrlToken } from "./utils/auth";

const router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayout,
        children: [
            {
                index: true,
                loader: () => redirect("/teacherDevelop/myPanelHomePage"),
            },
            {
                path: "scaleCreate",
                lazy: {
                    Component: async () =>
                        (await import("./page/ScaleCreate")).Component,
                    loader: async () =>
                        (await import("./page/ScaleCreate")).loader,
                },
            },
            {
                path: "systemScale",
                lazy: {
                    Component: async () =>
                        (await import("./page/SystemScale")).Component,
                },
            },
            {
                path: "teacherDevelop",
                children: [
                    {
                        index: true,
                        lazy: {
                            Component: async () =>
                                (await import("./page/MyPanelHomePage"))
                                    .Component,
                        },
                    },
                    {
                        path: "myPanelHomePage",
                        lazy: {
                            Component: async () =>
                                (await import("./page/MyPanelHomePage"))
                                    .Component,
                        },
                    },
                    {
                        path: "myEvaluation",
                        lazy: {
                            Component: async () =>
                                (await import("./page/MyEvaluation")).Component,
                        },
                    },
                    {
                        path: "viewPointsDetail",
                        lazy: {
                            Component: async () =>
                                (await import("./page/ViewPointsDetail"))
                                    .Component,
                        },
                    },
                ],
            },
            {
                path: "teacherDevelopScale",
                children: [
                    {
                        path: "evaluate",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Evaluate")).Component,
                        },
                    },
                    {
                        path: "class",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Class")).Component,
                        },
                    },
                    {
                        path: "system",
                        lazy: {
                            Component: async () =>
                                (await import("./page/System")).Component,
                        },
                    },
                ],
            },
            {
                path: "teacherDevelopExamine",
                children: [
                    {
                        index: true,
                        lazy: {
                            Component: async () =>
                                (await import("./page/Examine")).Component,
                        },
                    },
                ],
            },
            {
                path: "teacherDevelopEvaluate",
                children: [
                    {
                        index: true,
                        lazy: {
                            Component: async () =>
                                (await import("./page/Evaluateprogress"))
                                    .Component,
                        },
                    },
                    {
                        path: "Evaluateprogress",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Evaluateprogress"))
                                    .Component,
                        },
                    },
                    {
                        path: "Evaluationdetails",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Evaluationdetails"))
                                    .Component,
                        },
                    },
                    {
                        path: "batchEvaluate",
                        lazy: {
                            Component: async () =>
                                (await import("./page/BatchEvaluate"))
                                    .Component,
                        },
                    },
                ],
            },
            {
                path: "teacherDevelopSchool",
                children: [
                    {
                        index: true,
                        lazy: {
                            Component: async () =>
                                (await import("./page/TeacherFile")).Component,
                        },
                    },
                    {
                        path: "viewPointsDetail",
                        lazy: {
                            Component: async () =>
                                (await import("./page/ViewPointsDetail"))
                                    .Component,
                        },
                    },
                    {
                        path: "teacherFile",
                        lazy: {
                            Component: async () =>
                                (await import("./page/TeacherFile")).Component,
                        },
                    },
                    {
                        path: "evaluateResults",
                        lazy: {
                            Component: async () =>
                                (await import("./page/EvaluateResults"))
                                    .Component,
                        },
                    },
                    {
                        path: "scaleAnalysis",
                        lazy: {
                            Component: async () =>
                                (await import("./page/ScaleAnalysis"))
                                    .Component,
                        },
                    },
                    {
                        path: "personalData",
                        lazy: {
                            Component: async () =>
                                (await import("./page/PersonalData")).Component,
                        },
                    },
                    {
                        path: "Mypersonaldata",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Mypersonaldata"))
                                    .Component,
                        },
                    },
                ],
            },
            {
                path: "teacherDevelopSet",
                children: [
                    {
                        index: true,
                        lazy: {
                            Component: async () =>
                                (await import("./page/Teacher")).Component,
                        },
                    },
                    {
                        path: "teacher",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Teacher")).Component,
                        },
                    },
                    {
                        path: "subject",
                        lazy: {
                            Component: async () =>
                                (await import("./page/Subject")).Component,
                        },
                    },
                ],
            },
        ],
        errorElement: <Page404 />,
        HydrateFallback: GlobalSpinner,
    },
]);

function AppContent() {
    const isInitialized = useSelector(
        (state: RootState) => state.user.isInitialized,
    );
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const school_id = urlParams.get("school_id");
    useEffect(() => {
        handleUrlToken();
    }, []);

    if (token && school_id) {
        if (isInitialized !== true) {
            return (
                <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-4 items-center justify-center">
                    <Spin size="large" />
                    <div className="text-center text-lg font-bold">
                        自动登录中...请稍等...
                    </div>
                </div>
            );
        }
    }
    return (
        <ConfigProvider locale={zhCN}>
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}

function MyApp() {
    return (
        <Provider store={store}>
            <App theme="ios">
                <AppContent />
                </App>
        </Provider>
    );
}

export default MyApp;
