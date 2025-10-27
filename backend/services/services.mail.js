'use strict'
/**
 * Slantapp code and properties {www.slantapp.io}
 */
import fileDirName from './../dirname-resolver.js'

const {__dirname, __filename} = fileDirName(import.meta);
import nodemailer from 'nodemailer';
import fs from 'fs';

class Mailer {

    constructor(to) {
        this.to = to;
    }

    to(to) {
        this.to = to;
        return this;
    }

    who(name) {
        this.name = name;
        return this;
    }

    btnText(text) {
        this.btnText = text;
        return this;
    }

    btnUrl(url) {
        this.btnUrl = url;
        return this;
    }

    subject(sub) {
        if (sub) {
            this.subject = sub;
            return this;
        }
        this.subject = "No Subject"
        return this;
    }

    body(body) {
        this.body = body;
        return this;
    }

    async send() {
        //compute email sending template here...
        const rd = fs.readFileSync(__dirname + '/email.template.tpl');
        const rawTmpl = rd.toString('utf-8');
        const compile = render(rawTmpl, {body: this.body, name: this.name, btnText: this.btnText, btnUrl: this.btnUrl});
        return await transporter(compile, this.to, this.subject);
    }
}

// async await is not allowed in global scope, must use a wrapper
async function transporter(html, to, sub) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
        logger: false,
    });
    // send mail with defined transport object
    return transporter.sendMail({
        from: `${sub} <${process.env.EMAIL_USER}>`, // sender address
        to: to, // list of receivers
        subject: sub, // Subject line
        html: html, // html body
    });
    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

let render = (template, data) => {
    return template.replace(/{{(.*?)}}/g, (match) => {
        let mkd = match.split(/{{|}}/).filter(Boolean)[0];
        let a = data[mkd];
        if (a instanceof Array)
            return a.join('\n');
        return data[mkd];
    })
}

export default Mailer
