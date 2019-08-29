
import express from 'express';
import fetch from "node-fetch";

import config from "./config";

var router = express.Router();


const getRequest = async (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json()) 
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}





router.get('/accounts', async (req, res, next) => {
    const access_token = config.access_token;
    const url = `https://graph.facebook.com/v3.2/me/accounts?access_token=${access_token}`;
    const data = await getRequest(url);
    console.log(data);
    res.json(data);
})


router.get('/instagram_business_account', async (req, res, next) => {

    const {access_token, wwos_fb_pageid} = config;
    const url = `https://graph.facebook.com/v3.2/${wwos_fb_pageid}?fields=instagram_business_account&access_token=${access_token}`;
    const data = await getRequest(url);
    console.log(data);
    res.json(data);
})



export default router;