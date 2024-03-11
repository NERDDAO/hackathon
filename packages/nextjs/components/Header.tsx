"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
];

export const HeaderMenuLinks = () => {
    const pathname = usePathname();

    return (
        <>
            {menuLinks.map(({ label, href, icon }) => {
                const isActive = pathname === href;
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            passHref
                            className={"bg-opacity-0 hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col"}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    </li>
                );
            })}
        </>
    );
};

/**
 * Site header
 */
export const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const burgerMenuRef = useRef<HTMLDivElement>(null);
    useOutsideClick(
        burgerMenuRef,
        useCallback(() => setIsDrawerOpen(false), []),
    );

    return (
        <div className="sticky lg:static top-0 left-2 navbar bg-opacity-0 min-h-0 flex-shrink-0 justify-between z-10 px-0 sm:px-2">
            <div className="navbar-start w-auto lg:w-1/2">

                <Link href="/" passHref className="hidden lg:flex items-center gap-2 shrink-0">
                    <div className="flex relative w-20 h-20">
                        <Image alt="SE2 logo" className="cursor-pointer" fill src="/assets/nerdHouse.png" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold leading-tight text-xs md:text-s lg:text-m xl:text-lg">NerdDEX</span>
                        <span className="text-xs md:text-xs lg:text-sm xl:text-md">Researcher</span>
                        <span className="text-xs md:text-xs lg:text-sm xl:text-md">Coordination Tool</span>

                    </div>
                </Link>

                <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
                    <HeaderMenuLinks />
                </ul>

                <div className="flex flex-row absolute sm:top-[00%] md:top-[00%] lg:top-[0%] xl:top-[10%] sm:left-[25%] md:left-[45%] lg:left-[65%] xl:left-[80%] 2xl:left-[87%] 3xl:left-[95%]">
                    <RainbowKitCustomConnectButton />
                    {/* <FaucetButton /> */}
                </div>
            </div>
        </div>
    );
};
