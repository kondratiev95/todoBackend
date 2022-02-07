import { usersCollection } from "../connectToDB/connectToDB";
import {Context} from 'koa';
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import cryptoRandomString from 'crypto-random-string';


export const sendCredentials = async(ctx: Context) => {
    console.log('fffffffff', process.env.SECRET_KEY)
    const obj = JSON.parse(ctx.request.body);

    const userFromMongo = await usersCollection.findOne({ username: obj.username}) === null;
    console.log(userFromMongo);
    
    //TODO add check if user already exist
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
    console.log(reqObj, decryptPassword, userFromMongo);

    if (userFromMongo) {

        console.log('asdsadsadassadasd', userFromMongo);
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
                    expiresIn: 10,
                }
            )
            console.log('accessToken', accessToken);
            
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