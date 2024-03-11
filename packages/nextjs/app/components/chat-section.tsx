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
        <div className='relative bg-no-repeat'>
                <ChatMessages
                    messages={transformedMessages}
                    isLoading={isLoading}
                    reload={reload}
                    stop={stop}
                />
            
            <div className="absolute w-full bottom-[-15%] sm:bottom-[-30%] md:bottom-[-30%] lg:bottom-[-25%] xl:bottom-[-20%]">
                    <ChatInput
                        input={input}
                        handleSubmit={handleSubmit}
                        handleInputChange={handleInputChange}
                        isLoading={isLoading}
                        multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
                    />

            </div>

        </div>

    );
}
