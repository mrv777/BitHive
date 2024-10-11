import React from "react";
import { UseQueryResult } from "@tanstack/react-query";

interface MinerTableProps {
  statusQueries: UseQueryResult<any>[];
  hiveData: string[];
  visibleColumns: {
    ip: boolean;
    asicModel: boolean;
    bestDiff: boolean;
    hashRate: boolean;
    temp: boolean;
    frequency: boolean;
    voltage: boolean;
    power: boolean;
    delete: boolean;
  };
  removeFromHive: (ip: string) => void;
  devicesWithData: number;
  devicesWithoutData: number;
}

const MinerTable: React.FC<MinerTableProps> = ({
  statusQueries,
  hiveData,
  visibleColumns,
  devicesWithData,
  devicesWithoutData,
  removeFromHive,
}) => {
  return (
    <table className="table table-compact">
      <thead>
        <tr>
        <th className={visibleColumns.ip ? "" : "hidden"}>
              Devices ({devicesWithData}/{hiveData.length})
              {devicesWithoutData > 0 && (
                <span className="text-xs text-red-500 ml-1">
                  ({devicesWithoutData} offline)
                </span>
              )}
            </th>
          <th className={visibleColumns.asicModel ? "" : "hidden"}>ASIC Model</th>
          <th className={visibleColumns.bestDiff ? "" : "hidden"}>Best Diff</th>
          <th className={visibleColumns.hashRate ? "" : "hidden"}>Hash Rate</th>
          <th className={visibleColumns.temp ? "" : "hidden"}>Temp</th>
          <th className={visibleColumns.frequency ? "" : "hidden"}>Frequency</th>
          <th className={visibleColumns.voltage ? "" : "hidden"}>Voltage</th>
          <th className={visibleColumns.power ? "" : "hidden"}>Power</th>
          <th className={visibleColumns.delete ? "" : "hidden"}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {statusQueries.map((query: any, index: number) => (
          <tr key={hiveData[index]}>
            <td className={visibleColumns.ip ? "" : "hidden"}>
              <div>{hiveData[index]}</div>
              <div className="text-sm text-gray-500">
                ({query.data?.hostname || "N/A"})
              </div>
            </td>
            <td className={visibleColumns.asicModel ? "" : "hidden"}>
              {query.data?.ASICModel || "N/A"}
            </td>
            <td className={visibleColumns.bestDiff ? "" : "hidden"}>
              {query.data ? (
                <>
                  {query.data.bestSessionDiff || "N/A"}{" "}
                  <span className="tooltip cursor-help" data-tip="All Time">
                    ({query.data.bestDiff || "N/A"})
                  </span>
                </>
              ) : (
                "N/A"
              )}
            </td>
            <td className={visibleColumns.hashRate ? "" : "hidden"}>
              {query.data ? `${query.data.hashRate.toFixed(2)} Gh/s` : "N/A"}
            </td>
            <td
              className={`${visibleColumns.temp ? "" : "hidden"} ${
                query.data?.temp
                  ? query.data?.temp >= 68
                    ? "text-red-500"
                    : query.data?.temp >= 60
                    ? "text-yellow-500"
                    : "text-green-500"
                  : ""
              }`}
            >
              {query.data ? `${query.data.temp}°C` : "N/A"}
            </td>
            <td className={visibleColumns.frequency ? "" : "hidden"}>
              {query.data ? `${query.data.frequency} MHz` : "N/A"}
            </td>
            <td
              className={`${visibleColumns.voltage ? "" : "hidden"} ${
                query.data?.voltage
                  ? query.data?.voltage > 4900
                    ? "text-green-500"
                    : query.data?.voltage > 4800
                    ? "text-yellow-500"
                    : "text-red-500"
                  : ""
              }`}
            >
              {query.data
                ? `${(query.data.voltage / 1000).toFixed(2)}V`
                : "N/A"}
            </td>
            <td className={visibleColumns.power ? "" : "hidden"}>
              {query.data ? `${query.data.power.toFixed(2)}W` : "N/A"}
            </td>
            <td className={visibleColumns.delete ? "" : "hidden"}>
              <button
                onClick={() => { removeFromHive(hiveData[index]); }}
                className="btn btn-error btn-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MinerTable;