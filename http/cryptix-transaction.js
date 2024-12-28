import {
  dpc,
  html,
  css,
  BaseElement,
  FlowFormat,
} from "/flow/flow-ux/flow-ux.js";
import { CYTX } from "./cytx.js";

export class CryptixTransaction extends BaseElement {
  static get properties() {
    return {
      data: { type: Object },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 2px;
      }
      .transaction {
        margin-top: 4px;
      }
      .transaction :nth-child(1) {
        width: var(--value-column-width);
        text-align: center;
      }
      .transaction :nth-child(2) {
        width: var(--blue-score-column-width);
        text-align: center;
      }
      .transaction :nth-child(3) {
        width: var(--txid-column-width);
      }
      .xx-transaction div {
        border: 1px solid red;
      }
      .caption {
        font-family: "Open Sans";
        font-size: 14px;
      }
      .value {
        font-family: "Consolas";
        font-size: 16px;
        color: #666;
      }
      /*.value { font-family : "IBM Plex Mono"; font-size: 22px;  }*/
      /*.value { font-family : "IBM Plex Sans Condensed"; font-size: 22px;  }*/
      [row] {
        display: flex;
        flex-direction: row;
      }
      [col] {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  constructor() {
    super();
    this.transactions = [];
  }

  render() {
    let tx = this.data;

    return html`
      <div class="transaction"  style="color: #3cd33c !important;" row>
        <div class="value"  style="color: #3cd33c !important;">
          ${(tx.amount > 0 ? " " : "") + CYTX(tx.amount, true)}
        </div>
        <div class="value"  style="color: #3cd33c !important;">${FlowFormat.commas(tx.blockDaaScore)}</div>
        <div class="value"  style="color: #3cd33c !important;">${tx.transactionId.substring(0, 20)}</div>
      </div>
    `;
  }
}

CryptixTransaction.define("cryptix-transaction");
