import { createContext, useContext, useEffect, useState } from "react";
import APIEndpoint from '../API'

const ServerDataContext = createContext();

export function ServerDataProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [identities, setIdentities] = useState([]);
    const [items, setItems] = useState([]);
    const [devices, setDevices] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [scheduleEntries, setScheduleEntries] = useState([]);
    const [event, setEvent] = useState({});

    useEffect(() => {
        const dataEventSource = new EventSource(`${APIEndpoint}/action/connect/account/data`);
        const helpEventSource = new EventSource(`${APIEndpoint}/action/connect/account/help`);

        dataEventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                setAccounts(data.accounts);
                setIdentities(data.identities);
                setItems(data.items);
                setDevices(data.devices);
                setTransactions(data.transactions);
                setScheduleEntries(data.scheduleEntries);
                setLogs(data.logs);
                setEvent(data.events[0]);

                console.log(data)
            } catch (error) {
                console.error("Failed to process SSE message:", error);
            }
        };

        helpEventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
            } catch (error) {
                console.error("Failed to process SSE message:", error);
            }
        }


        helpEventSource.onerror = (error) => {
            console.error("SSE connection error:", error);
            helpEventSource.close();
        }

        dataEventSource.onerror = (error) => {
            console.error("SSE connection error:", error);
            dataEventSource.close();
        };

        return () => {
            dataEventSource.close();
            helpEventSource.close();
        }
    }, [])

    return (
        <ServerDataContext.Provider value={{
            accounts,
            identities,
            items,
            devices,
            transactions,
            logs,
            scheduleEntries,
            event,
        }}>
            {children}
        </ServerDataContext.Provider>
    );
}

export function useServerData() {
    return useContext(ServerDataContext);
}