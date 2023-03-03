import axios from 'axios';
import { NextResponse } from 'next/server'

const proxy = {
    protocol: 'https',
    host: "127.0.0.1",
    port: 1087,
};

const connectOpenApi = async (messages) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [messages],
            },
            {
                headers: {
                    Authorization: 'Bearer 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',
                    'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
                    'Content-Type': 'application/json',
                },
                proxy: proxy
            }
        );
        return response.data
    } catch (error) {
        console.log(error.message)
        throw new Error('error')
    }
}

export async function POST(request) {
    let { messages } = await request.json()
    const data = await connectOpenApi(messages[messages.length - 1])
    try {
        const r_message = data['choices'][0]['message']
        r_message.content = r_message.content.replace(/^\n+|\n+$/g, '')
        messages.push(r_message)
    }catch (e) {
        throw new Error('error')
    }
    return NextResponse.json({ messages })
}
