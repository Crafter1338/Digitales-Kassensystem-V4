import { MessageProvider } from "./MessageContext";
import { ServerDataProvider } from "./ServerDataContext";
import { SidebarProvider } from "./SidebarContext";
import { UserProvider } from "./UserContext";
import { ViewportProvider } from "./ViewportContext";

export default function({ children }) {
    return (
        <ViewportProvider>
            <MessageProvider>
                <ServerDataProvider>
                    <UserProvider>
                        <SidebarProvider>
                            {children}
                        </SidebarProvider>
                    </UserProvider>
                </ServerDataProvider>
            </MessageProvider>
        </ViewportProvider>
    );
}