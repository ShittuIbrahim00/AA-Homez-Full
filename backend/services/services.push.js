'use strict';
/**
 * Slantapp code and properties {www.slantapp.io}
 */
import admin from "firebase-admin";
import serviceAccount from "./nodeboiler-v1-firebase-adminsdk-tkt2t-430e9532dd.json" assert {type: 'json'};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class Pusher {

    constructor(to, token) {
        this.to = to;
    }

    to(to) {
        this.to = to;
        return this;
    }

    title(title) {
        this.title = title;
        return this;
    }

    campaignId(text) {
        this.campaignId = !!text ? text : 'channelId';
        return this;
    }


    body(body) {
        this.body = body;
        return this;
    }

    async send(multi = false) {
        if (!!multi) return await multiPusher({
            title: this.title,
            body: this.body,
            campaignId: this.campaignId,
            token: this.to
        })
        return await pusher({title: this.title, body: this.body, campaignId: this.campaignId, token: this.to});
    }
}

async function pusher(jsonObj) {
    let {title, body, campaignId, token} = jsonObj
    const message = {
        notification: {
            title,
            body
        },
        data: {campaignId, title, body},
        token: token,
        android: {
            priority: "high",
            notification: {
                title: title,
                body: body,
                sound: "default",
                priority: 'max',
                channelId: 'channelId'
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: "default",
                    content_available: true
                }
            },
            headers: {
                'apns-priority': '10',
            },
        }
    }
    let sent = await admin.messaging()
        .send(message)
    console.log("Successfully sent message:", sent);
    return sent
}

async function multiPusher(jsonObj) {
    let {title, body, campaignId, token} = jsonObj
    const message = token.map((tk) => ({
        notification: {
            title,
            body
        },
        data: {campaignId, title, body},
        token: tk,
        android: {
            priority: "high",
            notification: {
                title: title,
                body: body,
                sound: "default",
                priority: 'max',
                channelId: 'channelId'
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: "default",
                    content_available: true
                }
            },
            headers: {
                'apns-priority': '10',
            },
        }
    }))


    let sent = await admin.messaging()
        .sendEach(message)
    console.log("Successfully sent message:", sent);
    return sent
}

export default Pusher
