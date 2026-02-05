/**
 * 鉱石レートから作成可能なアイテムを算出する計算ロジック
 */

import type { Recipe, ItemId, RecipeId } from '@/types'
import { recipes } from '@/data/recipes'
import type { OreRates } from '@/store/useOreRateStore'

/** 作成可能なアイテム情報 */
export type AvailableItem = {
  itemId: ItemId
  recipeId: RecipeId
  maxRate: number // 最大生産量（個/分）
}

/**
 * 指定した鉱石から直接作成できるレシピを取得
 */
export function getDirectRecipesFromOre(oreItemId: ItemId): Recipe[] {
  return recipes.filter(
    (recipe) =>
      recipe.inputs.length === 1 && recipe.inputs[0].itemId === oreItemId
  )
}

/**
 * 最大生産量を計算
 * @param oreRate 鉱石の採取レート（個/分）
 * @param inputAmount レシピの入力素材量
 * @param craftingTime クラフト時間（秒）
 * @param outputAmount レシピの出力量
 * @returns 最大生産量（個/分）
 */
export function calculateMaxProduction(
  oreRate: number,
  inputAmount: number,
  _craftingTime: number, // 将来の設備数計算で使用予定
  outputAmount: number
): number {
  if (oreRate <= 0) return 0

  // 1分間に何回レシピを実行できるか（素材制限）
  const recipeExecutionsPerMinute = oreRate / inputAmount

  // 1回のレシピ実行で得られる出力量 × 実行回数
  return recipeExecutionsPerMinute * outputAmount
}

/**
 * 鉱石レートから作成可能なアイテム一覧を算出
 */
export function calculateAvailableItems(oreRates: OreRates): AvailableItem[] {
  const availableItems: AvailableItem[] = []

  // 各鉱石について直接変換可能なアイテムを算出
  for (const [oreItemId, oreRate] of Object.entries(oreRates)) {
    if (oreRate <= 0) continue

    const directRecipes = getDirectRecipesFromOre(oreItemId as ItemId)

    for (const recipe of directRecipes) {
      const input = recipe.inputs[0]
      const output = recipe.outputs[0] // 直接変換は出力が1つと仮定

      const maxRate = calculateMaxProduction(
        oreRate,
        input.amount,
        recipe.craftingTime,
        output.amount
      )

      availableItems.push({
        itemId: output.itemId,
        recipeId: recipe.id,
        maxRate,
      })
    }
  }

  return availableItems
}
