import StockOption from './StockOption';

type NewRecall = {
    date: string;
    drug: string;
    mfgr: string;
    lot: string;
    stocked: StockOption,
    affected: StockOption,
    date_removed: string;
    initials: string;
};


export default NewRecall;