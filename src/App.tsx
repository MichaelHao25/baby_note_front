import "dayjs/locale/zh-cn";
import { App, Page, Preloader } from "konsta/react";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import GlobalSpinner from "./components/GlobalSpinner";
import { GlobalLayout } from "./Layout/GlobalLayout";
import { HomeLayout } from "./Layout/HomeLayout";
import { Page404 } from "./page/404";
import type { RootState } from "./store";
import { store } from "./store/index";
import { handleUrlToken } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
    Component: GlobalLayout,
    children: [
      {
        Component: HomeLayout,
        children: [
          {
            index: true,
            lazy: {
              Component: async () => (await import("./page/Home")).Component,
              loader: async () => (await import("./page/Home")).loader,
            },
          },
          {
            path: "weight",
            lazy: {
              Component: async () => (await import("./page/Weight")).Component,
              loader: async () => (await import("./page/Weight")).loader,
            },
          },
          {
            path: "timeline",
            lazy: {
              Component: async () =>
                (await import("./page/Timeline")).Component,
              loader: async () => (await import("./page/Timeline")).loader,
            },
          },
          {
            path: "chart",
            lazy: {
              Component: async () => (await import("./page/Chart")).Component,
              loader: async () => (await import("./page/Chart")).loader,
            },
          },
        ],
      },
      {
        path: "login",
        lazy: {
          Component: async () => (await import("./page/Login")).Component,
          loader: async () => (await import("./page/Login")).loader,
        },
      },
      {
        path: "milkAmountList",
        lazy: {
          Component: async () =>
            (await import("./page/MilkAmountList")).Component,
          loader: async () => (await import("./page/MilkAmountList")).loader,
        },
      },
      {
        path: "weightList",
        lazy: {
          Component: async () => (await import("./page/WeightList")).Component,
          loader: async () => (await import("./page/WeightList")).loader,
        },
      },
    ],
    errorElement: <Page404 />,
    HydrateFallback: GlobalSpinner,
  },
]);

function AppContent() {
  const isInitialized = useSelector(
    (state: RootState) => state.user.isInitialized
  );
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("u");
  const password = urlParams.get("p");
  useEffect(() => {
    handleUrlToken();
  }, []);
  if (user && password) {
    if (isInitialized !== true) {
      return (
        <Page>
          <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-4 items-center justify-center">
            <Preloader />
            <div className="text-center text-lg font-bold">
              自动登录中...请稍等...
            </div>
          </div>
        </Page>
      );
    }
  }
  return <RouterProvider router={router} />;
}

function MyApp() {
  return (
    <Provider store={store}>
      <App theme="ios" safeAreas>
        <AppContent />
      </App>
    </Provider>
  );
}

export default MyApp;
