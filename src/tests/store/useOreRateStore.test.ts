import { describe, it, expect, beforeEach } from 'vitest'
import { useOreRateStore, OreType } from '@/store/useOreRateStore'

describe('useOreRateStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useOreRateStore.getState().reset()
  })

  describe('initial state', () => {
    it('全ての鉱石レートが0で初期化される', () => {
      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(0)
      expect(state.oreRates[OreType.QUARTZ]).toBe(0)
      expect(state.oreRates[OreType.IRON]).toBe(0)
    })
  })

  describe('setOreRate', () => {
    it('指定した鉱石のレートを更新できる', () => {
      const { setOreRate } = useOreRateStore.getState()

      setOreRate(OreType.ORIGINIUM, 10)

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(10)
      expect(state.oreRates[OreType.QUARTZ]).toBe(0)
      expect(state.oreRates[OreType.IRON]).toBe(0)
    })

    it('複数の鉱石レートを個別に更新できる', () => {
      const { setOreRate } = useOreRateStore.getState()

      setOreRate(OreType.ORIGINIUM, 5)
      setOreRate(OreType.QUARTZ, 10)
      setOreRate(OreType.IRON, 15)

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(5)
      expect(state.oreRates[OreType.QUARTZ]).toBe(10)
      expect(state.oreRates[OreType.IRON]).toBe(15)
    })

    it('負の値は0に正規化される', () => {
      const { setOreRate } = useOreRateStore.getState()

      setOreRate(OreType.ORIGINIUM, -5)

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(0)
    })

    it('小数値は整数に丸められる', () => {
      const { setOreRate } = useOreRateStore.getState()

      setOreRate(OreType.ORIGINIUM, 1.9)

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(1)
    })
  })

  describe('reset', () => {
    it('全ての鉱石レートを0にリセットする', () => {
      const { setOreRate, reset } = useOreRateStore.getState()

      setOreRate(OreType.ORIGINIUM, 10)
      setOreRate(OreType.QUARTZ, 20)
      setOreRate(OreType.IRON, 30)

      reset()

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(0)
      expect(state.oreRates[OreType.QUARTZ]).toBe(0)
      expect(state.oreRates[OreType.IRON]).toBe(0)
    })
  })
})
