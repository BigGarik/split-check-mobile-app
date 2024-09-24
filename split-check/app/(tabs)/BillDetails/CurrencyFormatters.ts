const { FormatMoney } = require('format-money-js');

export const rubleFormatter = new FormatMoney({
    decimals: 2,
    separator: ' ',
    symbol: '₽',
    append: true
});

export const somFormatter = new FormatMoney({
    decimals: 2,
    separator: ',',
    symbol: 'som',
    append: true
});

export const dollarFormatter = new FormatMoney({
    decimals: 2,
    separator: ',',
    symbol: '$',
    append: false
});

export const euroFormatter = new FormatMoney({
    decimals: 2,
    separator: ' ',
    symbol: '€',
    append: true
});

export const getCurrencyFormatter = (code: string) => {
    switch (code) {
        case 'RUB':
            return rubleFormatter;
        case 'UZS':
            return somFormatter;
        case 'USD':
            return dollarFormatter;
        case 'EUR':
            return euroFormatter;
        default:
            return rubleFormatter;
    }
};

