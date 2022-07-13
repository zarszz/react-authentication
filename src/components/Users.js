import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Users = () => {
	const [users, setUsers] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				const response = await axiosPrivate.get('/api/test/user');
				isMounted && setUsers(response.data);
			} catch (error) {
				console.log(error);
				navigate('/login', { state: { from: location }, replace: true });
			}
		};
		getUsers();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<article>
			<h2>Users List</h2>
			{users?.length ? (
				<ul>
					{users.map((user, i) => {
						return <li key={i}>{user?.username}</li>;
					})}
				</ul>
			) : (
				<p>No users to display</p>
			)}
			<br />
		</article>
	);
};

export default Users;
