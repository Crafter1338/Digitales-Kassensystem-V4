class Streaming {
    constructor() {
        this.subscribers = [];
    }

    subscribe(req, res) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.write(`data: ${JSON.stringify({})}\n\n`);

        const subscriber = { req, res };
        this.subscribers.push(subscriber);

        req.on("close", () => {
            this.subscribers = this.subscribers.filter(s => s !== subscriber);
        });
    }

    notifySubscribers(user, message) {
        const data = JSON.stringify({user, message});

        this.subscribers.forEach(({ res }) => {
            res.write(`data: ${data}\n\n`);
        });
    }
}

const streaming = new Streaming();
export default streaming;
