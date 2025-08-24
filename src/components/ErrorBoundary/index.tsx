import { Button, Result } from "antd";
import React from "react";

interface IProps {
    children: React.ReactNode;
}

interface IState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<IProps, IState> {
    private originalPushState: typeof history.pushState;
    private originalReplaceState: typeof history.replaceState;

    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false };

        // 保存原始的history方法
        this.originalPushState = history.pushState.bind(history);
        this.originalReplaceState = history.replaceState.bind(history);
    }

    static getDerivedStateFromError(_: Error): IState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // 你可以在这里将错误日志上报给服务器
        console.error("ErrorBoundary caught an error: ", error, errorInfo);
    }

    // 重置错误状态的统一处理函数
    resetError = () => {
        this.setState({ hasError: false });
    };

    componentDidMount(): void {
        // 监听浏览器前进后退
        window.addEventListener("popstate", this.resetError);

        // 重写pushState方法以监听程序化导航
        history.pushState = (...args) => {
            this.originalPushState(...args);
            this.resetError();
        };

        // 重写replaceState方法以监听程序化导航
        history.replaceState = (...args) => {
            this.originalReplaceState(...args);
            this.resetError();
        };
    }

    componentWillUnmount(): void {
        // 清理事件监听器
        window.removeEventListener("popstate", this.resetError);

        // 恢复原始的history方法
        history.pushState = this.originalPushState;
        history.replaceState = this.originalReplaceState;
    }

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="500"
                    title="程序出错了"
                    subTitle="抱歉，当前组件发生了一些预料之外的错误。"
                    extra={
                        <Button
                            type="primary"
                            onClick={() => (window.location.href = "/")}
                        >
                            返回首页
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
