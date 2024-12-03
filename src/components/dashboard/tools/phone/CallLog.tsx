import { createSignal, For, Show } from 'solid-js';
import { format } from 'date-fns';
import "./CallLog.css";
import { callLog } from '/src/data/callLog.json';
import { formatCallDuration, formatPhoneNumber } from '/src/common/utils/utils';

export default function CallLog(props:any) {

  return (
    <div class="call-container">
      <For each={callLog}>
        {(call, index) => (
          <div class="call-card">
            <div class="call-card-col">
              <div>{formatPhoneNumber(call.callerNumber)}</div>
              <div class="call-card-row">
                <img src={`/src/assets/icons/call-${call.callType.toLowerCase()}.svg`} alt={`${call.callType} icon`} class="call-type" />
                {formatCallDuration(call.duration)}
              </div>
            </div>
            <div class="cal-card-col align-end">
              <div>{format(call.timestamp, 'hh:mm aa')}</div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}