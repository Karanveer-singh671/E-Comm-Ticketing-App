import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: () => Router.push("/"),
	});

	useEffect(() => {
		doRequest();
		// array as second argument (run 1 time (tells React that your effect does not depend on any values from props or state))
	}, []);
	// need to do a sign out from a component (browser) since if do it from getIntitialProps will come from server and server does not know
	// what to do with cookie returned
	return <div>Signing You out</div>;
};
