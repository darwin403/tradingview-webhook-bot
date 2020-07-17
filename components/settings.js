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

  // Update settings
  const updateSettings = (type, options) => {
    axios
      .patch(`/api/setting/${type}`, options)
      .then((response) => {
        console.log(response.data)
        setSettings(response.data);
        toast.success(`Updated setting: ${type}`);
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="settings">
      <h3 className="title">Settings</h3>
      <h6 className="subtitle is-6 has-text-grey">
        You can modify settings below
      </h6>
      <div className="table-container">
        <table className="table is-fullwidth">
          <tbody>
            {!settings
              ? "Loading ..."
              : settings.length === 0
              ? "No settings available."
              : settings.map(
                  (s) =>
                    !["worker"].includes(s.type) && (
                      <tr key={s.id}>
                        <td>
                          <input
                            type="checkbox"
                            disabled={["telegram:bot"].includes(s.type)}
                            defaultChecked={s.enabled}
                            onChange={(e) => {
                              updateSettings(s.type, {
                                enabled: e.target.checked,
                              });
                            }}
                          />
                        </td>
                        <td>{s.type}</td>
                        <td>
                          <div className="field">
                            <div className="control">
                              <input
                                className="input is-small"
                                type="text"
                                defaultValue={s.data}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateSettings(s.type, {
                                      data: e.target.value,
                                    });
                                  }
                                }}
                              />
                            </div>
                            <p className="help">
                              {(() => {
                                switch (s.type) {
                                  case "telegram:bot":
                                    return (
                                      <small>
                                        The telegram Bot Token that will be used
                                        for messages to the telegram channels.{" "}
                                        <b>NOTE:</b> Make sure this bot is added
                                        to the target channels.
                                      </small>
                                    );
                                    break;
                                  case "tradingview:credentials":
                                    return (
                                      <small>
                                        The tradingview username and password to
                                        use for taking a chart screenshot of the
                                        current stock price. <b>NOTE:</b> Use
                                        the template:{" "}
                                        <code>
                                          skdcodes@gmail.com:welcome@123
                                        </code>
                                        where skdcodes@gmail.com is your email
                                        and "welcome@123" is your password.
                                      </small>
                                    );
                                    break;
                                  case "tradingview:screenshot":
                                    return (
                                      <small>
                                        The DEFAULT timeframe to select while
                                        taking the chart screenshot of the
                                        current stock price.
                                      </small>
                                    );
                                  default:
                                    break;
                                }
                              })()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
