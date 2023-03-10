'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Avatar, Drawer, Button, Spin, Message, Input } from '@arco-design/web-react'
import {
    IconPlus,
    IconDelete,
    IconLock,
    IconMessage,
    IconMenuFold
} from '@arco-design/web-react/icon'

const TextArea = Input.TextArea

function ChatInterface () {
    const [inputM, setInputM] = useState('')
    const [mLoading, setMLoading] = useState(true)
    const currentId = useRef(undefined);
    const [currentMessages, setCurrentMessages] = useState([])
    const [messageList, setMessageList] = useState([])
    const [pending, setPending] = useState(false);
    const [isMobile, setIsMobile] = useState(true)
    const [visible, setVisible] = useState(false)
    const mKey = 'local-chat'


    useEffect(() => {
        setMLoading(true)
        loadLocalChats()
        setMLoading(false)
        document.addEventListener('keydown', () => listenSend)
        setIsMobile(getIsMobile(navigator.userAgent));

        return () => {
            document.removeEventListener('keydown', () => listenSend)
        }
    }, [])

    const listenSend = ({keyCode}) => {
        if(keyCode === 13) {
            handleSendMessage()
        }
    }

    const updateDb = () => {
        setMessageList((value) => {
            localStorage.setItem(mKey, JSON.stringify(value))
            return value
        })
    }

    const getId = () => {
        return ( new Date() ).getTime()
    }

    const getMeMessage = () => {
        return {
            role: 'user',
            content: inputM.replace(/^\n+|\n+$/g, ''),
        }
    }

    const selectSession = ({ list, id }) => {
        currentId.current = id;
        setCurrentMessages(list)
        scrollToB();
    }

    const loadLocalChats = () => {
        const items = localStorage.getItem(mKey)
        if (!items) { return }
        try {
            setMessageList(JSON.parse(items))
        } catch (e) {}
    }

    const handleSendMessage = () => {
        const message = getMeMessage()
        if (message.content.length === 0) {
            Message.warning('?????????')
            return
        }
        console.log(message.content)
        if(currentMessages.length === 0) {
            initSession(message.content);
        }
        const allList = [...currentMessages, getMeMessage()];
        updateMessages(allList)
        updateDb()
        scrollToB();
        sendMessage(allList)
    }

    const updateMessages = (allList) => {
        setCurrentMessages(allList)
        setMessageList(messageList => {
            return messageList.map(item => {
                if(item.id === currentId.current) {
                    item.list = allList;
                }
                return item;
            })
        })
        updateDb()
    }

    const scrollToB = () => {
        const oom = document.querySelector('.chat-content');
        oom.scrollTo(0, oom.scrollHeight)
        inputFocus()
        setTimeout(() => {
            const oom = document.querySelector('.chat-content');
            oom.scrollTo(0, oom.scrollHeight)
            inputFocus()
        }, 300)
    }

    const initSession = (title) => {
        currentId.current = getId();
        setMessageList((values) => {
            return [...values, {
                'id': currentId.current,
                'title': title,
                'list': [],
            }]
        })
    }

    const clearSession = () => {
        setCurrentMessages([]);
        setMessageList([])
        updateDb()
    }

    const createSession = () => {
        setCurrentMessages([]);
        inputFocus()
    }

    const inputFocus = () => {
        document.querySelector(".input-message").focus()
    }

    // ????????????
    const sendMessage = async (allList) => {
        setInputM('')
        setPending(true)
        const { data } = await axios.post('/api/gpt', { messages: allList.filter(({filter}) => !filter) }).catch(error => {
            Message.error("??????, ??????????????????????????????, ?????????")
        }).finally(() => setPending(false))

        updateMessages(data.messages)
        scrollToB();
        inputFocus()
    }

    const getIsMobile = userAgent => {
        if (
            userAgent.match(/Android/i) ||
            userAgent.match(/webOS/i) ||
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPad/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/BlackBerry/i) ||
            userAgent.match(/Windows Phone/i)
        )
            return true;
        return false;
    };

    const Link = ({ text, Icon, onClick }) => {
        return <div
            onClick={onClick}
            className={'hover:bg-gray-500 rounded text-white cursor-pointer text-left pl-5 h-10 leading-10'}>
            {Icon}
            {text}
        </div>
    }

    const MenuChat = ({ message }) => {
        const { title } = message
        return <div className={'mb-2'}>
            <Link text={title} onClick={() => selectSession(message)} Icon={<IconMessage className={'mr-2'}/>}/>
        </div>
    }

    const Menu = () => {
        return <div className={'md:w-56 bg-gray-900 p-2 flex flex-col h-full md:h-screen'}>
            <button
                onClick={createSession}
                className="bg-transparent border border-white rounded-md px-4 py-2 w-full text-white hover:bg-white hover:text-gray-800">
                <IconPlus/> ???????????????
            </button>
            <div className={'menu-chats flex-1 py-2'}>
                {
                    mLoading
                        ? <Spin className={'ml-2 mt-2'}/>
                        : messageList.map(
                            m => <MenuChat message={m} key={m.title}/>)
                }
            </div>
            <div className={'menu-footer'}>
                <Link text={'?????????????????????'} onClick={clearSession}
                      Icon={<IconDelete className={'mr-2'}/>}/>
                <Link text={'????????????'}
                      Icon={<IconLock className={'mr-2'}/>}/>
            </div>
        </div>
    }

    return (
        <main className={'flex'}>
            {
                isMobile ? <>
                    <Drawer
                        placement={'left'}
                        width={'80vw'}
                        footer={null}
                        title={<span>??????</span>}
                        visible={visible}
                        onOk={() => {
                            setVisible(false);
                        }}
                        onCancel={() => {
                            setVisible(false);
                        }}
                    >
                        <Menu />
                    </Drawer>
                    <IconMenuFold onClick={() => setVisible(!visible)} className={'absolute left-3 top-3 text-2xl'}/>
                </> : <Menu />
            }
            <div className="h-screen flex-grow flex flex-col flex-1">
                <div className="pt-12 flex-1 bg-gray-100 py-4 px-4 overflow-y-scroll chat-content" style={{ scrollBehavior: "smooth", paddingBottom: 50 }}>
                    {
                        currentMessages.length === 0 && <h3 className={'font-bold block text-center'}>?????????????????????...</h3>
                    }
                    <ul className="list-none">
                        {currentMessages.map((message, index) => (
                            <li key={index}
                                className={`mb-4 rounded p-2 ${message.role ===
                                'user' ? 'bg-gray-200' : ''}`}>
                                {
                                    message.role === 'user' ? <Avatar
                                            style={{ backgroundColor: '#00d0b6' }}
                                            className={'mr-2'}>???</Avatar>
                                        : <Avatar
                                            style={{ backgroundColor: '#2563EB' }}
                                            className={'mr-2'}>Bot</Avatar>
                                }
                                <pre
                                    className="bg-blue-500 text-white p-2 rounded-lg inline-block" style={{maxWidth: '75%'}}>
                                    {message.content}
                                </pre>
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="bg-white flex justify-between items-center py-2 px-4">
                    <TextArea
                        disabled={pending}
                        id="message-input"
                        type="text"
                        placeholder="????????????"
                        onChange={setInputM}
                        value={inputM}
                        onKeyUp={(event) => listenSend(event)}
                        className="flex-1 border input-message border-gray-300 rounded-full py-2 px-4 mr-2 focus:outline-none"
                    />
                    <Button
                        type={'primary'}
                        disabled={pending}
                        loading={pending}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                        onClick={handleSendMessage}
                    >
                        {pending ? '??????????????????' : '??????'}
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default ChatInterface
