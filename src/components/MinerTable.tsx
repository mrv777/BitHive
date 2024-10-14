import React, { useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { calculateExpectedHashRate, parseDifficulty } from "@/utils/helpers";
import { getDefaultFrequency } from "@/lib/asicDefaults";

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
    actions: boolean;
  };
  removeFromHive: (ip: string) => void;
  devicesWithData: number;
}

const MinerTable: React.FC<MinerTableProps> = ({
  statusQueries,
  hiveData,
  visibleColumns,
  devicesWithData,
  removeFromHive,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return statusQueries.map((query, index) => ({ query, ip: hiveData[index] }));

    return [...statusQueries]
      .map((query, index) => ({ query, ip: hiveData[index] }))
      .sort((a, b) => {
        let aValue = a.query.data?.[sortColumn] ?? '';
        let bValue = b.query.data?.[sortColumn] ?? '';

        if (sortColumn === 'ip') {
          aValue = a.ip;
          bValue = b.ip;
        } else if (sortColumn === 'bestDiff') {
          aValue = parseDifficulty(aValue);
          bValue = parseDifficulty(bValue);
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [statusQueries, hiveData, sortColumn, sortDirection]);

  const SortableHeader: React.FC<{ column: string; label: string }> = ({ column, label }) => (
    <th
      className={`${visibleColumns[column as keyof typeof visibleColumns] ? "" : "hidden"} cursor-pointer`}
      onClick={() => { handleSort(column); }}
    >
      {label}
      {sortColumn === column && (
        <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
      )}
    </th>
  );

  return (
    <table className="table table-compact">
      <thead>
        <tr>
          <SortableHeader column="ip" label={`Devices (${devicesWithData}/${hiveData.length})`} />
          <SortableHeader column="asicModel" label="ASIC Model" />
          <SortableHeader column="bestDiff" label="Best Diff" />
          <SortableHeader column="hashRate" label="Hash Rate" />
          <SortableHeader column="temp" label="Temp" />
          <SortableHeader column="frequency" label="Frequency" />
          <SortableHeader column="voltage" label="Voltage" />
          <SortableHeader column="power" label="Power" />
          <th className={visibleColumns.actions ? "" : "hidden"}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(({ query, ip }) => (
          <tr key={ip}>
            <td className={visibleColumns.ip ? "" : "hidden"}>
              <div>{ip}</div>
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
                  <div>{query.data.bestDiff || "N/A"}</div>
                  <div className="tooltip cursor-help text-sm text-gray-500" data-tip="This Session's Best Difficulty">
                    ({query.data.bestSessionDiff || "N/A"})
                  </div>
                </>
              ) : (
                "N/A"
              )}
            </td>
            <td className={visibleColumns.hashRate ? "" : "hidden"}>
              <div>{query.data ? `${query.data.hashRate.toFixed(2)} Gh/s` : "N/A"}</div>
              <div className="tooltip cursor-help text-sm text-gray-500" data-tip="Expected Hash Rate">
                {query.data
                  ? `${calculateExpectedHashRate(
                      query.data.frequency,
                      query.data.smallCoreCount,
                      query.data.asicCount
                    ).toFixed(0)} Gh/s`
                  : "N/A"}
              </div>
            </td>
            <td
              className={`${visibleColumns.temp ? "" : "hidden"} ${
                query.data?.temp
                  ? query.data?.temp >= 68
                    ? "text-red-500"
                    : query.data?.temp >= 62
                    ? "text-yellow-500"
                    : "text-green-500"
                  : ""
              }`}
            >
              <div>{query.data ? `${query.data.temp}°C` : "N/A"}</div>
              {!query.data ? "" : query.data?.temp >= 68
                ? "Warning: Overheating"
                : query.data?.temp >= 62
                ? "Caution"
                : "Healthy"}
            </td>
            <td className={visibleColumns.frequency ? "" : "hidden"}>
              <div>{query.data ? `${query.data.frequency} MHz` : "N/A"}</div>
              <div className="tooltip cursor-help text-sm text-gray-500" data-tip="Default Frequency">
                {getDefaultFrequency(query.data?.ASICModel || "").toFixed(0)} MHz
              </div>
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
              <div>
                {query.data
                  ? `${(query.data?.voltage / 1000).toFixed(2)}V`
                : "N/A"}
              </div>
              {!query.data ? "" : query.data?.voltage > 4900
                ? "Healthy"
                : query.data?.voltage > 4800
                ? "Caution"
                : "Under Voltage"}
            </td>
            <td className={visibleColumns.power ? "" : "hidden"}>
                {query.data?.power ?
                <>
                    <div>
                        {query.data.power.toFixed(2)}W
                    </div>
                    <div className="text-sm text-gray-500">
                        {(
                        (query.data.power / (query.data.hashRate ?? 1)) *
                        1000
                        ).toFixed(2)} J/Th
                    </div>
                </>
                : "N/A"}
            </td>
            <td className={visibleColumns.actions ? "" : "hidden"}>
              <button
                onClick={() => {
                  removeFromHive(ip);
                }}
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
