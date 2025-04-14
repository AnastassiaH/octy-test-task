import { create } from "zustand";
import axios from "axios";

interface CurrencyRate {
  code: string;
  rate: number;
}

interface CurrencyStore {
  rates: CurrencyRate[];
  target: string;
  isLoading: boolean;
  error: string | null;
  setTarget: (target: string) => void;
  fetchRates: () => Promise<void>;
}

const apiKey = import.meta.env.VITE_COINLAYER_API_KEY;
const baseUrl = import.meta.env.VITE_COINLAYER_BASE_URL;

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  rates: [],
  target: "USD",
  isLoading: false,
  error: null,
  setTarget: (target) => set({ target }),
  fetchRates: async () => {
    set({ isLoading: true, error: null });
    const { target } = get();

    try {
      const response = await axios.get(
        `${baseUrl}/live?access_key=${apiKey}&target=${target}`
      );
      const data = response.data;

      if (data.error) {
        throw new Error(data.error?.info || data.error?.type);
      }

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
