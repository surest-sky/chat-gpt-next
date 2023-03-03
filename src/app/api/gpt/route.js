import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { NextResponse } from 'next/server'

const proxy = {
    hostname: '127.0.0.1',
    port: 1080,
    protocol: 'socks5:',
    // 对于 socks5 协议，需要以冒号结尾，否则会出现“protocol mismatch”错误。
};

const agent = new SocksProxyAgent(proxy);
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
                    Authorization: 'Bearer ***',
                    'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent
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
