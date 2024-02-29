"use client";

import { useChat } from "ai/react";
import { useMemo } from "react";
import { insertDataIntoMessages } from "./transform";
import { ChatInput, ChatMessages } from "./ui/chat";

export default function ChatSection() {
    const {
        messages,
        input,
        isLoading,
        handleSubmit,
        handleInputChange,
        reload,
        stop,
        data,
    } = useChat({
        api: process.env.NEXT_PUBLIC_CHAT_API,
        headers: {
            "Content-Type": "application/json", // using JSON because of vercel/ai 2.2.26
        },
    });

    const transformedMessages = useMemo(() => {
        return insertDataIntoMessages(messages, data);
    }, [messages, data]);

    return (
        <div className={`relative bg-[url(/assets/chatFrame.png)] bg-no-repeat bg-contain ml-72 mb-4 right-14 mt-0 p-12 w-11/12 max-h-1/3 h-1/3 max-w-full  flex flex-col items-center`}>

            <ChatMessages
                messages={transformedMessages}
                isLoading={isLoading}
                reload={reload}
                stop={stop}
            />
            <ChatInput
                input={input}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                isLoading={isLoading}
                multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
            />

        </div>

    );
}
