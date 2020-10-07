import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import React from 'react';
import delay from 'delay';
import NewRecall from '../types/NewRecall';
import StockOptions from '../types/StockOptions';

abstract class Status {
    abstract match<R>(p: {Idle: () => R; Loading: () => R}): R;
}

const Idle = new class extends Status {
    match<R>(p: {Idle: () => R; Loading: () => R}): R {
        return p.Idle();
    }
};

const Loading = new class extends Status {
    match<R>(p: {Idle: () => R; Loading: () => R}): R {
        return p.Loading();
    }
};

type Errors = {
    [P in keyof NewRecall]?: string;
};

type ErrorLookup<T> = {
    is: (key: keyof T) => boolean;
    msg: (key: keyof T) => string;
};

type State = {
    status: Status;
    errors: Errors;
};

const SubmitButton = (props: {status: Status}) => props.status.match({
    Idle: () => <Button variant="primary" type="submit">Submit</Button>,
    Loading: () => <Spinner animation="border" />,
});

function TextInput<Key extends keyof NewRecall>({error, label, name}: {error: ErrorLookup<NewRecall>; label: string; name: Key}) {
    return <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control type="text" name={name} isInvalid={error.is(name)} />
        {error.is(name) ? <Form.Control.Feedback type="invalid">{error.msg(name)}</Form.Control.Feedback> : null}
    </Form.Group>;
}

function SelectInput<Key extends keyof NewRecall>({error, label, name, options}: {error: ErrorLookup<NewRecall>; label: string; name: Key; options: NewRecall[Key][]}) {
    return <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control as="select" name={name} isInvalid={error.is(name)}>
            {options.map(val => <option>{val}</option>)}
        </Form.Control>
        {error.is(name) ? <Form.Control.Feedback type="invalid">{error.msg(name)}</Form.Control.Feedback> : null}
    </Form.Group>;
}

export default function New() {
    const router = useRouter();
    const [state, setState] = React.useState<State>({status: Idle, errors: {}});

    async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setState({...state, status: Loading});
        const data = new FormData(event.currentTarget);
        const resp = await fetch("/api/new", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(Object.fromEntries(data.entries())),
        }).then(r => r.json());
        if (resp.success) {
            setState({status: Idle, errors: {}});
            router.push('/');
        } else {
            setState({status: Idle, errors: resp.errors});
        }
    }

    const error: ErrorLookup<NewRecall> = {
        is: key => key in state.errors,
        msg: key => state.errors[key] || "",
    };

    return (
        <Layout>
            <Card body>
            <Form onSubmit={onSubmit} noValidate={true}>
                <TextInput error={error} name="date" label="Date" />
                <TextInput error={error} name="drug" label="Drug" />
                <TextInput error={error} name="mfgr" label="Manufacturer" />
                <TextInput error={error} name="lot" label="Lot" />
                <SelectInput error={error} name="stocked" label="Drug stocked at JMMC" options={StockOptions} />
                <SelectInput error={error} name="affected" label="Affected Lot # in stock" options={StockOptions} />
                <TextInput error={error} name="date_removed" label="Date Removed" />
                <TextInput error={error} name="initials" label="Initials" />
                <SubmitButton status={state.status} />
            </Form>
            </Card>
        </Layout>
    );
}
