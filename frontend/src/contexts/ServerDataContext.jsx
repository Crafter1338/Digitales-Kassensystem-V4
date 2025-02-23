import { createContext, useContext, useEffect, useState } from "react";
import APIEndpoint from '../API';

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

    const [eventSource, setEventSource] = useState(null);
    const [retries, setRetries] = useState(0);

    const reconnectDelay = 800; // Delay between reconnection attempts (in ms)

    useEffect(() => {
        const es = new EventSource(`${APIEndpoint}/action/connect/account`);

        const handleCacheEvent = async (event) => {
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
            } catch (error) {
                console.error("Failed to process SSE message:", error);
            }
        };

        es.addEventListener("cache", handleCacheEvent);

        es.onerror = (error) => {
            console.error("SSE connection error:", error);
            es.close();
            setRetries((prevRetries) => prevRetries + 1);
        };

        es.onclose = () => {
            console.log("SSE connection closed");
            setRetries((prevRetries) => prevRetries + 1);
        };

        if (eventSource) {
            eventSource.close();
        }

        if (retries > 0) {
            setTimeout(() => {
                const esRetry = new EventSource(`${APIEndpoint}/action/connect/account`);
                setEventSource(esRetry);
            }, reconnectDelay);
        } else {
            setEventSource(es);
        }

        return () => {
            if (es) {
                es.removeEventListener("cache", handleCacheEvent);
                es.close();
            }
        };
    }, [retries]);

    return (
        <ServerDataContext.Provider value={{
            eventSource,
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
