import { create } from 'zustand'
import { ItemId } from '@/types/constants'

/**
 * 鉱石タイプ（採掘可能な基本鉱石）
 * 現時点で利用可能な3種類。銅鉱は後半解放予定。
 */
export const OreType = {
  ORIGINIUM: ItemId.ITEM_ORIGINIUM_ORE,
  QUARTZ: ItemId.ITEM_QUARTZ_SAND,
  IRON: ItemId.ITEM_IRON_ORE,
} as const

export type OreType = (typeof OreType)[keyof typeof OreType]

/** 鉱石ごとの採取レート（個/分） */
export type OreRates = Record<OreType, number>

interface OreRateState {
  oreRates: OreRates
  setOreRate: (oreType: OreType, rate: number) => void
  reset: () => void
}

const initialOreRates: OreRates = {
  [OreType.ORIGINIUM]: 0,
  [OreType.QUARTZ]: 0,
  [OreType.IRON]: 0,
}

export const useOreRateStore = create<OreRateState>((set) => ({
  oreRates: { ...initialOreRates },

  setOreRate: (oreType, rate) => {
    // 整数に丸め、負の値は0に正規化
    const normalizedRate = Math.max(0, Math.floor(rate))
    set((state) => ({
      oreRates: {
        ...state.oreRates,
        [oreType]: normalizedRate,
      },
    }))
  },

  reset: () => {
    set({ oreRates: { ...initialOreRates } })
  },
}))
