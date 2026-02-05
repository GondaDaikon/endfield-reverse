import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OreRateInput } from '@/components/OreRateInput'
import { useOreRateStore, OreType } from '@/store/useOreRateStore'

describe('OreRateInput', () => {
  beforeEach(() => {
    useOreRateStore.getState().reset()
  })

  describe('レンダリング', () => {
    it('3種類の鉱石入力欄が表示される', () => {
      render(<OreRateInput />)

      expect(screen.getByLabelText('源石鉱物')).toBeInTheDocument()
      expect(screen.getByLabelText('紫晶鉱物')).toBeInTheDocument()
      expect(screen.getByLabelText('青鉄鉱物')).toBeInTheDocument()
    })

    it('各入力欄にtype="number"が設定されている', () => {
      render(<OreRateInput />)

      const inputs = screen.getAllByRole('spinbutton')
      expect(inputs).toHaveLength(3)
    })

    it('単位（個/分）が表示される', () => {
      render(<OreRateInput />)

      const unitLabels = screen.getAllByText('個/分')
      expect(unitLabels).toHaveLength(3)
    })
  })

  describe('入力とstore連携', () => {
    it('値を入力するとstoreが更新される', () => {
      render(<OreRateInput />)

      const originiumInput = screen.getByLabelText('源石鉱物')
      fireEvent.change(originiumInput, { target: { value: '10' } })

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(10)
    })

    it('複数の鉱石に値を入力できる', () => {
      render(<OreRateInput />)

      fireEvent.change(screen.getByLabelText('源石鉱物'), {
        target: { value: '5' },
      })
      fireEvent.change(screen.getByLabelText('紫晶鉱物'), {
        target: { value: '10' },
      })
      fireEvent.change(screen.getByLabelText('青鉄鉱物'), {
        target: { value: '15' },
      })

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(5)
      expect(state.oreRates[OreType.QUARTZ]).toBe(10)
      expect(state.oreRates[OreType.IRON]).toBe(15)
    })

    it('小数値は整数に丸められる', () => {
      render(<OreRateInput />)

      const originiumInput = screen.getByLabelText('源石鉱物')
      fireEvent.change(originiumInput, { target: { value: '1.9' } })

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(1)
    })
  })

  describe('入力制限', () => {
    it('空文字は0として扱われる', () => {
      render(<OreRateInput />)

      const originiumInput = screen.getByLabelText('源石鉱物')
      fireEvent.change(originiumInput, { target: { value: '10' } })
      fireEvent.change(originiumInput, { target: { value: '' } })

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(0)
    })

    it('負の値は0に正規化される', () => {
      render(<OreRateInput />)

      const originiumInput = screen.getByLabelText('源石鉱物')
      fireEvent.change(originiumInput, { target: { value: '-5' } })

      const state = useOreRateStore.getState()
      expect(state.oreRates[OreType.ORIGINIUM]).toBe(0)
    })
  })

  describe('store状態の反映', () => {
    it('storeの値が入力欄に反映される', () => {
      useOreRateStore.getState().setOreRate(OreType.ORIGINIUM, 20)

      render(<OreRateInput />)

      const originiumInput = screen.getByLabelText('源石鉱物')
      expect(originiumInput).toHaveValue(20)
    })
  })
})
