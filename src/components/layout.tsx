import { Container, Nav, Navbar } from 'react-bootstrap';
import { ReactNode } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

const NavLink = (props: {path: string; children: ReactNode}) => (
    <NextLink href={props.path} passHref>
        <Nav.Link>{props.children}</Nav.Link>
    </NextLink>
);

// Integrating Links: 
// https://github.com/react-bootstrap/react-bootstrap/issues/4131
const Layout = (props: {children: ReactNode}) => <>
    <Head>
        <title>JMH Drug Recall</title>
    </Head>
    <Navbar bg="light">
        <Navbar.Brand>JMH Drug Recall</Navbar.Brand>
        <Nav className="mr-auto">
            <NavLink path="/">List</NavLink>
            <NavLink path="/new">New</NavLink>
        </Nav>
    </Navbar>
    <Container className="p-5">{props.children}</Container>
</>;

export default Layout;