import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from './DataContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [name, setName] = useState('')
	const [user, setUser] = useState({});

	const data = useData();

	useEffect(() => {
		if (name) {
			setUser(data.accounts.find((account) => account.name === name));
		}
	}, [name, data.accounts])

	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setName('');

		navigate('/login');
	};

	return (
		<AuthContext.Provider value={{ user, setName, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext)
}