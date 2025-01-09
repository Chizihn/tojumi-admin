import { create } from "zustand";

interface SidebarState {
  openMenus: Record<string, boolean>;
  toggleMenu: (menu: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  openMenus: {},
  toggleMenu: (menu) =>
    set((state) => ({
      openMenus: {
        ...state.openMenus,
        [menu]: !state.openMenus[menu],
      },
    })),
}));
