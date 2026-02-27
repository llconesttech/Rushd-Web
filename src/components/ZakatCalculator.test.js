import { describe, it, expect } from 'vitest';

// Mock specific logic from ZakatCalculator for testing purposes
// Since the component logic is internal, we'll replicate the core formulas to verify them against Zakat rules
// and then we can check if the component output matches expectation if we were to mount it (or just test the formulas themselves).

// Replicating calculation logic for unit testing the formulas used in the component
function calculateZakat(values, metalPrices, nisabType) {
    const getVal = (key) => parseFloat(values[key] || 0);

    // 1. Money
    const moneyTotal = getVal('money_cashInHand') + getVal('money_cashInBank') + getVal('money_deposited');

    // 2. Gold & Silver
    const goldTotal = getVal('gold_goldGrams') * metalPrices.gold;
    const silverTotal = getVal('silver_silverGrams') * metalPrices.silver;

    // 3. Investments
    const investmentsTotal = getVal('investments_stocks') + getVal('investments_mutualFunds') + getVal('investments_profits');

    // 4. Properties
    const propertyTotal = getVal('property_investmentProperty') + getVal('property_rentalIncome');

    // 5. Business
    const businessTotal = getVal('business_stockInTrade') + getVal('business_receivables');

    // 6. Agriculture
    const agriRate = () => {
        const type = values['agriculture_irrigationType'];
        if (type === 'rain') return 0.10;
        if (type === 'artificial') return 0.05;
        if (type === 'mixed') return 0.075;
        return 0.10;
    };
    const agriZakat = getVal('agriculture_agriProduceValue') * agriRate();

    // 7. Cattle (Updated Logic)
    const cattleCount = getVal('cattle_cattleCount');
    const getCattleHeadCount = (count) => {
        if (count < 40) return 0;
        if (count <= 120) return 1;
        if (count <= 200) return 2;
        if (count <= 300) return 3;
        return Math.floor(count / 100);
    };
    const cattleZakat = getCattleHeadCount(cattleCount) * getVal('cattle_pricePerAnimal');

    // 8. Precious
    const preciousTotal = getVal('precious_stonesValue');

    // 9. Others
    const othersTotal = getVal('others_loansGiven') + getVal('others_otherAssets');

    const zakatableAssets = moneyTotal + goldTotal + silverTotal + investmentsTotal + propertyTotal + businessTotal + preciousTotal + othersTotal;

    const liabilitiesTotal = getVal('liabilities_debts') + getVal('liabilities_expenses');

    const netWorth = Math.max(0, zakatableAssets - liabilitiesTotal);

    const NISAB_VALUES = {
        gold: { grams: 87.48 },
        silver: { grams: 612.36 },
    };

    const nisabThreshold = NISAB_VALUES[nisabType].grams * metalPrices[nisabType];
    const isNisabMet = netWorth >= nisabThreshold;

    const zakatOnWealth = isNisabMet ? netWorth * 0.025 : 0;

    return {
        totalZakatDue: zakatOnWealth + agriZakat + cattleZakat,
        isNisabMet,
        netWorth
    };
}

describe('Zakat Calculator Logic', () => {
    const prices = { gold: 65, silver: 0.85 }; // USD default in code

    it('should calculate basic 2.5% zakat on cash correctly', () => {
        const values = {
            money_cashInHand: 10000,
            money_cashInBank: 0,
            liabilities_debts: 0
        };
        // 10000 * 0.025 = 250
        // Nisab silver: 612.36 * 0.85 = ~520. 10000 > 520.
        const result = calculateZakat(values, prices, 'silver');
        expect(result.totalZakatDue).toBe(250);
        expect(result.isNisabMet).toBe(true);
    });

    it('should return 0 zakat if below Nisab', () => {
        const values = {
            money_cashInHand: 100, // Below ~520 USD
            liabilities_debts: 0
        };
        const result = calculateZakat(values, prices, 'silver');
        expect(result.totalZakatDue).toBe(0);
        expect(result.isNisabMet).toBe(false);
    });

    it('should deduct liabilities from wealth', () => {
        const values = {
            money_cashInHand: 10000,
            liabilities_debts: 2000
        };
        // Net: 8000. Zakat: 200.
        const result = calculateZakat(values, prices, 'silver');
        expect(result.totalZakatDue).toBe(200);
    });

    it('should calculate Agriculture Zakat correctly (Rain - 10%)', () => {
        const values = {
            agriculture_irrigationType: 'rain',
            agriculture_agriProduceValue: 1000
        };
        // 1000 * 0.10 = 100. Agri is added directly.
        const result = calculateZakat(values, prices, 'silver');
        expect(result.totalZakatDue).toBe(100);
    });

    it('should calculate Agriculture Zakat correctly (Artificial - 5%)', () => {
        const values = {
            agriculture_irrigationType: 'artificial',
            agriculture_agriProduceValue: 1000
        };
        // 1000 * 0.05 = 50.
        const result = calculateZakat(values, prices, 'silver');
        expect(result.totalZakatDue).toBe(50);
    });

    it('should calculate Cattle Zakat correctly (Standard Tiers)', () => {
        const price = 200;
        // < 40 -> 0
        expect(calculateZakat({ cattle_cattleCount: 39, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(0);

        // 40-120 -> 1 * price
        expect(calculateZakat({ cattle_cattleCount: 40, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(200);
        expect(calculateZakat({ cattle_cattleCount: 80, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(200); // Fixed from previous logic
        expect(calculateZakat({ cattle_cattleCount: 120, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(200);

        // 121-200 -> 2 * price
        expect(calculateZakat({ cattle_cattleCount: 121, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(400);
        expect(calculateZakat({ cattle_cattleCount: 200, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(400);

        // 201-300 -> 3 * price
        expect(calculateZakat({ cattle_cattleCount: 300, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(600);

        // > 300 -> 1 per 100
        expect(calculateZakat({ cattle_cattleCount: 400, cattle_pricePerAnimal: price }, prices, 'silver').totalZakatDue).toBe(800);
    });
});
