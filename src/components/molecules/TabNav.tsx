'use client';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabNavProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
    return (
        <nav className="tabs" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>({tab.count})</span>
                    )}
                </button>
            ))}
        </nav>
    );
}
