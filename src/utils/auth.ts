import { store } from "../store";
import { apiSlice } from "../store/apiSlice";
import { setInitialized, setToken } from "../store/userSlice";

export const handleUrlToken = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("u");
  const password = urlParams.get("p");

  // 检查是否已经有本地存储的用户信息
  //   const token = localStorage.getItem("token");

  // 如果已经有完整的本地存储数据，并且没有新的URL参数，直接使用本地数据
  //   if (token) {
  //     console.log("使用本地存储的用户数据");
  //     store.dispatch(setInitialized(true));
  //     return true;
  //   }

  // 如果有URL参数中的token和school_id，重新获取用户信息
  if (username && password) {
    try {
      // 调用获取token的接口
      const result = await store.dispatch(
        apiSlice.endpoints.login.initiate({ username, password })
      );
      if (result.error) {
        alert(
          result?.error?.data?.errorMessage || "登录失败，请检查用户名和密码"
        );
        return false;
      }
      if (
        "data" in result &&
        result.data.success &&
        result.data.data.accessToken
      ) {
        const token = result.data.data.accessToken;
        // 保存token到localStorage和Redux
        store.dispatch(setToken(token));

        // 清除URL参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);

        // 设置初始化完成
        store.dispatch(setInitialized(true));
        return true;
      }
    } catch (error) {
      console.error("Token处理失败:", error);
      // 即使失败也设置初始化完成
      store.dispatch(setInitialized(true));
    }
  } else {
    // 如果没有token参数，直接设置初始化完成
    // store.dispatch(setInitialized(true));
  }
  return false;
};
