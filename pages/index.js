import { useState, useEffect } from "react";
import Head from "next/head";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";

import "react-toastify/scss/main.scss";
import "./index.scss";

dayjs.extend(relativeTime);

export default function Home({ baseUrl, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [messages, setMessages] = useState(null);
  const [stats, setStats] = useState({ pending: 0, total: 0, done: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Subscribe for new messages
    let subscribeMessages = setInterval(async () => {
      fetch(`${baseUrl}/api/message`)
        .then((response) => response.json())
        .then(setMessages)
        .catch(setError);

      fetch(`${baseUrl}/api/message/stats`)
        .then((response) => response.json())
        .then(setStats)
        .catch(setError);
    }, 2000);

    return () => {
      clearInterval(subscribeMessages);
    };
  }, []);

  const deleteMessage = (id) => {
    fetch(`${baseUrl}/api/message/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((response) => {
        setMessages(response);
        toast.success(`Message: ${id} was deleted!`);
      })
      .catch(setError);
  };

  return (
    <>
      <Head>
        <title>Tradingview Webhook Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer hideProgressBar={true} />
      <section className="section has-background-dark">
        <h1 className="title is-1 has-text-centered has-text-light">
          Tradingview Webhook Manager
        </h1>
        <h3 className="subtitle has-text-centered has-text-light pt-3">
          Webhook URL: <code>{baseUrl}/api/message/@mychannel</code>
        </h3>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns is-variable is-8">
            <div className="column">
              <div className="bots">
                <h3 className="title">Settings</h3>
                <h5 className="subtitle">You can add/modify settings below</h5>
                <table className="table">
                  <tbody>
                    {settings.length === 0
                      ? "No settings available."
                      : settings.map((s) => (
                          <tr>
                            <td>
                              <input type="checkbox" checked={s.enabled} />
                            </td>
                            <td>{s.type}</td>
                            <td>{s.data}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="column">
              <h3 className="title">Message Queue</h3>
              <h5 className="subtitle">
                Pending messages: {stats.pending} | Dispatched messages:{" "}
                {stats.done}
              </h5>
              <ul className="content">
                {!messages
                  ? "Fetching messages ..."
                  : messages.length === 0
                  ? "No messages in queue."
                  : messages.map((m) => (
                      <li className="my-5" key={m.id}>
                        <div className="card">
                          <a
                            className="delete"
                            style={{ position: "absolute", right: 15, top: 15 }}
                            onClick={() => deleteMessage(m.id)}
                          ></a>
                          <div className="card-content">
                            <div className="content">
                              <table className="table is-narrow">
                                <tbody>
                                  <tr>
                                    <td>
                                      <b>Message:</b>
                                    </td>
                                    <td>
                                      <kbd>{m.data}</kbd>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Channels:</b>
                                    </td>
                                    <td>
                                      {m.channels.split(",").map((c) => (
                                        <a
                                          href={`https://t.me/${c}`}
                                          target="new"
                                          className="tag is-danger mx-1"
                                        >
                                          {c}
                                        </a>
                                      ))}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Agent:</b>
                                    </td>
                                    <td>{m.agent}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Received:</b>
                                    </td>
                                    <td>
                                      <time title={m.createdAt}>
                                        {dayjs(m.createdAt).fromNow()}
                                      </time>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const protocol = req.protocol;
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  //  Fetch Bots
  const response = await fetch(`${baseUrl}/api/setting`);
  const settings = await response.json();

  return {
    props: { baseUrl, initialSettings: settings },
  };
}
