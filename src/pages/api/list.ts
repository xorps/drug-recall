import { NextApiRequest, NextApiResponse } from 'next';
import * as db from '../../zapatos/src';
// import pool from '../../pgPool';
import Store from '../../types/Store';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'GET') {
        // const data = await db.select("recall", db.all).run(pool);
        res.statusCode = 200;
        res.json(Store);
    }
}