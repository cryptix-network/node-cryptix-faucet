import "/style/style.js";
import {
  dpc,
  camelCase,
  html,
  UID,
  FlowApp,
  FlowFormat,
} from "/flow/flow-ux/flow-ux.js";
import { buildhCaptcha } from "./faucet-form.js";
export * from "./faucet-form.js";
export * from "./faucet-info.js";
export * from "./faucet-balance.js";
export * from "./faucet-transactions.js";
export * from "./cryptix-transaction.js";

class CryptixFaucetApp extends FlowApp {
  static get properties() {
    return {
      network: { type: String },
      networks: { type: Array },
      addresses: { type: Object },
      available: { type: Object },
      limits: { type: Object },
      captchaKey: { type: String },
    };
  }
  constructor() {
    super();

    this.networks = ["cryptix", "cryptixtest", "cryptixdev", "cryptixsim"];
    this.network = "cryptixtest";
    this.addresses = {};
    this.available = {};
    this.limits = {};
    this.opt = {};

    this.aliases = {
      cryptix: "MAINNET",
      cryptixtest: "TESTNET",
      cryptixdev: "DEVNET",
      cryptixsim: "SIMNET",
    };

    this.initLog();
    dpc(async () => this.init());
    this.registerListener("popstate", (e) => {
      let { menu = "home", args = [] } = e.state || {};
      console.log(
        `popstate: ${document.location}, state: ${JSON.stringify(e.state)}`,
      );
      this.setMenu(menu, args, true);
    });
  }

  async init() {
    await this.initSocketRPC({
      timeout: 90,
      args: {
        transports: ["websocket"],
      },
    });
    await this.initUI();
    dpc(() => this.setLoading(false));
  }

  async initUI() {
    this.bodyEl = document.body;
  }

  onlineCallback() {
    const { rpc } = flow.app;
    rpc.request("get-config", (err, config) => {
      //console.log("config: err, config", err, config)
      let { captchaKey = "" } = config || {};
      this.captchaKey = captchaKey;
      dpc(() => {
        buildhCaptcha();
      }, 500);
    });
    this.networkUpdates = rpc.subscribe(`networks`);
    (async () => {
      for await (const msg of this.networkUpdates) {
        const { networks } = msg.data;
        this.networks = networks;
        if (!this.networks.includes(this.network))
          this.network = this.networks[0];
        console.log("available networks:", networks);
        this.requestUpdate();
      }
    })().then();

    this.addressUpdates = rpc.subscribe(`addresses`);
    (async () => {
      for await (const msg of this.addressUpdates) {
        const { addresses } = msg.data;
        this.addresses = addresses;
        this.requestUpdate();
        // this.networks = networks;
        // console.log("available networks:",networks);
      }
    })().then();

    this.limitUpdates = rpc.subscribe(`limit`);
    (async () => {
      for await (const msg of this.limitUpdates) {
        const { network, limit, available } = msg.data;
        console.log("limits", msg.data);
        this.limits[network] = limit;
        this.available[network] = available;
        if (this.network == network) this.requestUpdate();
      }
    })().then();
  }

  offlineCallback() {
    this.networkUpdates.stop();
    this.addressUpdates.stop();
    this.limitUpdates.stop();
  }

  render() {
    let network = this.network;
    let address = this.addresses?.[this.network] || "";
    let limit = this.limits?.[this.network] || "";
    let available = this.available?.[this.network] || "";

    return html`
      <flow-app-layout no-drawer no-header>
        <div slot="main" class="main-area flex sbar" col>
          <div for="home" row class="content">
            <div class="divider"></div>
            <div col class="balance-wrapper">
              <faucet-balance network="${network}"></faucet-balance>
              <faucet-transactions network="${network}"></faucet-transactions>
            </div>
            <div class="divider"></div>
            <div col class="form-wrapper" style="background-color: #0B0E13 !important; padding: 30px; border-radius: 10px;">
              <faucet-info
                limit="${limit}"
                available="${available}"
                address="${address}"
              ></faucet-info>
			  <br /><hr style="border: 1px solid #adadad; width: 100%; margin: 20px 0;">

            <div class="cryptix_style" style="width: 95%; color: #03050E;">
              <faucet-form
                network="${network}"
                .networks="${this.networks}"
                address="${address}"
                @network-change="${this.onNetworkChange}"
              >
                <div
                  slot="captcha"
                  class="${this.captchaKey ? "h-captcha" : ""}"
                  data-sitekey="${this.captchaKey}"
                ></div>
              </faucet-form></div>
            </div>
            <div class="divider"></div>
          </div>
        </div>
      </flow-app-layout>
    `;
  }

  onNetworkChange(e) {
    console.log("on-network-change", e.detail);
    this.network = e.detail.network;
  }
}

CryptixFaucetApp.define("cryptix-faucet-app");
