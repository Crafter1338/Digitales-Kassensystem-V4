import { Box, Button, Modal, ModalDialog, Typography } from '@mui/joy';
import React, { createContext, useContext, useState } from 'react';

const ActionConfirmationContext = createContext();

export function ActionConfirmationProvider({ children }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalCallback, setModalCallback] = useState(null);
    const [modalColor, setModalColor] = useState(null);
    const [buttonText, setButtonText] = useState('');

    const confirm = (text, buttonText, callback, color) => {
        setButtonText(buttonText || 'OK');
        setModalColor(color || 'neutral');
        setModalText(text);
        setModalCallback(() => callback);
        setModalOpen(true);
    };

    const close = () => {
        setButtonText('');
        setModalColor('neutral');
        setModalOpen(false);
        setModalText('');
        setModalCallback(null);
    };

    return (
        <ActionConfirmationContext.Provider value={{ confirm, close }}>
            {children}
            <Modal open={modalOpen} onClose={close}>
                <ModalDialog>
                    <Typography level='h4' color={modalColor} sx={{ textAlign: 'left' }}>
                        Achtung:
                    </Typography>
                    <Box>
                        <Typography level='body-lg' sx={{ textAlign: 'left' }}>
                            {modalText}
                        </Typography>
                    </Box>
    
                    <Button onClick={() => {modalCallback(); close()}} sx={{ flex: 1, mt: 1 }} variant='soft' color={modalColor}>
                        {buttonText}
                    </Button>
                </ModalDialog>
            </Modal>
        </ActionConfirmationContext.Provider>
    );
}

export function useActionConfirmation() {
    return useContext(ActionConfirmationContext);
}