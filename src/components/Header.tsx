"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../images/logo.png";
import { useFetchContext } from "../context/FetchContext";
import { useQueryClient } from "@tanstack/react-query";

const themes = [
  "dark",
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const { lastFetchTime, currentlyFetching, refreshInterval } = useFetchContext();
  const [theme, setTheme] = useState<string>("dark");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load theme from localStorage on initial render
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - lastFetchTime;
      const rawRemainingTime = refreshInterval - elapsedTime;
      const remainingTime = Math.max(0, rawRemainingTime);
      setProgress(((refreshInterval - remainingTime) / refreshInterval) * 100);
      if (
        ((rawRemainingTime > 0 && rawRemainingTime <= 100) ||
          rawRemainingTime < -2000) &&
        !queryClient.isFetching() &&
        !currentlyFetching.current
      ) {
        currentlyFetching.current = true;
        queryClient.invalidateQueries().catch((error: unknown) => {
          console.error("Failed to invalidate queries:", error);
          currentlyFetching.current = false;
        });
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [lastFetchTime, refreshInterval]);

  const updateTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  const resetCharts = () => {
    const apiUrl = localStorage.getItem("bitaxeApiUrl");
    const currentTheme = localStorage.getItem("theme");
    const miners = localStorage.getItem("hiveData");
    localStorage.clear();
    if (apiUrl) localStorage.setItem("bitaxeApiUrl", apiUrl);
    if (currentTheme) localStorage.setItem("theme", currentTheme);
    if (miners) localStorage.setItem("hiveData", miners);
    window.location.reload();
  };

  const resetLocalStorage = () => {
    const apiUrl = localStorage.getItem("bitaxeApiUrl");
    const currentTheme = localStorage.getItem("theme");
    localStorage.clear();
    if (apiUrl) localStorage.setItem("bitaxeApiUrl", apiUrl);
    if (currentTheme) localStorage.setItem("theme", currentTheme);
    window.location.reload();
  };

  return (
    <header className="navbar bg-base-300 shadow-lg">
      <div className="flex-1 pl-2">
        <Image src={logo} alt="BitHive Logo" className="h-11 w-11" />
      </div>
      <div className="flex-none gap-2">
        <div
          className="tooltip tooltip-bottom"
          data-tip="Time until next refresh"
        >
          <div
            className={`radial-progress ${
              progress > 90 ? "text-primary animate-pulse" : "text-success"
            }`}
            style={
              {
                "--value": progress,
                "--size": "2.5rem",
                "--thickness": "3px",
              } as React.CSSProperties
            }
          >
            {Math.ceil(
              (refreshInterval - (progress / 100) * refreshInterval) / 1000
            )}
          </div>
        </div>
        {/* <div className="tooltip tooltip-bottom" data-tip={`Connected as ${networkStatus.hostname} on ${networkStatus.ssid}`}>
          <div className={`indicator ${isConnected ? 'text-success' : 'text-error'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
        </div>
         */}

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            Theme
            <svg
              width="12px"
              height="12px"
              className="h-2 w-2 fill-current opacity-60 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto"
          >
            {themes.map((t) => (
              <li key={t}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={t}
                  value={t}
                  checked={theme === t}
                  onChange={() => {
                    updateTheme(t);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={resetCharts}
          className="btn btn-ghost btn-circle tooltip tooltip-left flex items-center justify-center"
          data-tip="Reset Charts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            { (
              document.getElementById("settings-modal") as HTMLDialogElement
            ).showModal(); }
          }
          className="btn btn-ghost btn-circle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <button
          onClick={resetLocalStorage}
          className="btn btn-ghost btn-circle tooltip tooltip-left flex items-center justify-center"
          data-tip="Reset Everything"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="red"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
