import { Button, Result } from "antd";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

export const Page404 = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.log(error);

    const handleBackToHome = () => {
        navigate("/");
    };

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return (
                <Result
                    status="404"
                    title="404"
                    subTitle="抱歉，你访问的页面不存在。"
                    extra={
                        <Button type="primary" onClick={handleBackToHome}>
                            返回首页
                        </Button>
                    }
                />
            );
        }

        return (
            <Result
                status="error"
                title="路由加载出错"
                subTitle={error.statusText || "抱歉，加载页面时发生未知错误。"}
                extra={
                    <Button type="primary" onClick={handleBackToHome}>
                        返回首页
                    </Button>
                }
            />
        );
    }

    return (
        <Result
            status="500"
            title="程序发生未知错误"
            subTitle="很抱歉，我们的程序出现了一些问题。"
            extra={
                <Button type="primary" onClick={handleBackToHome}>
                    返回首页
                </Button>
            }
        />
    );
};
