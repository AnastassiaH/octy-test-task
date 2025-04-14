import React, { useEffect, useState } from "react";
import { useCurrencyStore } from "./store/useCurrencyStore";
import { popularCurrency } from "./constants";

const ITEMS_PER_PAGE = 12;

const getCurrencySymbol = (target: string) => {
  return popularCurrency[target] || "∞";
};

const App = () => {
  const { rates, fetchRates, isLoading, error, setTarget, target } =
    useCurrencyStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRates();
  }, [target]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const onCurrencyChange = (value: string) => {
    setTarget(value.toUpperCase());
    setCurrentPage(1);
  };

  const paginatedRates = rates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(rates.length / ITEMS_PER_PAGE);

  const renderPageButtons = () => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 1 && i < totalPages) pages.add(i);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    const pageButtons: React.JSX.Element[] = [];
    let lastPage = 0;

    for (let i = 0; i < sortedPages.length; i++) {
      const page = sortedPages[i];
      if (page - lastPage > 1) {
        pageButtons.push(<span key={`ellipsis-${page}`}>...</span>);
      }
      pageButtons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {page}
        </button>
      );
      lastPage = page;
    }

    return pageButtons;
  };

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

      <div className="mb-3">
        <label
          htmlFor="currency"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Select a target currency
        </label>
        <div className="mt-2 border border-gray-300 dark:border-gray-700 rounded shadow-sm">
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
            <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
              {getCurrencySymbol(target)}
            </div>
            <input
              type="text"
              name="currency"
              id="currency"
              className="block min-w-0 grow py-1.5 pr-3 pl-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              placeholder="Type in"
              value={target}
              onChange={(e) => onCurrencyChange(e.target.value)}
            />
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
                id="currency"
                name="currency"
                aria-label="Currency"
                value={target}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                {Object.keys(popularCurrency).map((code) => (
                  <option key={`currency-code-key-${code}`}>{code}</option>
                ))}
              </select>
              <svg
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500 my-2">{error}</p>}

      {!isLoading && !error && rates.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {paginatedRates.map((rate) => (
              <div
                key={rate.code}
                className="border border-gray-300 dark:border-gray-700 rounded p-4 shadow-sm"
              >
                <h2 className="text-lg font-medium">{rate.code}</h2>
                <p className="text-sm">Rate: {rate.rate.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                ←
              </button>

              {renderPageButtons()}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
