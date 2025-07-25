export const formatPrice = (price, short = false) => {
    // Kiểm tra null, undefined hoặc NaN
    if (price === null || price === undefined || isNaN(price)) {
        return '0';
    }
    
    // Chuyển về number nếu là string
    const numPrice = Number(price);
    if (isNaN(numPrice)) {
        return '0';
    }

    if (short) {
        if (numPrice >= 1_000_000_000) {
            return `${(numPrice / 1_000_000_000).toFixed(1)}B`;
        }
        if (numPrice >= 1_000_000) {
            return `${(numPrice / 1_000_000).toFixed(1)}M`;
        }
        return new Intl.NumberFormat("vi-VN").format(numPrice);
    }

    if (numPrice < 1_000_000_000) {
        return new Intl.NumberFormat("vi-VN", {
            currency: "VND",
        }).format(numPrice);
    }

    const units = ["tỷ", "triệu tỷ"];
    let index = 0;

    let formattedPrice = numPrice;
    while (formattedPrice >= 1_000_000_000 && index < units.length) {
        formattedPrice /= 1_000_000_000;
        index++;
    }

    return `${formattedPrice.toFixed(1)} ${units[index]}`;
};
