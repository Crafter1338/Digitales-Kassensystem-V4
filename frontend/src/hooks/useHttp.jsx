import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const endpoint = 'http://localhost:80';

export default function useHttp() {
	const navigate = useNavigate();
	const auth = useAuth();

	return async (method, url, data = null) => {
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				navigate('/login');
				return null;
			}

			const config = {
				method,
				url: `${endpoint}${url}`,
				headers: {
				'Content-Type': 'application/json',
				...{ Authorization: `Bearer ${token}` },
				},
				data,
			};

			const response = await axios(config);

			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 401) { auth.logout() }
			
			throw error;
		}
	};
}
