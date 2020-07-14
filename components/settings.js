import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Settings() {
  const [settings, setSettings] = useState(null);

  // Fetch Settings
  useState(() => {
    axios(`/api/setting`)
      .then((response) => setSettings(response.data))
      .catch((err) => toast.error(err.message));
  }, []);

  return (
    <div className="settings">
      <h3 className="title">Settings</h3>
      <h6 className="subtitle is-6 has-text-grey">
        You can add/modify settings below
      </h6>
      <table className="table">
        <tbody>
          {!settings
            ? "Loading ..."
            : settings.length === 0
            ? "No settings available."
            : settings.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input type="checkbox" defaultChecked={s.enabled} />
                  </td>
                  <td>{s.type}</td>
                  <td>{s.data}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
