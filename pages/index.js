import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

import Stats from "@/components/stats";
import Settings from "@/components/settings";
import Messages from "@/components/messages";

import "./index.scss";

export default function Home() {
  const [baseUrl, setBaseURL] = useState("http://localhost:3000");

  // Get window URL
  useState(() => {
    if (process.browser) {
      setBaseURL(window.location.origin);
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Tradingview Webhook Manager</title>
      </Head>
      <ToastContainer hideProgressBar={true} autoClose={2000} />
      <section className="section has-background-link">
        <h1 className="title is-1 has-text-centered has-text-light">
          Tradingview Webhook Manager
        </h1>
        <h3 className="subtitle has-text-centered has-text-light pt-3">
          Webhook URL:{" "}
          <code>{baseUrl}/api/message/@skdtradingviewbot?timeframe=1 day</code>
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
            <div className="column">
              <Settings />
            </div>
            <div
              className="column"
              style={{ borderLeft: "1px solid hsl(0, 0%, 92%)" }}
            >
              <Messages />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
