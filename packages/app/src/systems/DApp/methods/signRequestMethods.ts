import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import { useEffect } from 'react';

import type { SignMachineService } from '../machines';

import { IS_CRX_POPUP } from '~/config';
import type { MessageInputs } from '~/systems/CRX/background/services/types';
import { waitForState } from '~/systems/Core';

export class SignRequestMethods extends ExtensionPageConnection {
  readonly service: SignMachineService;

  constructor(service: SignMachineService) {
    super();
    this.service = service;
    super.externalMethods([this.signMessage]);
  }

  static start(service: SignMachineService) {
    return new SignRequestMethods(service);
  }

  async signMessage(input: MessageInputs['signMessage']) {
    this.service.send('START_SIGN', {
      input,
    });
    const state = await waitForState(this.service);
    return state.signedMessage;
  }
}

export function useSignRequestMethods(service: SignMachineService) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      SignRequestMethods.start(service);
    }
  }, [service]);
}
