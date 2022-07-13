import React, { useEffect, useRef, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';

const SIGNIN_URL = '/api/auth/signin';

export default function Login() {
	const { setAuth } = useAuth(AuthContext);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const userRef = useRef();
	const errRef = useRef();

	const [user, resetUser, userAttribs] = useInput('user', '');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [check, toggleCheck] = useToggle('persist', false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(SIGNIN_URL, { username: user, password: pwd }, { withCredentials: true });
			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;
			setAuth({ user, pwd, roles, accessToken });
			resetUser();
			setPwd('');
			navigate(from, { replace: true });
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

	// const togglePersist = () => {
	// 	setPersist((prev) => !prev);
	// };

	// useEffect(() => {
	// 	localStorage.setItem('persist', persist);
	// }, [persist]);

	return (
		<section>
			<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
				{errMsg}
			</p>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username : </label>
				<input type="text" name="" id="username" ref={userRef} autoComplete="off" {...userAttribs} required />
				<label htmlFor="password">Password : </label>
				<input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
				<button>Sign In</button>
				<div className="persistCheck">
					<input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
					<label htmlFor="persist">Trust This Device</label>
				</div>
			</form>
			<p>
				Need an Account ? <br />
				<span className="line">
					<Link to={'/register'}>Sign Up</Link>
				</span>
			</p>
		</section>
	);
}
