"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useDarkMode } from "~~/hooks/scaffold-eth/useDarkMode";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import { HackathonEntry } from "~~/types/dbSchema";
import Frame from "./assets/Frame";
//import { EAS } from "@ethereum-attestation-service/eas-sdk";

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};


const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
    const price = useNativeCurrencyPrice();
    const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
    const setHackathonEntries = useGlobalState(state => state.setHackathonEntries);
    const he = [] as HackathonEntry[];
    const state = useGlobalState(state => state.hackathonEntries);
    useEffect(() => {
        if (price > 0) {
            setNativeCurrencyPrice(price);
            setHackathonEntries(he);
            console.log(state);
        }
    }, [setNativeCurrencyPrice, price]);

    return (
        <>
            <div className="flex flex-col min-h-screen max-w-screen bg-black z-20">

                <main className="font-win relative flex flex-col flex-1 ">{children}</main>

            </div>
            <Toaster />
        </>
    );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
    const { isDarkMode } = useDarkMode();
    return (
        <WagmiConfig config={wagmiConfig}>
            <ProgressBar />
            <RainbowKitProvider
                chains={appChains.chains}
                avatar={BlockieAvatar}
                theme={isDarkMode ? darkTheme() : lightTheme()}
            >
                <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
