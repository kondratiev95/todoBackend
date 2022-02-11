import { usersCollection } from "../connectToDB/connectToDB";
import {Context} from 'koa';
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import cryptoRandomString from 'crypto-random-string';
import { getUserId } from "../utils/utils";

export const sendCredentials = async(ctx: Context) => {
    const obj = JSON.parse(ctx.request.body);
    const userFromMongo = await usersCollection.findOne({ username: obj.username}) === null;
    console.log(userFromMongo);
    if(userFromMongo) {
        await usersCollection.insertOne(obj);
        ctx.body = true;
        ctx.response.status = 200;
    } else {
        ctx.body =  false;
        ctx.response.status = 401;
    }
}

export const sendLoginData = async(ctx: Context) => {
    const reqObj = JSON.parse(ctx.request.body);
    const decryptPassword = CryptoJS.AES.decrypt(reqObj.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const userFromMongo = await usersCollection.findOne({ username: reqObj.username});
    if (userFromMongo) { 
        const decryptMongoPass = CryptoJS.AES.decrypt(userFromMongo.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const isPassMatch = decryptPassword === decryptMongoPass;
        if (isPassMatch) {
            const accessToken = jwt.sign(
                { 
                    username: userFromMongo.username,
                    id: userFromMongo._id,
                },
                process.env.ACCESS_KEY,
                {
                    expiresIn: '30s',
                }
            )
            const refreshToken = cryptoRandomString({length: 10, type: 'base64'});
            await usersCollection.findOneAndUpdate({_id: userFromMongo._id}, {$set: {refreshToken}});

            ctx.body = { 
                username: userFromMongo.username,
                tokens: {
                    accessToken,
                    refreshToken
                }
            }
            ctx.status = 200;
        } else {
            ctx.status = 401;
            ctx.body = "Pass or username don't match" 
        }
    } else {
        ctx.status = 401;
        ctx.body = "Pass or username don't match"
    }
}

export const refreshHandler = async(ctx: Context) => {
    const reqObj = JSON.parse(ctx.request.body)
    const accessToken = reqObj.accessToken
    const userId = getUserId(accessToken) 
    const userFromMongo = await usersCollection.findOne({ _id: new ObjectId(userId)})
    const compareRefreshTokens = userFromMongo.refreshToken === reqObj.refreshToken
    if(compareRefreshTokens) {
        const accessToken = jwt.sign(
            { 
                username: userFromMongo.username,
                id: userFromMongo._id,
            },
            process.env.ACCESS_KEY,
            {
                expiresIn: '30s',
            }
        )
        const refreshToken = cryptoRandomString({length: 10, type: 'base64'});
        await usersCollection.findOneAndUpdate({_id: userFromMongo._id}, {$set: {refreshToken}});
        ctx.body = { 
            username: userFromMongo.username,
            tokens: {
                accessToken,
                refreshToken
            }
        }
        ctx.status = 200;
    } else {
        ctx.status = 401;
        ctx.body = "Tokens don't match"
        throw new Error("Tokens dont't match")
    } 
}

export const verifyToken = async (ctx: Context, next: any) => {
    if(!ctx.header.authorization) {
        ctx.status = 403
        ctx.body = 'Something went wrong'
    }
    const token = ctx.header.authorization.split(' ')[1]
    try {
        jwt.verify(token, `${process.env.ACCESS_KEY}`)
    } catch (error) {
        ctx.status = 401
        ctx.body = 'Token expired'
    }
    await next()
}
