
import { Input, Card, Button } from '@arco-design/web-react';
const TextArea = Input.TextArea;
export default () => {
    const messages = [
        {
            'user': "system",
            "content": "你好"
        },
        {
            'user': "me",
            "content": "在干什么"
        }
    ];
    return <Card className={'mt-5'} bordered={false}>
        {messages.map(item => {
            return <div className={'mb-2'}>
                {item.user}: {item.content}
            </div>
        })}
    </Card>
}