import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Messages() {
  const [messages, setMessages] = useState(null);

  // Fetch Messages
  useState(() => {
    let subscribeMessages = setInterval(() => {
      axios(`/api/message`)
        .then((response) => setMessages(response.data))
        .catch((err) => toast.error(err.message));
    }, 2000);

    return () => {
      clearInterval(subscribeMessages);
    };
  }, []);

  // Handle delete
  const deleteMessage = (id) => {
    axios(`/api/message/${id}`, { method: "DELETE" })
      .then((response) => {
        setMessages(response.data);
        toast.success(`Message: ${id} was deleted!`);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="messages">
      <h3 className="title">Message Queue</h3>
      <h6 className="subtitle is-6 has-text-grey">
        View pending and failed messages.
      </h6>
      <ul className="content">
        {!messages
          ? "Loading ..."
          : messages.length === 0
          ? "No pending messages."
          : messages.map((m) => (
              <li className="my-5" key={m.id}>
                <div
                  className={`card ${
                    m.status === "failed" &&
                    "has-background-danger has-tooltip-danger has-tooltip-multiline"
                  }`}
                  data-tooltip={
                    m.status === "failed" ? `ERROR: ${m.log}` : null
                  }
                >
                  <a
                    className="delete"
                    style={{ position: "absolute", right: 15, top: 15 }}
                    onClick={() => deleteMessage(m.id)}
                  ></a>
                  <div className="card-content">
                    <div className="content table-container">
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
                              <b>Timeframe:</b>
                            </td>
                            <td>
                              <span className="tag">
                                {m.timeframe || "default"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>Channels:</b>
                            </td>
                            <td>
                              {m.channels.split(",").map((channel, i) => (
                                <a
                                  href={`https://t.me/${channel}`}
                                  target="new"
                                  className="tag is-link mx-1"
                                  key={i}
                                >
                                  {channel}
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
                          <tr>
                            <td>
                              <b>Status:</b>
                            </td>
                            <td>
                              <span
                                className={`tag ${
                                  m.status === "failed" && "is-danger"
                                }`}
                              >
                                {m.status}
                              </span>
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
  );
}
