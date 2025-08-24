import { store } from "../store";
import {
    setToken,
    setSchoolId,
    setUserInfo,
    setAuth,
    setInitialized,
} from "../store/userSlice";
import { apiSlice } from "../store/apiSlice";

export const handleUrlToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const school_id = urlParams.get("school_id");

    // 检查是否已经有本地存储的用户信息
    const storedToken = localStorage.getItem("token");
    const storedSchoolId = localStorage.getItem("school_id");
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedAuth = localStorage.getItem("auth");

    // 如果已经有完整的本地存储数据，并且没有新的URL参数，直接使用本地数据
    if (
        storedToken &&
        storedSchoolId &&
        storedUserInfo &&
        storedAuth &&
        !token &&
        !school_id
    ) {
        console.log("使用本地存储的用户数据");
        store.dispatch(setInitialized(true));
        return true;
    }

    // 如果有URL参数中的token和school_id，重新获取用户信息
    if (token && school_id) {
        try {
            // 调用获取token的接口
            const result = await store.dispatch(
                apiSlice.endpoints.getToken.initiate({ token, school_id }),
            );

            if (
                "data" in result &&
                result.data?.code === 1 &&
                result.data?.data?.userinfo
            ) {
                // 保存token到localStorage和Redux
                store.dispatch(setToken(result.data.data.userinfo.token));
                // 保存school_id到localStorage和Redux
                store.dispatch(setSchoolId(school_id));
                // 保存用户信息到Redux
                store.dispatch(setUserInfo(result.data.data.userinfo));
                // 保存用户权限到Redux
                store.dispatch(setAuth(result.data.data.auth || []));

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
        store.dispatch(setInitialized(true));
    }
    return false;
};
