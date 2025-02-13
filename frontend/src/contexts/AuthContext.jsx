import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState({name: ''});

	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);

		navigate('/login');
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext)
}