import React from 'react'

import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHttp from '../hooks/useHttp';

const DataContext = createContext(null);

export function DataProvider({ children }) {
	const [accounts, setAccounts] = useState([]);
    const [identities, setIdentities] = useState([]);
    const [items, setItems] = useState([]);
    const [devices, setDevices] = useState([]);

    const [transactions, setTransactions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [scheduleEntries, setScheduleEntries] = useState([]);

    const [event, setEvent] = useState();

    const http = useHttp();

    React.useEffect(() => {
        const eventSource = new EventSource('http://192.168.2.116:80/action/connect/account'); //IP HERE

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                setAccounts(data.accounts);
                setIdentities(data.identities);
                setItems(data.items);
                setDevices(data.devices);

                setTransactions(data.transactions)
                setScheduleEntries(data.scheduleEntries);
                setLogs(data.logs);

                setEvent(data.events[0]);
            } catch (error) {
                console.error('Failed to process SSE message:', error);
            }
        };

        // Handle errors
        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

	return (
		<DataContext.Provider value={{ accounts, identities, items, devices, transactions, logs, scheduleEntries, event }}>
			{children}
		</DataContext.Provider>
	);
}

export function useData() {
	return useContext(DataContext);
}