'use strict';


const secrets={

    sessionCollection:"appsessions",
    sessionKey:["ggggg","aaaaa","sssssss","hhhhh","ffff","kkkkkk","ttt","aaaa"],
    reqUrl:"http://localhost:3000",
    //mongoUrl:'mongodb://localhost:27017/webskeleton',
    defaultSessionDuration:2*60*60,
    SMTPS_EMAIL:"escale.testnode@gmail.com",
    SMTPS_PASSWORD:"Escale@123",
    SMTPS_URL:'smtp.gmail.com',
    COMPANY_NAME:'ESCALE',
    TWILIO_ACCOUNT_SID:'AC0b2132f1cf34e21a6ea933ee86fef0f6',
    TWILIO_AUTH_TOKEN:'c45b613c5e6f778d2a26340c2268c5ff',
    VALID_TWILIO_NUMBER:'+13148885390',
    FACEBOOK_CLIENT_ID:'1939755899569324',
    FACEBOOK_CLIENT_SECRET:'5465ea0ca2dc2a05a27e1632a09d8965',
    GOOGLE_CLIENT_ID:'11067462844-4s6bjl47j6m7v2g4it1ndnfbgirk7m3g.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET:'rY6ZwdUkUWzmUcmB9Tcg63r-'
}
module.exports=secrets;