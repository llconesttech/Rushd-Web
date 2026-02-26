
import { DollarSign, Coins, TrendingUp, Home, Briefcase, User, Sprout, Cat, Gem, CreditCard } from 'lucide-react';

export const ZAKAT_CATEGORIES = [
    {
        id: 'money',
        title: 'Money & Cash',
        icon: DollarSign,
        details: `Zakat should be paid at 2.5% on all cash balance and bank balances in your savings or current accounts.
The amount technically should be in the bank for one year. Usually it happens that the balance keeps on changing as per personal requirements. You may make your best judgement and the best way is to pay on remaining amount on the day of calculation.`,
        inputs: [
            { id: 'cashInHand', label: 'Cash in Hand', placeholder: '0.00' },
            { id: 'cashInBank', label: 'Cash in Bank', placeholder: '0.00' },
            { id: 'deposited', label: 'Deposited Amounts', placeholder: '0.00' }
        ]
    },
    {
        id: 'gold',
        title: 'Gold',
        icon: Coins,
        details: `Zakat should be calculated at 2.5% of the market value as on the date of valuation. Most Ulema favour the Market Value prevailing as on the date of Calculation and not the purchase price.`,
        inputs: [
            { id: 'goldGrams', label: 'Weight in Grams', placeholder: '0.00' },
            // Price per gram is global setting
        ]
    },
    {
        id: 'silver',
        title: 'Silver',
        icon: Coins,
        details: `Zakat is to be paid on Silver in Pure form or Jewellery, Utensils, Decorative items and all household items including crockery, cutlery made of silver at 2.5% of the prevailing market rates.`,
        inputs: [
            { id: 'silverGrams', label: 'Weight in Grams', placeholder: '0.00' },
            // Price per gram is global setting
        ]
    },
    {
        id: 'investments',
        title: 'Investments',
        icon: TrendingUp,
        details: `Zakat can be paid EITHER by the firm OR separately by the owners. If the firm is not paying, and the partner wants to calculate his share, he should take the amount standing to his capital and loan account as per the last balance sheet. Add his estimated share of profit till the date zakat is calculated.
This can only be estimated as it is difficult to calculate the exact profit or loss between an accounting year.`,
        inputs: [
            { id: 'stocks', label: 'Value of Stocks/Shares', placeholder: '0.00' },
            { id: 'mutualFunds', label: 'Mutual Funds', placeholder: '0.00' },
            { id: 'profits', label: 'Share of Profits', placeholder: '0.00' }
        ]
    },
    {
        id: 'property',
        title: 'Properties',
        icon: Home,
        details: `Zakat is not payable on personal residential House even if you have more than one and meant for residential purpose only. Also Zakat is not applicable on the value of Property given on rent irrespective of how many. However Zakat is payable on the rental income itself after deducting the maintenance and other expenses.
However if your intention of holding properties is to sell at a future date for a profit or as an investment, then Zakat is payable on the Market Value of the property. Also, if your intention of holding properties changes in the current year, i.e. from self use to business then you need to pay Zakat on that Property Value.`,
        inputs: [
            { id: 'investmentProperty', label: 'Value of Property for Sale', placeholder: 'Market Value' },
            { id: 'rentalIncome', label: 'Net Rental Income', placeholder: 'Income - Expenses' }
        ]
    },
    {
        id: 'business',
        title: 'Business Assets',
        icon: Briefcase,
        details: `This is for Business Persons only. No matter what business you are into, you've got to pay Zakat on all STOCK-IN-TRADE. The stock must be valued at its Landed Cost Price. If you have any bills receivable (sales given on credit) then you need to add the same towards calculations.`,
        inputs: [
            { id: 'stockInTrade', label: 'Value of Stock-in-Trade', placeholder: 'Cost Price' },
            { id: 'receivables', label: 'Bills Receivable', placeholder: '0.00' }
        ]
    },
    {
        id: 'agriculture',
        title: 'Agricultural Produce',
        icon: Sprout,
        details: `Zakat is payable on all Agricultural produce including fruits, commercially grown flowers, vegetables and all types of grains at the harvest time itself. The passing of One year does not apply for argricultural produce.
If there are two or more crops on the same land per year, then Zakat has to be paid as many times on the crop, irrespective of the time.
The Consensus formula for Zakat calculation on Agriculture is as follows: On crops dependent purely on rain water it will be 10% of produce, On crops not irrigated through rain water but use Canal Water, Tank Water, Borewell and Open wells, the Zakat is 5% of the produce. For Crops dependent partly on Rain Water and partly on other water, the Zakat applicable would be 7.5% of produce.`,
        inputs: [
            { id: 'agriProduceValue', label: 'Value of Produce', placeholder: '0.00' },
            {
                id: 'irrigationType', label: 'Irrigation Method', type: 'select', options: [
                    { value: 'rain', label: 'Rain Water (10%)' },
                    { value: 'artificial', label: 'Artificial Irrigation (5%)' },
                    { value: 'mixed', label: 'Mixed (7.5%)' }
                ]
            }
        ]
    },
    {
        id: 'cattle',
        title: 'Cattle & Livestock',
        icon: Cat,
        details: `On all grazing animals like goats, sheep, camel, cows, broiler chickens, the consensus Zakat payable is one animal/bird for every 40 animals owned. However you may wish to give cash in lieu of the animal/bird itself.
Please consult your local Scholar or Maulvi or Imaam who can guide you to the right direction, or refer to books of Figh if you would like to have first hand confirmation of the situation.`,
        inputs: [
            { id: 'cattleCount', label: 'Total Number of Animals', placeholder: 'e.g., 40' },
            { id: 'pricePerAnimal', label: 'Avg Value per Animal', placeholder: '0.00' }
        ]
    },
    {
        id: 'precious',
        title: 'Precious Stones',
        icon: Gem,
        details: `If they have a value, then they calculate towards your wealth, and it is on the wealth that Zakat is mandatory. However please consult with Ulema, before acting on this section. Most Ulema contend that a diamond is a piece of carbon and its value varies, unlike that of gold or silver.
One may calculate the Saleable Value of Items-at-hand on the date of Zakat Calculation.`,
        inputs: [
            { id: 'stonesValue', label: 'Saleable Value', placeholder: '0.00' }
        ]
    },
    {
        id: 'others',
        title: 'Loans Given & Others',
        icon: User,
        details: `Zakat is payable by you on loans you have given to your friends and relatives. It should be treated as Cash in Hand. You may deduct Loans Payable by you to arrive at the nett present value of your wealth.
However, if you are in doubt, on the return of your money, then you may not calculate it as your wealth.
You can add it to your wealth, if and when your receive your money.`,
        inputs: [
            { id: 'loansGiven', label: 'Loans Given (Recoverable)', placeholder: '0.00' },
            { id: 'otherAssets', label: 'Other Zakatable Assets', placeholder: '0.00' }
        ]
    }
];

export const LIABILITIES_CATEGORY = {
    id: 'liabilities',
    title: 'Liabilities (Deductible)',
    icon: CreditCard,
    details: `If you have any pending tax payable to the govt, as of the date of Zakat Calculation, then the same may be deducted before arriving at the net worth. If you have taken any loans from any person or institution, and if you have not already deducted the same from any of the above sections, then you can deduct your Payables over here. Please be truthful, as Zakat is a sure way of protecting ones wealth if Zakat has been paid on it regularly and fully.
LOANS taken only for Zakatable-Wealth should be deducted. Cars, Houses, etc are not Zakatable wealth. So any loan/mort- gate taken for these purposes are not to be deducted.`,
    inputs: [
        { id: 'debts', label: 'Debts & Loans Payable', placeholder: '0.00' },
        { id: 'expenses', label: 'Immediate Expenses/Taxes', placeholder: '0.00' }
    ]
};
