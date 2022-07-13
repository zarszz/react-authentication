import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/;
const REGISTER_URL = '/api/auth/signup';

export default function Register() {
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setemailFocus] = useState(false);

	const [gender, setGender] = useState('');
	const [genderFocus, setGenderFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		const result = USER_REGEX.test(user);
		setValidName(result);
	}, [user]);

	useEffect(() => {
		const result = PWD_REGEX.test(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
	}, [pwd, matchPwd]);

	useEffect(() => {
		const result = EMAIL_REGEX.test(email);
		setValidEmail(result);
	}, [email]);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		const v3 = EMAIL_REGEX.test(email);
		console.log('user : ', user, 'regex : ', USER_REGEX.test(user));
		console.log('pwd : ', pwd, 'regex : ', PWD_REGEX.test(pwd));
		console.log('email : ', email, ' regex result : ', EMAIL_REGEX.test(email));
		console.log('v1 : ', v1, ' v2 : ', v2, ' v3 : ', v3, ' gender : ', gender);
		if (!v1 || !v2 || !v3) {
			setErrMsg('Invalid Entry');
			return;
		}
		try {
			const body = {
				name: user,
				email,
				password: pwd,
				gender,
				roles: ['user']
			};
			await axios.post(REGISTER_URL, JSON.stringify(body), {
				headers: { 'Content-Type': 'application/json' }
			});
			setSuccess(true);
		} catch (error) {
			if (!error?.response) {
				setErrMsg('No server response');
			} else if (error.response?.status === 409) {
				setErrMsg('Username Taken');
			} else {
				setErrMsg('Registration Failed');
			}
			errRef.current.focus();
		}
	};
	return (
		<>
			{success ? (
				<section>
					<h1>Success !</h1>
					<p>
						<Link href="#">Sign In</Link>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
						{errMsg}
					</p>
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">
							Username :
							<span className={validName ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validName || !user ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							required
							aria-invalid={validName ? 'false' : 'true'}
							aria-describedby="uid"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p id="uidnote" className={userFocus && user && !validName ? 'instructions' : 'offscreen'}>
							<FontAwesomeIcon icon={faInfoCircle} />
							2 to 24 characters.
							<br />
							Must begin with a letter.
							<br />
							Letters, numbers, underscores, hyphens allowed.
						</p>
						<label htmlFor="email">
							Email :
							<span className={validEmail ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validEmail || !email ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</label>
						<input
							type="text"
							name="email"
							id="email"
							autoComplete="off"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							aria-invalid={validEmail ? 'false' : 'true'}
							aria-describedby="email"
							onFocus={() => setemailFocus(true)}
							onBlur={() => setemailFocus(false)}
						/>
						<p id="email" className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Email format should valid
						</p>
						<label htmlFor="gender">Gender:</label>
						<select
							name="gender"
							id="gender"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							onFocus={() => setGenderFocus(true)}
							onBlur={() => setGenderFocus(false)}
						>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						<p id="pwdnote" className={genderFocus && gender === '_' ? 'instructions' : 'offscreen'}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Gender is required !!.
						</p>
						<label htmlFor="password">
							Password :
							<span className={validPwd ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							required
							aria-invalid={validPwd ? 'false' : 'true'}
							aria-describedby="pwdnote"
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						<p id="pwdnote" className={pwdFocus && pwd && !validPwd ? 'instructions' : 'offscreen'}>
							<FontAwesomeIcon icon={faInfoCircle} />
							8 to 24 characters.
							<br />
							Must iclude uppercase nad lowercase letters, a number, and a special character.
							<br />
							Allowed special characters: <span aria-label="exclamation mark">!</span>{' '}
							<span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{' '}
							<span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
						</p>
						<label htmlFor="confirm_pwd">
							Password :
							<span className={validMatch && matchPwd ? 'valid' : 'hide'}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
							<span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</label>
						<input
							type="password"
							id="confirm_pwd"
							onChange={(e) => setMatchPwd(e.target.value)}
							required
							aria-invalid={validMatch ? 'false' : 'true'}
							aria-describedby="confirmnote"
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						<p id="pwdnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Must match with first password;
						</p>
						<button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
					</form>
					<p>
						Already registered ?<br />
						<span className="line">
							<Link to={'/login'}>Sign In</Link>
						</span>
					</p>
				</section>
			)}{' '}
		</>
	);
}
