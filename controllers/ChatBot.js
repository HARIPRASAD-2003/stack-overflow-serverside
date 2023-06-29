import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
    // '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',
})

const openai = new OpenAIApi(configuration);

export const getResponse = async(req, res) => {

    const { query } = req.body;
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: query,
        max_tokens: 2048,
    });
    console.log(completion.data.choices[0].text)
    res.send(completion.data.choices[0].text);
};