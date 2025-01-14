import {
  dpc,
  html,
  css,
  BaseElement,
  FlowFormat,
} from "/flow/flow-ux/flow-ux.js";
import { CYTX } from "./cytx.js";

export class FaucetInfo extends BaseElement {
  static get properties() {
    return {
      limit: { type: Number },
      available: { type: Number },
      address: { type: String },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
        font-family: "Open Sans";
      }
      .caption {
        font-size: 22px;
      }
      .info-content {
        font-size: 18px;
      }
      .address-box {
        background:rgb(21, 64, 139);
        font-size: 0.82rem;
        font-weight: bold;
        /* border: 1px solid; */
        padding: 12px;
        border-radius: 5px;
        box-shadow: var(--flow-input-box-shadow);
        margin: 10px 0px;
        display: block;
        text-align: center;
      }

    `;
  }

  constructor() {
    super();
    this.limit = 0;
    this.available = 0;
    this.address = "";
  }

  render() {
    return html`
      <div class="info">
      <div class="caption" style="color: #00bcd4 !important; font-size: 32px !important;">Cryptix Faucet</div><br />
      <div class="info-content">
        <p>The Cryptix Faucet provides free Cryptix Coins (CYTX) to users upon request.</p>
        <p>
          You can send or mine Cryptix at the designated faucet address. If the faucet has enough balance, it will send CYTX to the address you provide.
        </p><br />
        <p>Faucet deposits are accepted at this address:</p>
		<div class="max-width" style="max-width: 99%; word-break: break-all;">
		  <p><b class="address-box">${this.address}</b></p><br />
		</div>

        <p>
          Please note: Requests are limited to a maximum of <b style="color: red !important;">${CYTX(this.limit)} CYTX</b> per IP address every <b style="color: red !important;">24 hours</b>.
        </p>
            You currently have <b style="color: #3cd33c !important;">${CYTX(this.available)} CYTX</b> ${this.limit ==
            this.available
              ? "available"
              : "remaining"}.
          </p><br />
        <p>Don't have a wallet yet? You can easily create one for free by clicking below:</p>
        <a href="https://wallet.cryptix-network.org/" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #4CAF50; color: white; text-align: center; border-radius: 5px; text-decoration: none; font-size: 14px; transition: background-color 0.3s;">
          Create a Wallet
        </a><br />
        </div>
      </div>
    `;
  }
}

FaucetInfo.define("faucet-info");
