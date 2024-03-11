import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:${process.env.PORT}`;
const imageUrl = `${baseUrl}/assets/desciLogo.png`;

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "NERDEX",
        template: "%s | NErd Project Coordination",
    },
    description: "Built with PoK technology @DESCIWORLD",
    openGraph: {
        title: {
            default: "NERDEX",
            template: "%s | NErd Project Coordination",
        },
        description: "Built with PoK technology @DESCIWORLD",
        images: [
            {
                url: imageUrl,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: [imageUrl],
        title: {
            default: "NERDEX",
            template: "%s | NErd Project Coordination",
        },
        description: "Built with PoK technology @DESCIWORLD",
    },
    icons: {
        icon: [{ url: "/assets/nerdHouse.png", sizes: "32x32", type: "image/png" }],
    },
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <html>
            <body className="font-win"
            >
                <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            </body>
        </html>
    );
};

export default ScaffoldEthApp;
