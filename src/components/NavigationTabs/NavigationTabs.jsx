import './navigationtabs.scoped.css'
import { useEffect, useRef, useState } from "react";

const NavigationTabs = ({ tabs, setActiveTabIndex, gap, paddingX, beamColor, beamBackgroundColor }) => {

    const tabRefs = useRef([]);
    const [tabProperties, setTabProperties] = useState({
        activeTab: {
            index: 0,
            width: 0,
            offset: 0,
        },
        tabWidths: [],
        tabGap: gap ?? 0,
    });
    const tabFunctions = {
        initializeTabs: function () {
            let tabWidths = [];
            if (!tabRefs.current) return;
            for (let i = 0; i < tabRefs.current.length; i++) {
                tabWidths.push(tabRefs.current[i].offsetWidth);
            };
            let activeTab = { index: 0, width: tabRefs.current[0].offsetWidth, offset: 0 };
            setTabProperties({ ...tabProperties, activeTab: activeTab, tabWidths: tabWidths });
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
    };

    // initialization and pass up active index
    useEffect(() => {
        tabFunctions.initializeTabs();
    }, []);
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
                            padding: `8px ${paddingX ? paddingX+"px" : "12px"}`,
                        }}
                    >
                        <p>{tab.tabName}</p>
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