import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const login = (name, password) => {
		setUser({});
	};

	const loginToken = () => {
		const token = localStorage.getItem('token');
		if (!token) { return }
		
		const user = {};

		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);

		navigate('/login');
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}