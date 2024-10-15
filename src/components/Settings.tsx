import React, { useEffect, useState } from "react";
import { useFetchContext } from "@/context/FetchContext";

interface SettingsProps {
  showToast: (message: string, type: "success" | "error") => void;
}

const Settings: React.FC<SettingsProps> = ({ showToast }) => {
  const { refreshInterval, setRefreshInterval } = useFetchContext();

  // Convert milliseconds to seconds for the input
  const [newRefreshInterval, setNewRefreshInterval] = useState(refreshInterval / 1000);

  useEffect(() => {
    setNewRefreshInterval(refreshInterval / 1000);
  }, [refreshInterval]);

  const handleSave = () => {
    if (newRefreshInterval < 1) {
      showToast("Refresh interval must be at least 1 second", "error");
      return;
    }
    // Convert seconds back to milliseconds when saving
    const newIntervalMs = newRefreshInterval * 1000;
    setRefreshInterval(newIntervalMs);
    localStorage.setItem("refreshInterval", newIntervalMs.toString());
    showToast("Settings saved", "success");
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="form-control w-full max-w-sm">
          <div className="label">
            <span className="label-text">Refresh Interval (seconds)</span>
          </div>
          <input
            type="number"
            value={newRefreshInterval}
            className="input input-bordered"
            min={1}
            onChange={(e) => { setNewRefreshInterval(Number(e.target.value)); }}
          />
        </label>
      </div>
      {/* <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Timeout (ms):
          <input
            type="number"
            value={newTimeout}
            onChange={(e) => setNewTimeout(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div> */}
      <div className="modal-action">
        <form method="dialog" className="flex gap-2">
          <button className="btn">Close</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Settings;
