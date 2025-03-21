import { CareServiceType } from "@/types";
import { create } from "zustand";

interface CareServiceTypeStore {
  careServiceTypes: CareServiceType[];
  setCareServiceTypes: (types: CareServiceType[]) => void;
  addServiceType: (type: CareServiceType) => void;
  updateServiceType: (id: string, name: string) => void;
  removeServiceType: (id: string) => void;
}

export const useCareServiceTypeStore = create<CareServiceTypeStore>((set) => ({
  careServiceTypes: [],
  setCareServiceTypes: (types) => set({ careServiceTypes: types }),
  addServiceType: (type) =>
    set((state) => ({
      careServiceTypes: [...state.careServiceTypes, type],
    })),
  updateServiceType: (id, name) =>
    set((state) => ({
      careServiceTypes: state.careServiceTypes.map((type) =>
        type.id === id ? { ...type, name } : type
      ),
    })),
  removeServiceType: (id) =>
    set((state) => ({
      careServiceTypes: state.careServiceTypes.filter((type) => type.id !== id),
    })),
}));
