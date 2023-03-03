
import { Input, Space, Button } from '@arco-design/web-react';
import { useState } from 'react'
const TextArea = Input.TextArea;
export default () => {
    const [message, setMessage] = useState("")
    const sendMessage = () => {

    }

    return <div className={'w-full absolute bottom-2 '}>
        <div className={'flex justify-between '}>
            <TextArea placeholder='Please enter ...' className={'w-full mr-2'}  value={message}/>
            <Button onClick={sendMessage}>发送</Button>
        </div>
    </div>
}