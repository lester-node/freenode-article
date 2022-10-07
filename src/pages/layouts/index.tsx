import { ConfigProvider, message, Select } from "antd";
import styles from "./index.less";
import zhCN from "antd/es/locale/zh_CN";
import React, { createContext, useEffect, useRef, useState } from "react";
import useRequest from "@ahooksjs/use-request";
import {
  ReadOutlined,
  FileTextOutlined,
  RocketOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { history } from "umi";
import { useMount, useSize, useThrottleFn } from "ahooks";
import api from "./service";
import _ from "lodash";

export const LayoutContext = createContext({});

export default (props: { children: any }) => {
  const ref = useRef<any>();
  const selectRef = useRef<any>(null);
  const size: any = useSize(ref);
  const [active, setActive] = useState("首页");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const [showSearchFlag, setShowSearchFlag] = useState(false);
  const menu = [
    {
      name: "教程",
      icon: <ReadOutlined />,
      onClick: (name: string) => {
        setActive(name);
        history.push(`/test/course`);
      },
    },
    {
      name: "文章",
      icon: <FileTextOutlined />,
      onClick: (name: string) => {
        setActive(name);
        history.push(`/test/article`);
      },
    },
    {
      name: "后台",
      icon: <RocketOutlined />,
      onClick: () => {
        window.open("https://www.freenode.cn:3000");
      },
    },
  ];

  const store = {
    size,
  };

  const { run: articleListRun } = useRequest(
    (title) => api.articleList({ title }),
    {
      manual: false,
      onSuccess: (res: { result: number; data: any; message: string }) => {
        if (res.result === 0) {
          setSelectData(res.data);
        } else {
          message.error(res.message || "操作失败");
        }
      },
      onError: (res: any) => {
        message.error(res.message || "操作失败");
      },
    }
  );

  const { run } = useThrottleFn(
    (flag) => {
      setMenuOpen(flag);
    },
    { wait: 10 }
  );

  useEffect(() => {
    if (size?.width < 768) {
      run(false);
    } else if (size?.width > 768) {
      run(true);
    }
  }, [size]);

  useMount(() => {
    const pathname = window.location.pathname;
    if (pathname.includes("articleDetail") || pathname.includes("article")) {
      setActive("文章");
    }
    if (pathname.includes("course")) {
      setActive("教程");
    }
  });

  const handleSelect = (obj: { label: string; value: string }) => {
    const type = obj.label.split("-")[0];
    if (type === "文章") {
      history.push(`/test/articleDetail?id=${obj.value}`);
    }
  };

  const clickCallback = (event: { target: any }) => {
    if (selectRef?.current?.contains(event.target)) {
      return;
    }
    setShowSearchFlag(false);
  };

  useEffect(() => {
    if (showSearchFlag) {
      document.addEventListener("click", clickCallback, false);
      return () => {
        document.removeEventListener("click", clickCallback, false);
      };
    }
  }, [showSearchFlag]);

  return (
    <div className={styles.layout}>
      <div className={styles.header} ref={ref}>
        <div
          className={styles.phoneLeft}
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          <MenuOutlined />
        </div>
        <div className={styles.title}>
          <div>测试环境</div>
        </div>
        {showSearchFlag ? (
          <div className={styles.small} ref={selectRef}>
            <Select
              showSearch
              suffixIcon={<SearchOutlined />}
              className={styles.smallSearch}
              placeholder="输入关键词"
              showArrow={true}
              optionFilterProp="children"
              allowClear={true}
              labelInValue={true}
              onSelect={handleSelect}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {Array.isArray(selectData) &&
                selectData.map(
                  (item: { id: string; title: string; name: string }) => {
                    return (
                      <Select.Option
                        key={item.id}
                        value={item.id}
                        label={`${item.name}-${item.title}`}
                      >
                        {`${item.name}-${item.title}`}
                      </Select.Option>
                    );
                  }
                )}
            </Select>
          </div>
        ) : null}
        <div className={styles.right}>
          {size?.width > 768 ? (
            <Select
              showSearch
              suffixIcon={<SearchOutlined />}
              className={styles.search}
              placeholder="输入关键词"
              showArrow={true}
              optionFilterProp="children"
              labelInValue={true}
              allowClear={true}
              onSelect={handleSelect}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {Array.isArray(selectData) &&
                selectData.map(
                  (item: { id: string; title: string; name: string }) => {
                    return (
                      <Select.Option
                        key={item.id}
                        value={item.id}
                        label={`${item.name}-${item.title}`}
                      >
                        {`${item.name}-${item.title}`}
                      </Select.Option>
                    );
                  }
                )}
            </Select>
          ) : (
            <div
              className={styles.phoneRight}
              onClick={() => {
                setShowSearchFlag(!showSearchFlag);
              }}
            >
              <SearchOutlined />
            </div>
          )}
          <div
            id="menu"
            className={styles.menu}
            style={{ display: menuOpen ? "flex" : "none" }}
          >
            <div className={styles.navTop}>
              {menu.map((item, index) => {
                return (
                  <div
                    className={`${styles.nav} ${
                      item.name === active ? styles.active : null
                    }`}
                    key={index}
                    onClick={() => {
                      if (size.width < 768) {
                        setMenuOpen(false);
                      }
                      item.onClick && item.onClick(item.name);
                    }}
                  >
                    <span>{item.name}</span>
                    {item.icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.midder}
        onClick={() => {
          if (size?.width < 768) {
            setMenuOpen(false);
          }
        }}
      >
        <ConfigProvider locale={zhCN}>
          <LayoutContext.Provider value={store}>
            {props.children}
          </LayoutContext.Provider>
        </ConfigProvider>
      </div>
    </div>
  );
};
