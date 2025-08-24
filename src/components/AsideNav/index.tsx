import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { menuConfig } from "./config";
import { filterMenuByPermission } from "../../utils/permissions";
import type { RootState } from "../../store";

export const AsideNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userAuth = useSelector((state: RootState) => state.user.auth);

    console.log(location);
    const { pathname } = location;

    // 根据用户权限过滤菜单
    const filteredMenuConfig = filterMenuByPermission(menuConfig, userAuth);

    return (
        <div className="flex flex-none w-16 px-1 flex-col bg-[#192241] text-white text-xs pt-2">
            {filteredMenuConfig.map((item, idx) => {
                const { title, icon, url, activeList = [] } = item;
                const key = `${title}_${icon}_${url}`;

                let active = pathname === url;
                if (active === false) {
                    active = activeList.includes(pathname);
                }
                return (
                    <React.Fragment key={key}>
                        <div
                            className={`
                        h-13 flex justify-center gap-1 items-center flex-col hover:cursor-pointer rounded
                        hover:bg-[#518df1] hover:shadow transition-shadow
                        ${active ? `bg-[#518df1]` : ""}
                        `}
                            onClick={() => {
                                if (url) {
                                    if (typeof url === "string") {
                                        navigate(url);
                                    } else {
                                        try {
                                            url();
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                                }
                            }}
                        >
                            <div className="flex items-center justify-center">
                                {icon}
                            </div>
                            <div className="text-center">{title}</div>
                        </div>
                        {idx < filteredMenuConfig.length - 1 && (
                            <div className="h-8 flex items-center justify-center">
                                <div className="w-2/5 border-b border-b-white border-solid"></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
