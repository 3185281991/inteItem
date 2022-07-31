import Mitt from "mitt";

const eventHub = new Mitt();

eventHub.$on = eventHub.on;
eventHub.$off = eventHub.off;
eventHub.$emit = eventHub.emit;

export default eventHub;
