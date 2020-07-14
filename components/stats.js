import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

export default function Stats() {
  const [stats, setStats] = useState({
    env: "Loading",
    database: "Loading",
    messages: {
      pending: "∞",
      done: "∞",
      total: "∞",
    },
  });

  // Subscribe Stats
  useEffect(() => {
    let subscribeStats = setInterval(async () => {
      axios(`/api/stats`)
        .then((response) => setStats(response.data))
        .catch((err) => toast.error(err.message));
    }, 2000);

    return () => {
      clearInterval(subscribeStats);
    };
  }, []);

  return (
    <nav className="level">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Node Environment</p>
          <p className="title has-text-light">{stats.env}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Database</p>
          <p className="title has-text-light">{stats.database}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Worker</p>
          {!stats.workerActivateAt ||
          dayjs().diff(stats.workerActivateAt, "minute") >= 1 ? (
            <p className="title has-text-danger">INACTIVE</p>
          ) : (
            <p className="title has-text-success">RUNNING</p>
          )}
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Pending Messages</p>
          <p className="title has-text-light">{stats.messages.pending}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Dispatched Messages</p>
          <p className="title has-text-light">{stats.messages.done}</p>
        </div>
      </div>
    </nav>
  );
}
