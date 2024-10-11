import { DataContext } from '../../Context/DataProvider';
import './navigationtabs.scoped.css'
import { useContext, useEffect, useRef, useState } from "react";

const NavigationTabs = ({ tabs, setActiveTabIndex, gap = 0, paddingX = 12, beamColor, beamBackgroundColor, parentRef, screenPaddingX = 0 }) => {
    // const { mobileMode } = useContext(DataContext);
    const [screenWidth, setScreenWidth] = useState(parentRef && parentRef.current ? parentRef.current.offsetWidth : window.innerWidth - screenPaddingX * 2);
    useEffect(() => {
        // console.log(screenWidth);
    }, [screenWidth]);
    const tabRefs = useRef([]);
    const [tabProperties, setTabProperties] = useState({
        activeTab: {
            index: 0,
            width: 0,
            offset: 0,
        },
        tabWidths: [],
        totalTabWidth: 0,
        nonConciseTabsWidth: 0,
        conciseTabsWidth: 0,
        tabGap: gap,
        numberOfTabs: tabs.length,
        totalWidth: 0,
        conciseMode: false,
    });
    const tabFunctions = {
        initializeTabs: function () {
            let { numberOfTabs, conciseMode, nonConciseTabsWidth, conciseTabsWidth } = tabProperties;
            let tabWidths = [];
            if (!tabRefs.current) return;
            for (let i = 0; i < tabRefs.current.length; i++) {
                tabWidths.push(tabRefs.current[i].offsetWidth);
            };
            let activeTab = { index: 0, width: tabRefs.current[0].offsetWidth, offset: 0 };
            let totalTabWidth = tabWidths.reduce((a, b) => a + b, 0);
            let totalWidth = totalTabWidth + (gap * (numberOfTabs - 1));
            let excessWidth = totalWidth > screenWidth ? totalWidth - screenWidth : 0;
            let tabGap = gap;
            if (conciseMode) {
                conciseTabsWidth = tabWidths.reduce((a, b) => a + b, 0);
            } else {
                nonConciseTabsWidth = tabWidths.reduce((a, b) => a + b, 0);
            }
            conciseMode = nonConciseTabsWidth > screenWidth ? true : false;
            if (tabGap * (numberOfTabs - 1) >= excessWidth) {
                tabGap -= excessWidth / (numberOfTabs - 1);
            } else {
                tabGap = 0;
            };
            setTabProperties({ 
                ...tabProperties, 
                activeTab: activeTab, 
                tabWidths: tabWidths, 
                totalTabWidth: totalTabWidth, 
                conciseTabsWidth: conciseTabsWidth, 
                nonConciseTabsWidth: nonConciseTabsWidth, 
                tabGap: tabGap, 
                totalWidth: totalWidth, 
                conciseMode: conciseMode 
            });
        },
        setActiveTab: function (tabIndex) {
            let activeTabCopy = { ...tabProperties.activeTab };
            activeTabCopy.index = tabIndex;
            activeTabCopy.width = tabProperties.tabWidths[tabIndex];
            let offset = 0;
            for (let i = 0; i < tabIndex; i++) {
                offset += tabProperties.tabWidths[i] + tabProperties.tabGap;
            };
            activeTabCopy.offset = offset;
            setTabProperties({ ...tabProperties, activeTab: activeTabCopy });
        },
        handleResize: function () {
            if (parentRef && parentRef.current) {
                setScreenWidth(parentRef.current.offsetWidth);
                console.log("parent width: " + parentRef.current.offsetWidth);
            } else {
                setScreenWidth(window.innerWidth - screenPaddingX * 2);
            };
        },
    };
    useEffect(() => {
       console.log(parentRef) 
    }, [parentRef]);

    useEffect(() => {
        window.addEventListener("resize", tabFunctions.handleResize);
        return () => window.removeEventListener("resize", tabFunctions.handleResize);
    }, []);

    // initialization and pass up active index
    useEffect(() => {
        tabFunctions.initializeTabs();
    }, [screenWidth]);
    useEffect(() => {
        if (!setActiveTabIndex) return;
        setActiveTabIndex(tabProperties.activeTab.index);
    }, [tabProperties.activeTab]);

    return (
        <div className="navigation-tabs-container">
            <div className="navigation-tabs" style={{ gap: tabProperties.tabGap + "px" }}>
                {tabs.map((tab, index) => {
                    return <div
                        ref={(e) => tabRefs.current[index] = e}
                        key={index}
                        className={`navigation-tab ${tabProperties.activeTab.index === index ? "active" : null}`}
                        onClick={() => tabFunctions.setActiveTab(index)}
                        style={{
                            padding: `8px ${paddingX+"px"}`,
                        }}
                    >
                        <p>{tabProperties.conciseMode ? tab.conciseTabName : tab.tabName}</p>
                    </div>
                })}
            </div>
            <div className="navigation-beam" style={{ backgroundColor: beamBackgroundColor ?? "" }}>
                <div className="beam" style={{ width: tabProperties.activeTab.width + "px", left: tabProperties.activeTab.offset + "px", backgroundColor: beamColor ?? "" }} />
            </div>
        </div>
    )
}
export default NavigationTabs;