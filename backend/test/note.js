import Sms from "../services/services.sms.js";
import Pusher from "../services/services.push.js";

(async () => {
    // await new Pusher("trytuiuuo").campaignId('channelId').body("test").title("title").send(false);
    await new Sms("2348070677266").body("test").send(false);
})()