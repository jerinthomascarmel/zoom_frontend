import { createContext } from "react";
import axios from "axios";
const BASEURL = import.meta.env.VITE_BASE_URL;


const client = axios.create({
  baseURL: BASEURL,
});

export const ClientContext = createContext(client);

export const ClientProvider = ({ children }) => {
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};
