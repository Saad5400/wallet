export default function moneyFormat(num: number, shortenAbove = 100_000) {
    if (num >= shortenAbove) {
        if (num >= 100_000_000) {
            return `${(num / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
        }
        return `${(num / 1_000).toFixed(2).replace(/\.?0+$/, '')}K`
    }

    return num.toLocaleString('en', { maximumFractionDigits: 2 })
}