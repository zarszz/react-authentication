import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/userRefreshToken';
import useLocalStorage from '../hooks/useLocalStoraga';

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	const [persist] = useLocalStorage('persist', false);

	useEffect(() => {
		let isMounted = true;
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error) {
				console.error(error);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

		return () => (isMounted = false);
	}, []);

	useEffect(() => {
		console.log(`isLoading : ${isLoading}`);
		console.log(`auth : ${JSON.stringify(auth?.accessToken)}`);
	}, [isLoading]);

	return <>{!persist ? <Outlet /> : isLoading ? <p>Loading.....</p> : <Outlet />}</>;
};

export default PersistLogin;
