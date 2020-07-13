import { useState } from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import Stats from "@/components/stats";
import Settings from "@/components/settings";
import Messages from "@/components/messages";

import "./index.scss";

export default function Home() {
  const [baseUrl, setBaseURL] = useState("http://localhost:3000");

  useState(() => {
    if (process.browser) {
      setBaseURL(window.location.origin);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Tradingview Webhook Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer hideProgressBar={true} />
      <section className="section has-background-link">
        <h1 className="title is-1 has-text-centered has-text-light">
          Tradingview Webhook Manager
        </h1>
        <h3 className="subtitle has-text-centered has-text-light pt-3">
          Webhook URL: <code>{baseUrl}/api/message/@mychannel</code>
        </h3>
      </section>
      <section className="section has-background-dark has-text-light">
        <div className="container">
          <Stats />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns is-variable is-8">
            <div
              className="column"
              style={{ borderRight: "1px solid hsl(0, 0%, 92%)" }}
            >
              <Settings />
            </div>
            <div className="column">
              <Messages />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
