"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import MinerStatus from "./MinerStatus";
import AddMinerForm from "./AddMinerForm";
import { useHiveData } from "@/hooks/useHiveData";
import { parseDifficulty } from "@/utils/helpers";
import MinerTable from "./MinerTable";

// Memoize the MinerStatus component
const MemoizedMinerStatus = React.memo(MinerStatus);

const HiveDashboard: React.FC = () => {
  const { hiveData, updateHiveData } = useHiveData();
  const queryClient = useQueryClient();
  const currentError = useRef(false);

  const statusQueries = useQueries({
    queries: hiveData.map((ip) => ({
      queryKey: ["allStatus", ip],
      queryFn: () => api.getAllStatus(`http://${ip}/api`),
      refetchInterval: 10000,
    })),
  });

  const { combinedData, devicesWithData, devicesWithoutData } = useMemo(() => {
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

    const devicesWithData = statusQueries.filter((query: any) => query.data).length;
    const devicesWithoutData = hiveData.length - devicesWithData;

    return { combinedData: combined, devicesWithData, devicesWithoutData };
  }, [statusQueries, hiveData]);

  const [visibleColumns, setVisibleColumns] = useState({
    ip: true,
    asicModel: false,
    bestDiff: true,
    hashRate: true,
    temp: true,
    frequency: true,
    voltage: true,
    power: true,
    delete: true,
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
          await queryClient.invalidateQueries();
        } catch (error) {
          console.error("Failed to add to hive:", error);
        }
      }
    },
    [hiveData, queryClient, updateHiveData]
  );

  const removeFromHive = async (ip: string) => {
    try {
      const updatedHive = hiveData.filter((member: string) => member !== ip);
      updateHiveData(updatedHive);
      // Refetch hive data
      await queryClient.invalidateQueries();
    } catch (error) {
      console.error("Failed to remove from hive:", error);
    }
  };

  if (hiveData.length === 0) return <div>Loading Miner data...</div>;

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
            ready={statusQueries.every((query: any) => !query.isFetching)}
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
      <div className="divider" />
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
                <label className="label cursor-pointer">
                  <span className="label-text capitalize">{column}</span>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() =>
                      { toggleColumn(column as keyof typeof visibleColumns); }
                    }
                    className="checkbox"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <MinerTable
        statusQueries={statusQueries}
        hiveData={hiveData}
        visibleColumns={visibleColumns}
        removeFromHive={removeFromHive}
        devicesWithData={devicesWithData}
        devicesWithoutData={devicesWithoutData}
      />

      <div className="mt-4">
        <AddMinerForm onSubmit={addMiner} />
      </div>
    </div>
  );
};

export default HiveDashboard;
