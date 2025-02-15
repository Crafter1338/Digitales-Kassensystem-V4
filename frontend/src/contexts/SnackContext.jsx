import { createContext, useContext, useState, useRef } from 'react';
import { Box } from '@mui/joy';
import { motion, AnimatePresence  } from 'framer-motion';

const SnackContext = createContext(null);

export function SnackProvider({ children }) {
    const [snackEntries, setSnackEntries] = useState([]); 
    const idRef = useRef(0); 

    const addSnack = (snackComponent) => {
        const id = (idRef.current++).toString();
        setSnackEntries((prev) => [...prev, { id, snackComponent }]);

        setTimeout(() => {
            removeSnack(id);
        }, 2500);
    };

    const removeSnack = (id) => {
        setSnackEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    return (
        <SnackContext.Provider value={{ snackEntries, addSnack, removeSnack }}>
            {children}
            <Box
                sx={{
                    width: '100vw',
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
                }}
            >
                <AnimatePresence>
                    {snackEntries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }} // Fade in
                            exit={{ opacity: 0 }} // Fade out when removed
                            transition={{ duration: 0.5 }} // Duration of fade effect
                            style={{ display: 'flex', flexDirection: 'row-reverse' }}
                        >
                            {entry.snackComponent}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Box>
        </SnackContext.Provider>
    );
}

export function useSnack() {
    return useContext(SnackContext);
}
