import { ProjectIcon } from "../Icon";
import icon from "../../assets/img/top-nav-icon.png";
import activeIcon from "../../assets/img/top-nav-active-icon.png";

export interface IMenuConfig {
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    title: React.ReactNode;
    url?: string | (() => void);
    activeList?: string[];
    code?: string;
    children?: IMenuConfig[];
}
export const menuConfig: IMenuConfig[] = [
    // {
    //     title: "首页",
    //     icon: <ProjectIcon className="text-2xl" type="icon-shouye" />,
    //     url: "/",
    //     activeList: ["/"],
    // },
    {
        title: "我的面板",
        icon: (
            <ProjectIcon
                className="text-xl"
                type="icon-wodebaogao"
            />
        ),
        code: "teacherDevelop",
        url: "/teacherDevelop/myPanelHomePage",
    },
    {
        title: "审核面板",
        icon: (
            <ProjectIcon
                className="text-xl"
                type="icon-shenhe"
            />
        ),
        url: "/teacherDevelopExamine",
        code: "teacherDevelopExamine",
    },
    {
        title: "评价面板",
        icon: (
            <ProjectIcon
                className="text-xl"
                type="icon-bianji-pingjia-fankui"
            />
        ),
        code: "teacherDevelopEvaluate",
        url: "/teacherDevelopEvaluate/Evaluateprogress",
    },
    // {
    //     title: "学校数据",
    //     icon: (
    //         <ProjectIcon
    //             className="text-xl"
    //             type="icon-diannao-shuju"
    //         />
    //     ),
    //     code: "teacherDevelopSchool",
    //     url: "/teacherDevelopSchool/teacherFile",
    //     activeList: [
    //         "/teacherDevelopSchool/viewPointsDetail",
    //         "/teacherDevelopSchool/evaluateResults",
    //         "/teacherDevelopSchool/scaleAnalysis",
    //         "/teacherDevelopSchool/teacherFile",
    //         "/teacherDevelopSchool/personalData",
    //     ],
    //     children: [
    //         {
    //             title: "评价工作统计",
    //             url: "/teacherDevelopSchool/viewPointsDetail",
    //             code: "viewPointsDetail",
    //             icon: (
    //                 <img
    //                     src={icon}
    //                     className="w-[20px] h-[20px]"
    //                 />
    //             ),
    //             activeIcon: (
    //                 <img
    //                     src={activeIcon}
    //                     className="w-[26px] h-[26px]"
    //                 />
    //             ),
    //         },
    //         {
    //             title: "结果统计",
    //             url: "/teacherDevelopSchool/evaluateResults",
    //             code: "evaluateResults",
    //             icon: (
    //                 <img
    //                     src={icon}
    //                     className="w-[20px] h-[20px]"
    //                 />
    //             ),
    //             activeIcon: (
    //                 <img
    //                     src={activeIcon}
    //                     className="w-[26px] h-[26px]"
    //                 />
    //             ),
    //         },
    //         {
    //             title: "量表分析",
    //             url: "/teacherDevelopSchool/scaleAnalysis",
    //             code: "scaleAnalysis",
    //             icon: (
    //                 <img
    //                     src={icon}
    //                     className="w-[20px] h-[20px]"
    //                 />
    //             ),
    //             activeIcon: (
    //                 <img
    //                     src={activeIcon}
    //                     className="w-[26px] h-[26px]"
    //                 />
    //             ),
    //         },
    //         {
    //             title: "教师档案袋",
    //             url: "/teacherDevelopSchool/teacherFile",
    //             code: "teacherFile",
    //             icon: (
    //                 <img
    //                     src={icon}
    //                     className="w-[20px] h-[20px]"
    //                 />
    //             ),
    //             activeIcon: (
    //                 <img
    //                     src={activeIcon}
    //                     className="w-[26px] h-[26px]"
    //                 />
    //             ),
    //         },
    //         {
    //             title: "教师分布统计",
    //             url: "/teacherDevelopSchool/personalData",
    //             code: "personalData",
    //             icon: (
    //                 <img
    //                     src={icon}
    //                     className="w-[20px] h-[20px]"
    //                 />
    //             ),
    //             activeIcon: (
    //                 <img
    //                     src={activeIcon}
    //                     className="w-[26px] h-[26px]"
    //                 />
    //             ),
    //         },
    //     ],
    // },
    {
        title: "评价设置",
        icon: (
            <ProjectIcon
                className="text-xl"
                type="icon-pingjiashezhitab"
            />
        ),
        code: "teacherDevelopScale",
        url: "/teacherDevelopScale/evaluate",
        activeList: [
            "/scaleCreate",
            "/teacherDevelopScale/class",
            "/teacherDevelopScale/system",
        ],
        children: [
            {
                title: "量表",
                url: "/teacherDevelopScale/evaluate",
                code: "evaluate",
                icon: (
                    <img
                        src={icon}
                        className="w-[20px] h-[20px]"
                    />
                ),
                activeIcon: (
                    <img
                        src={activeIcon}
                        className="w-[26px] h-[26px]"
                    />
                ),
            },
            {
                title: "量表分类",
                url: "/teacherDevelopScale/class",
                code: "class",
                icon: (
                    <img
                        src={icon}
                        className="w-[20px] h-[20px]"
                    />
                ),
                activeIcon: (
                    <img
                        src={activeIcon}
                        className="w-[26px] h-[26px]"
                    />
                ),
            },
            {
                title: "评价体系",
                url: "/teacherDevelopScale/system",
                code: "system",
                icon: (
                    <img
                        src={icon}
                        className="w-[20px] h-[20px]"
                    />
                ),
                activeIcon: (
                    <img
                        src={activeIcon}
                        className="w-[26px] h-[26px]"
                    />
                ),
            },
        ],
    },
    {
        title: "基础信息",
        icon: (
            <ProjectIcon
                className="text-xl"
                type="icon-jichushezhi"
            />
        ),
        code: "teacherDevelopSet",
        url: "/teacherDevelopSet/teacher",
        children: [
            {
                title: "教师",
                url: "/teacherDevelopSet/teacher",
                code: "teacher",
                icon: (
                    <img
                        src={icon}
                        className="w-[20px] h-[20px]"
                    />
                ),
                activeIcon: (
                    <img
                        src={activeIcon}
                        className="w-[26px] h-[26px]"
                    />
                ),
            },
            {
                title: "学科",
                url: "/teacherDevelopSet/subject",
                code: "subject",
                icon: (
                    <img
                        src={icon}
                        className="w-[20px] h-[20px]"
                    />
                ),
                activeIcon: (
                    <img
                        src={activeIcon}
                        className="w-[26px] h-[26px]"
                    />
                ),
            },
            // {
            //   title: "评价体系",
            //   url: "/teacherDevelopScale/system",
            //   code: "system",
            //   icon: <img src={icon} className="w-[20px] h-[20px]" />,
            //   activeIcon: <img src={activeIcon} className="w-[26px] h-[26px]" />,
            // },
        ],
    },
];
