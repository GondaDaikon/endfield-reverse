import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Package } from 'lucide-react'
import { useOreRateStore } from '@/store/useOreRateStore'
import { calculateAvailableItems } from '@/lib/calculator'

export function AvailableItemList() {
  const { t } = useTranslation()
  const oreRates = useOreRateStore((state) => state.oreRates)

  const availableItems = useMemo(
    () => calculateAvailableItems(oreRates),
    [oreRates]
  )

  if (availableItems.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" />
          作成可能なアイテム
        </h2>
        <p className="text-muted-foreground">
          鉱石の採取レートを入力してください
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Package className="w-5 h-5" />
        作成可能なアイテム
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {availableItems.map((item) => (
          <div
            key={item.recipeId}
            className="p-4 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center gap-3">
              <img
                src={`/images/items/${item.itemId}.png`}
                alt={t(`items.${item.itemId}`, item.itemId)}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // 画像がない場合は非表示
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {t(`items.${item.itemId}`, item.itemId)}
                </p>
                <p className="text-sm text-muted-foreground">
                  最大 {item.maxRate.toFixed(1)} 個/分
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
