import useLocalStorage from './useLocalStoraga';

function useInput(key, initValue) {
	const [value, setValue] = useLocalStorage(key, initValue);
	const reset = () => setValue(initValue);
	const attributeObj = {
		value,
		onChange: (e) => setValue(e.target.value)
	};
	return [value, reset, attributeObj];
}

export default useInput;
