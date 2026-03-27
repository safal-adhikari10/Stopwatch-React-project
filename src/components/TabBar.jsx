function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "stopwatch", label: "⏱ Stopwatch" },
    { id: "countdown", label: "⏳ Countdown" },
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabBar;
