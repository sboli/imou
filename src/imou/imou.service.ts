import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as uuid from 'uuid';
import * as crypto from 'node:crypto';
import { firstValueFrom } from 'rxjs';

function interpolateColorTemp(inputValue: number) {
  const minTemp = 2700;
  const maxTemp = 6500;
  const step = 100;

  const clampedValue = Math.max(minTemp, Math.min(maxTemp, inputValue));

  const nearestStep =
    Math.round((clampedValue - minTemp) / step) * step + minTemp;

  return nearestStep;
}

@Injectable()
export class ImouService implements OnModuleInit {
  private readonly logger = new Logger(ImouService.name);
  private accessToken?: string;
  constructor(private readonly http: HttpService) {
    setTimeout(() => {
      this.getAccessToken();
      this.getMessageCallback().then(console.log);
      this.setMessageCallback()
        .then((ok: boolean) => {
          ok
            ? this.logger.log(
                'Callback configured: ' + process.env.CALLBACK_URL,
              )
            : this.logger.error(
                'Error while configuring callback: ' + process.env.CALLBACK_URL,
              );
        })
        .catch(this.logger.error.bind(this));
    }, 1000);
  }

  onModuleInit() {
    this.getAccessToken();
  }

  public async getMessageCallback() {
    await this.getAccessToken();
    const res = await this.post('/getMessageCallback', {
      params: {
        token: this.accessToken,
      },
    });
    return res.result.data;
  }

  public async setMessageCallback() {
    await this.getAccessToken();
    const res = await this.post('/setMessageCallback', {
      params: {
        token: this.accessToken,
        callbackFlag: 'deviceStatus',
        callbackUrl: process.env.CALLBACK_URL,
        status: 'on',
        basePush: '1',
      },
    });
    return res.result.code === '0';
  }

  public async getDeviceProperty(
    productId: string,
    deviceId: string,
    propertyId: string,
  ) {
    await this.getAccessToken();
    const res = await this.post('/getIotDeviceProperties', {
      params: {
        token: this.accessToken,
        productId,
        deviceId,
        properties: [propertyId],
      },
    });
    return res.result.data.properties;
  }

  public async getDeviceProperties(productId: string, deviceId: string) {
    if (!this['propRefs']) {
      const props = await this.getProductModel(productId);
      this['propRefs'] = props.properties.map((it: any) => it.ref);
    }
    await this.getAccessToken();
    const res = await this.post('/getIotDeviceProperties', {
      params: {
        token: this.accessToken,
        productId,
        deviceId,
        properties: this['propRefs'],
      },
    });
    return {
      ...res.result.data.properties,
      status: res.result.data.status,
      name: res.result.data.name,
      channel: res.result.data.channelNum,
    };
  }

  public async setDeviceProperties(
    productId: string,
    deviceId: string,
    properties: any,
  ) {
    if (properties['1003']) {
      properties['1003'] = interpolateColorTemp(properties['1003']);
    }
    await this.getAccessToken();
    const res = await this.post('/setIotDeviceProperties', {
      params: {
        token: this.accessToken,
        productId,
        deviceId,
        properties,
      },
    });
    return properties;
  }

  public async getProductModel(productId: string) {
    await this.getAccessToken();
    const res = await this.post('/getProductModel', {
      params: {
        token: this.accessToken,
        productId,
      },
    });
    return res.result.data;
  }

  public async listDeviceDetailsByPage() {
    await this.getAccessToken();
    const res = await this.post('/listDeviceDetailsByPage', {
      params: {
        token: this.accessToken,
        pageSize: 50,
        page: 1,
      },
    });
    console.log(res);
    return res.result.data;
  }

  public async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    const res = await this.post('/accessToken');
    this.accessToken = res.result.data.accessToken;
    setTimeout(
      () => {
        this.accessToken = undefined;
      },
      (res.result.data.expireTime - 5) * 1000,
    );
    return this.accessToken;
  }

  private getRequestDefaults() {
    const system = {
      ver: '1.0',
      appId: process.env.APP_ID,
      time: Math.round(new Date().getTime() / 1000),
      nonce: uuid.v4(),
      sign: '',
    };
    system.sign = crypto
      .createHash('MD5')
      .update(
        `time:${system.time},nonce:${system.nonce},appSecret:${process.env.APP_SECRET}`,
      )
      .digest('hex');
    return {
      id: uuid.v4(),
      system,
      params: {},
    };
  }

  async post(path: string, payload?: any, params?: any) {
    const defs = this.getRequestDefaults();
    const { data } = await firstValueFrom(
      this.http.post(
        `${process.env.API_URL}${path}`,
        {
          ...defs,
          ...payload,
        },
        {
          params,
          headers: {
            accept: 'application/json',
          },
        },
      ),
    );
    return data;
  }
}
