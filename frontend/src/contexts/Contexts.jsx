import { MessageProvider } from "./MessageContext";
import { ServerDataProvider } from "./ServerDataContext";
import { SidebarProvider } from "./SidebarContext";
import { UserProvider } from "./UserContext";
import { ViewportProvider } from "./ViewportContext";
import { ActionConfirmationProvider } from "./ActionConfirmationContext"; 
import { HelpProvider } from "./HelpContext"; 

export default function({ children }) {
    return (
        <ViewportProvider>
            <ActionConfirmationProvider>
                <MessageProvider>
                    <ServerDataProvider>
                        <UserProvider>
                            <SidebarProvider>
                                <HelpProvider>
                                    {children}
                                </HelpProvider>
                            </SidebarProvider>
                        </UserProvider>
                    </ServerDataProvider>
                </MessageProvider>
            </ActionConfirmationProvider>
        </ViewportProvider>
    );
}