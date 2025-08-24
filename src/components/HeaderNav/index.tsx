import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { type IMenuConfig, menuConfig } from "../AsideNav/config";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { filterMenuByPermission } from "../../utils/permissions";
import type { RootState } from "../../store";

const HeaderNav = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const userAuth = useSelector((state: RootState) => state.user.auth);

    const { pathname } = location;

    // 根据用户权限过滤菜单
    const filteredMenuConfig = filterMenuByPermission(menuConfig, userAuth);

    const module = pathname.split("/")[1];
    const curPage = pathname.split("/")[2];

    const [curModule, setCurModule] = useState<IMenuConfig>();

    useEffect(() => {
        const newModule = filteredMenuConfig.find(
            (item) => item.code === module,
        );
        if (curModule?.code === newModule?.code) {
            return;
        }
        setCurModule(newModule);
    }, [module, filteredMenuConfig, curModule]);
    console.log("curModule", curModule);

    return (
        <>
            {curModule?.children?.length ? (
                <div className="flex w-full h-[70px] items-center pl-[15px] bg-[#f0f2f7]">
                    {curModule?.children?.map((item) => {
                        return (
                            <div
                                className="w-[160px] rounded h-[40px] items-center mr-[15px] bg-[#fff] px-[10px] text-[14px] cursor-pointer flex justify-between"
                                style={{
                                    filter: "drop-shadow(0px 0px 10px #D2D4D7)",
                                }}
                                onClick={() => {
                                    if (
                                        item.url &&
                                        typeof item.url === "string"
                                    ) {
                                        navigate(item.url);
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    {item.code === curPage
                                        ? item.activeIcon
                                        : item.icon}
                                    <span className="ml-1">{item.title}</span>
                                </div>

                                <div>
                                    {item.code === curPage ? (
                                        <DownOutlined
                                            style={{ fontSize: "12px" }}
                                        />
                                    ) : (
                                        <RightOutlined
                                            style={{ fontSize: "12px" }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
});

export default HeaderNav;
