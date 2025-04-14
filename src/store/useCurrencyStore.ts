import { create } from "zustand";
import axios from "axios";

interface CurrencyRate {
  code: string;
  rate: number;
}

interface CurrencyStore {
  rates: CurrencyRate[];
  base: string;
  isLoading: boolean;
  error: string | null;
  fetchRates: () => Promise<void>;
}

const apiKey = import.meta.env.VITE_COINLAYER_API_KEY;
const baseUrl = import.meta.env.VITE_COINLAYER_BASE_URL;

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  rates: [],
  base: "USD",
  isLoading: false,
  error: null,
  fetchRates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${baseUrl}/?access_key=${apiKey}`);
      const data = response.data;
      const rates = Object.entries(data.rates).map(([code, rate]) => ({
        code,
        rate: rate as number,
      }));
      set({ rates });
    } catch (error) {
      console.error("Error fetching rates:", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
