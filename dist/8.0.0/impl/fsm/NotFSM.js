import { CancelFSMError } from "./CancelFSMError";
import { ConcurrentAndFSM } from "./ConcurrentAndFSM";
export class NotFSM extends ConcurrentAndFSM {
    mainFSM;
    constructor(mainFSM, negFSM, logger) {
        super([mainFSM], logger, [negFSM]);
        this.mainFSM = mainFSM;
        negFSM.addHandler({
            "fsmStops": () => {
                this.mainFSM.onCancelling();
                throw new CancelFSMError();
            }
        });
    }
}
