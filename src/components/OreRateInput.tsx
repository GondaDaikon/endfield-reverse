import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOreRateStore, OreType } from '@/store/useOreRateStore'

/** 鉱石の表示情報 */
const oreInfo: { type: OreType; label: string; icon?: string }[] = [
  {
    type: OreType.ORIGINIUM,
    label: '源石鉱物',
    icon: '/images/items/item_originium_ore.webp',
  },
  {
    type: OreType.QUARTZ,
    label: '紫晶鉱物',
    icon: '/images/items/item_quartz_sand.webp',
  },
  {
    type: OreType.IRON,
    label: '青鉄鉱物',
    icon: '/images/items/item_iron_ore.webp',
  },
]

export function OreRateInput() {
  const { oreRates, setOreRate } = useOreRateStore()

  const handleChange = (oreType: OreType, value: string) => {
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) {
      setOreRate(oreType, 0)
    } else {
      setOreRate(oreType, numValue)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">鉱石採取レート入力</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {oreInfo.map(({ type, label, icon }) => (
          <div key={type} className="space-y-2">
            <Label htmlFor={type} className="flex items-center gap-2">
              {icon && (
                <img
                  src={icon}
                  alt=""
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              {label}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={type}
                type="number"
                min="0"
                step="1"
                value={oreRates[type] || ''}
                onChange={(e) => handleChange(type, e.target.value)}
                placeholder="0"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                個/分
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
