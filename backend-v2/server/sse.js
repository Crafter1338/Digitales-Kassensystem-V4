import cache from "../databank/cache.js";

let subscribers = [];

const subscribe = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`event: cache\ndata: ${JSON.stringify(cache.getCache())}\n\n`);

    const subscriber = { req, res };
    subscribers.push(subscriber);

    req.on("close", () => {
        subscribers = subscribers.filter(s => s !== subscriber);
    });
}

const notify = (event, data) => {

    subscribers.forEach(({ res }) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
}

export default { subscribe, notify }