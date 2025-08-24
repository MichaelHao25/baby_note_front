import { Spin } from "antd";

const GlobalSpinner = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Spin size="large" />
        </div>
    );
};

export default GlobalSpinner;
