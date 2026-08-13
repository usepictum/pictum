import { mount } from "svelte";
import App from "./App.svelte";
import "./style.css";

const root = document.querySelector("#app");

if (root === null) {
	throw new Error("Missing playground root element.");
}

mount(App, { target: root });
