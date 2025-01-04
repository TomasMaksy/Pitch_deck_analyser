import { DM_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ClientProvider } from "./ClientProvider"; // Adjust the import path as needed

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={clsx(dmSans.className, "antialiased bg-[#EAEEFE]")}>
				<ClientProvider>{children}</ClientProvider>
			</body>
		</html>
	);
}
