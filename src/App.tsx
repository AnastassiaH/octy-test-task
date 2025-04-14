import React, { useEffect, useState } from "react";
import { useCurrencyStore } from "./store/useCurrencyStore";

const App = () => {
  const { rates, fetchRates, isLoading, error } = useCurrencyStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Currency Exchange Rates</h1>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      {isLoading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rates.map((rate) => (
            <div
              key={rate.code}
              className="border border-gray-300 dark:border-gray-700 rounded p-4 shadow-sm"
            >
              <h2 className="text-lg font-medium">{rate.code}</h2>
              <p className="text-sm">Rate: {rate.rate.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
