import { getCache } from "./cache.js";

class Streaming {
    constructor() {
        this.subscribers = [];
    }

    subscribe(req, res) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const cache = JSON.stringify(getCache());
        res.write(`data: ${cache}\n\n`);

        const subscriber = { req, res };
        this.subscribers.push(subscriber);

        req.on("close", () => {
            this.subscribers = this.subscribers.filter(s => s !== subscriber);
        });
    }

    notifySubscribers() {
        const cache = JSON.stringify(getCache());

        this.subscribers.forEach(({ res }) => {
            res.write(`data: ${cache}\n\n`);
        });
    }
}

const streaming = new Streaming();
export default streaming;
