import { create } from 'zustand'

interface HomeUiState {
  activeStep: number
  setActiveStep: (step: number) => void
}

export const useHomeUiStore = create<HomeUiState>((set) => ({
  activeStep: 0,
  setActiveStep: (step) => set({ activeStep: step }),
}))
