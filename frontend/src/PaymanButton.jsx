import { useEffect } from "react";

const PaymanButton = () => {
  useEffect(() => {
    // Avoid injecting script multiple times
    if (!document.getElementById("payman-script")) {
      const script = document.createElement("script");
      script.src = "https://app.paymanai.com/js/pm.js";
      script.async = true;
      script.id = "payman-script"; // ID to prevent re-adding

      script.setAttribute("data-client-id", "pm-test-aaQzmXN2gToNlG-ukKQIJm_N");
      script.setAttribute(
        "data-scopes",
        "read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet"
      );
      script.setAttribute("data-redirect-uri", "http://localhost:5173");
      script.setAttribute("data-target", "#payman-connect");
      script.setAttribute("data-dark-mode", "false");

      document.body.appendChild(script);
    } else {
      // Script already exists, manually re-render widget if needed
      if (window.PaymanConnect) {
        window.PaymanConnect.render({
          target: "#payman-connect",
          clientId: "pm-test-aaQzmXN2gToNlG-ukKQIJm_N",
          scopes:
            "read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet",
          redirectUri: "http://localhost:5173",
          darkMode: false,
        });
      }
    }
  }, []);

  return <div id="payman-connect" />;
};

export default PaymanButton;
