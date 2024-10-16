"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import MinerStatus from "./MinerStatus";
import AddMinerForm from "./AddMinerForm";
import { useHiveData } from "@/hooks/useHiveData";
import { parseDifficulty } from "@/utils/helpers";
import MinerTable from "./MinerTable";
import { useFetchContext } from "../context/FetchContext";
import Settings from "./Settings";

// Memoize the MinerStatus component
const MemoizedMinerStatus = React.memo(MinerStatus);

const HiveDashboard: React.FC = () => {
  const { hiveData, updateHiveData } = useHiveData();
  const queryClient = useQueryClient();
  const currentError = useRef(false);
  const { setLastFetchTime, currentlyFetching } = useFetchContext();

  const statusQueries = useQueries({
    queries: hiveData.map((ip) => ({
      queryKey: ["allStatus", ip],
      queryFn: () => api.getAllStatus(`http://${ip}/api`),
    })),
  });

  const [combinedData, setCombinedData] = useState<any>(null);
  const [devicesWithData, setDevicesWithData] = useState(0);

  const calculateCombinedData = () => {
    const allSettled = statusQueries.every((query: any) => !query.isFetching);
    const anyError = statusQueries.some((query: any) => query.isError);

    if (anyError) {
      currentError.current = true;
    } else if (allSettled) {
      currentError.current = false;
    }

    const combined = statusQueries.reduce(
      (acc: any, query: any) => {
        if (!query.data) return acc; // Skip this miner if no data

        return {
          hashRate: acc.hashRate + (query.data.hashRate || 0),
          bestDiff: Math.max(
            acc.bestDiff,
            parseDifficulty(query.data.bestDiff || "0")
          ),
          bestSessionDiff: Math.max(
            acc.bestSessionDiff,
            parseDifficulty(query.data.bestSessionDiff || "0")
          ),
          temp: acc.temp + (query.data.temp || 0),
          sharesAccepted: acc.sharesAccepted + (query.data.sharesAccepted || 0),
          sharesRejected: acc.sharesRejected + (query.data.sharesRejected || 0),
          frequency: acc.frequency + (query.data.frequency || 0),
          smallCoreCount: acc.smallCoreCount + (query.data.smallCoreCount || 0),
          asicCount: acc.asicCount + (query.data.asicCount || 0),
          power: acc.power + (query.data.power || 0),
          ASICModel: query.data.ASICModel || acc.ASICModel,
          hostname: acc.hostname
            ? `${acc.hostname}-${query.data.hostname || ""}`
            : query.data.hostname || "",
          stratumUser: acc.stratumUser
            ? `${acc.stratumUser}-${query.data.stratumUser || ""}`
            : query.data.stratumUser || "",
        };
      },
      {
        hashRate: 0,
        bestDiff: 0,
        bestSessionDiff: 0,
        temp: 0,
        sharesAccepted: 0,
        sharesRejected: 0,
        frequency: 0,
        smallCoreCount: 0,
        asicCount: 0,
        power: 0,
        ASICModel: "",
        hostname: "",
        stratumUser: "",
      }
    );

    // Calculate averages for relevant fields
    const queryCount = statusQueries.filter(
      (query: { data: any }) => query.data
    ).length;
    combined.temp /= queryCount;
    combined.smallCoreCount /= queryCount;
    combined.asicCount /= queryCount;

    combined.hashRate = combined.hashRate > 0 ? combined.hashRate : null;

    const devicesWithData = statusQueries.filter(
      (query: any) => query.data
    ).length;

    setCombinedData(combined);
    setDevicesWithData(devicesWithData);
  };

  // useEffect so we only update the combined data when the statusQueries were being fetched but now settled
  useEffect(() => {
    const allSettled = statusQueries.every((query: any) => !query.isFetching);

    if (allSettled && currentlyFetching.current) {
      currentlyFetching.current = false;
      setLastFetchTime(Date.now());
      calculateCombinedData();
    }
  }, [statusQueries]);

  const [visibleColumns, setVisibleColumns] = useState({
    ip: true,
    asicModel: false,
    bestDiff: true,
    hashRate: true,
    temp: true,
    frequency: true,
    voltage: true,
    power: true,
    actions: true,
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const addMiner = useCallback(
    async (newIp: string) => {
      if (newIp) {
        try {
          const updatedHive = [...hiveData, newIp];
          updateHiveData(updatedHive);
          showToast(`Miner ${newIp} added successfully`, "success");
          await queryClient.invalidateQueries();
        } catch (error: unknown) {
          console.error(`Error adding miner ${newIp}:`, error);
          showToast(`Failed to add miner ${newIp}`, "error");
        }
      }
    },
    [hiveData, queryClient, updateHiveData]
  );

  const removeFromHive = async (ip: string) => {
    try {
      const updatedHive = hiveData.filter((member: string) => member !== ip);
      updateHiveData(updatedHive);
      showToast(`Miner ${ip} removed successfully`, "success");
      await queryClient.invalidateQueries();
    } catch (error: unknown) {
      console.error(`Error removing miner ${ip}:`, error);
      showToast(`Failed to remove miner ${ip}`, "error");
    }
  };

  const [toasts, setToasts] = useState<
    { message: string; type: "success" | "error" }[]
  >([]);

  const showToast = (message: string, type: "success" | "error") => {
    setToasts((prevToasts) => [...prevToasts, { message, type }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1));
    }, 5000);
  };

  return (
    <div>
      {/* Display errors for any statusQueries with isError */}
      {currentError.current && (
        <div className="alert alert-warning shadow-lg mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Error fetching data for some miners. Please check their connection.
          </span>
        </div>
      )}
      {combinedData && hiveData.length > 0 ? (
        <div>
          <MemoizedMinerStatus
            data={{
              ...combinedData,
              bestDiff: combinedData.bestDiff,
              bestSessionDiff: combinedData.bestSessionDiff,
            }}
            ready={!currentlyFetching.current}
          />
        </div>
      ) : hiveData.length === 0 ? (
        <div className="text-center py-4">
          <p>No miners added yet</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p>Waiting for data from all miners...</p>
        </div>
      )}
      <div className="flex mt-2 gap-2">
        <div className="flex justify-start">
          <div className="dropdown mb-4">
            <label tabIndex={0} className="btn m-1">
              Select Columns
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {Object.entries(visibleColumns).map(([column, isVisible]) => (
                <li key={column}>
                  {column !== "actions" ? (
                    <label className="label cursor-pointer">
                      <span className="label-text capitalize">{column}</span>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => {
                          toggleColumn(column as keyof typeof visibleColumns);
                        }}
                        className="checkbox"
                      />
                    </label>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="divider flex-grow" />
      </div>

      <MinerTable
        statusQueries={statusQueries}
        hiveData={hiveData}
        visibleColumns={visibleColumns}
        removeFromHive={removeFromHive}
        devicesWithData={devicesWithData}
      />

      <div className="mt-4">
        <AddMinerForm onSubmit={addMiner} />
      </div>
      <div className="toast toast-top toast-start">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      <dialog
        id="settings-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <Settings showToast={showToast} />
        </div>
      </dialog>
    </div>
  );
};

export default HiveDashboard;
