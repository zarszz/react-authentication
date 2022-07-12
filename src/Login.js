import React, { useEffect, useRef, useState, useContext } from 'react';
import AuthContext from './context/AuthProvider';
import axios from './api/axios';

const SIGNIN_URL = '/api/auth/signin';

export default function Login() {
	const { setAuth } = useContext(AuthContext);
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(SIGNIN_URL, { username: user, password: pwd });
			console.log(response);
			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;
			setAuth({ user, pwd, roles, accessToken });
			setUser('');
			setPwd('');
			setSuccess(true);
		} catch (error) {
			if (!error?.response) {
				setErrMsg('No server response');
			} else if (error.response.status === 400) {
				setErrMsg('Missing username or password');
			} else if (error.response.status === 401) {
				setErrMsg('Unauthorize');
			} else {
				setErrMsg('Login failed');
			}
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>You area logged in !</h1>
					<br />
					<p>
						<a href="">Go to Home</a>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
						{errMsg}
					</p>
					<h1>Sign In</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">Username : </label>
						<input
							type="text"
							name=""
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
						/>
						<label htmlFor="password">Password : </label>
						<input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
						<button>Sign In</button>
					</form>
					<p>
						Need an Account ? <br />
						<span className="line">
							{/* put with router */}
							<a href="#">Sign Up</a>
						</span>
					</p>
				</section>
			)}
		</>
	);
}
