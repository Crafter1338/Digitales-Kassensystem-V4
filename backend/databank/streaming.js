import { getCache } from "./cache.js";

class Streaming {
    constructor() {
        this.subscribers = [];
    }

    subscribe(req, res) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.write("event: connected\ndata: {}\n\n");

        const subscriber = { req, res };
        this.subscribers.push(subscriber);

        req.on("close", () => {
            this.subscribers = this.subscribers.filter(s => s !== subscriber);
        });
    }

    notifySubscribers() {
        const cache = JSON.stringify(getCache());

        this.subscribers.forEach(({ res }) => {
            res.write(`event: cacheUpdate\ndata: ${cache}\n\n`);
        });
    }
}

const streaming = new Streaming();
export default streaming;
