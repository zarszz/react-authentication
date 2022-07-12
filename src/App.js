import Login from './components/Login';
import Register from './components/Register';
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';

import Admin from './components/Admin';
import Editor from './components/Editor';
import Lounge from './components/Lounge';
import Home from './components/Home';

import Missing from './components/Missing';

import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/**  public routes */}
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="linkpage" element={<LinkPage />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				{/** protected routes */}
				<Route element={<RequireAuth allowedRoles={['ROLE_USER']} />}>
					<Route path="/" element={<Home />} />
					<Route element={<RequireAuth allowedRoles={['ROLE_EDITOR']} />}>
						<Route path="/editor" element={<Editor />} />
					</Route>
					<Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
						<Route path="/admin" element={<Admin />} />
					</Route>
					<Route element={<RequireAuth allowedRoles={['ROLE_ADMIN', 'ROLE_EDITOR']} />}>
						<Route path="/lounge" element={<Lounge />} />
					</Route>
				</Route>

				{/** catch all */}
				<Route path="*" element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;
