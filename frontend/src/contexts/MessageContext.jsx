import { Box, Card, Modal, Typography } from "@mui/joy";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useRef, useState } from "react";
import { Info, Done, Sos, PriorityHigh, Warning, Refresh } from '@mui/icons-material';

const MessageContext = createContext(null);

const typeToColor = {
    primary: 'primary',
    neutral: 'neutral',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    help: 'danger',
    loading: 'primary',
}

const typeToDecorator = {
    primary: <Info fontSize='lg' />,
    neutral: <Info fontSize='lg' />,
    success: <Done fontSize='lg' />,
    warning: <Warning fontSize='lg' />,
    danger: <PriorityHigh fontSize='lg' />,
    help: <Sos fontSize='lg' />,
    loading: <Refresh fontSize='lg' />
}

function Message({ message, type, timeout, Dialog, remove }) {
    const [modalVisible, setModalVisible] = useState(false);

    const hide = () => {
        setModalVisible(false);
        timeout && clearTimeout(timeout);
        remove();
    };

    return (
        <>
            <Card 
                sx={{ width: 0.65, maxWidth: 400, pointerEvents: 'auto' }} 
                color={typeToColor[type]} 
                variant="soft" 
                onClick={() => {
                    if (Dialog) {
                        setModalVisible(true);
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ flex: 1 }} color={typeToColor[type]} variant="soft">
                        {message}
                    </Typography>
                    {typeToDecorator[type]}
                </Box>
            </Card>

            {Dialog && <Modal open={modalVisible} onClose={hide}>
                <Dialog handleClose={hide} />
            </Modal>}
        </>
    );
}


export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const messageIDRef = useRef(0); 

    const write = (message, type = 'neutral', duration = 2500, dialog) => {
        const messageID = (messageIDRef.current++).toString();
        const timeout = duration > 0 && setTimeout(() => remove(messageID), duration) || null;

        type = type.length === 0 ? 'neutral' : type;

        const component = (
            <Message message={message} type={type} timeout={timeout} Dialog={dialog} remove={() => {remove(messageID)}}/>
        );

        setMessages(prev => [...prev, { id: messageID, component, timeout }]);
    }

    const remove = (messageID) => {
        setMessages(prev => prev.filter((message) => message.id !== messageID));
    }

    return (
        <MessageContext.Provider value={{ write, remove }}>
            {children}
            <Box sx={{
                width: 1,
                height: 1,
                position: 'fixed',
                top: 0,
                left: 0,
                justifyContent: 'end',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                gap: 1,
                zIndex: 9999,
                pointerEvents: 'none',
            }}>
                <AnimatePresence>
                    {messages.map(message => (
                        <motion.div key={message.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            style={{ display: 'flex', justifyContent: 'end', pointerEvents: 'auto' }}
                        >
                            {message.component}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Box>
        </MessageContext.Provider>
    );
}

export function useMessage() {
    return useContext(MessageContext);
}