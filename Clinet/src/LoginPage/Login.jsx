import { useRef } from "react";
import "./Login.css";
function Login() {
    const email = useRef('');
    const password = useRef('');

    function loginHandler(event) {
        event.preventDefault();
        console.log(email.current.value);
        console.log(password.current.value);
        getUser(email.current.value, password.current.value);
    }

    async function getUser(email, password) {
        let login = {
            email: email,
            password: password
        }

        await fetch("http://localhost:4343/Users/login", {
            method: "POST",
            body: JSON.stringify(login),
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => console.log(data));
    }

    return (
        <>
            <div className="formContainer">
                <h2>Login Page</h2>
                <form action="" onSubmit={loginHandler}>
                    <div>
                        <label htmlFor="">Email</label>
                        <input ref={email} type="email" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input ref={password} type="password" />
                    </div>
                    <div>
                        <button type="submit">submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}
export { Login };