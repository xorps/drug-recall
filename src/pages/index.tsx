import Layout from '../components/layout';
import Recall from '../types/Recall';
import React from 'react';
import { Table, Spinner } from 'react-bootstrap';

type State = {status: "Ready"; data: Array<Recall>} | {status: "Loading"};

const Ready = (data: Array<Recall>): State => ({status: "Ready", data});
const Loading: State = {status: "Loading"};

const TableView = ({data}: {data: Array<Recall>}) =>
    <Table striped bordered>
        <thead>
            <tr>
                <th>Date</th>
                <th>Drug</th>
                <th>Manufacture</th>
                <th>Lot #</th>
                <th>Drug Stocked at JMMC</th>
                <th>Affected Lot # In Stock</th>
                <th>Date Removed</th>
                <th>Initials</th>
            </tr>
        </thead>
        <tbody>
            {data.map(r => 
            <tr>
                <td>{r.date}</td>
                <td>{r.drug}</td>
                <td>{r.mfgr}</td>
                <td>{r.lot}</td>
                <td>{r.stocked}</td>
                <td>{r.affected}</td>
                <td>{r.date_removed}</td>
                <td>{r.initials}</td>
            </tr>)}
        </tbody>
    </Table>;

function Content({state}: {state: State}) {
    if (state.status === "Ready") {
        return <TableView data={state.data} />;
    } else {
        return <Spinner animation="border" />;
    }
}

function Home() {
    const [state, setState] = React.useState<State>(Loading);

    async function fetchUsers() {
        const data = await fetch("/api/list").then(r => r.json());
        setState(Ready(data));
    }

    React.useEffect(() => {
        fetchUsers();
    }, []);

    return <Layout>
        <Content state={state} />
    </Layout>;
}

export default Home;