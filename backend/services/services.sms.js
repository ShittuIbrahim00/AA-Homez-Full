import 'dotenv/config';

class Sms {
    constructor(to) {
        this.to = to;
    }

    to(to) {
        this.to = to;
        return this;
    }

    body(body) {
        this.body = body;
        return this;
    }

    async send() {
        return await sendSms(this.to, this.body);
    }

}

async function sendSms(to, body) {
    try {
        const url = "https://api.sendchamp.com/api/v1/sms/send"
        let msg = {
            "to": to?.replace("+", ""),
            "route": "dnd",
            "message": body,
            "sender_name": process.env.SENDERNAME
        }
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.SENDCHAMP}`
            },
            body: JSON.stringify(msg)
        }
        console.log("SMS Sent")
        return await (await fetch(url, config)).json()
    } catch (e) {
        throw new Error(e.message)
    }
}

export default Sms