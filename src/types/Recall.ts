import StockOption from './StockOption';

type Recall = {
    date: string;
    drug: string;
    mfgr: string;
    lot: string;
    stocked: StockOption,
    affected: StockOption,
    date_removed: string;
    initials: string;
};


export default Recall;