import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ImouService } from './imou/imou.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imouService: ImouService,
  ) {}

  @Get()
  getHello() {
    return this.imouService.getAccessToken();
  }

  @Get('devices')
  async getDevices() {
    const res = await this.imouService.listDeviceDetailsByPage();
    return res.deviceList.map((it) => ({
      id: it.deviceId,
      name: it.deviceName,
      model: it.deviceModel,
      status: it.deviceStatus,
      channelList: it.channelList,
      product: it.productId,
    }));
  }

  @Get('products/:id/model')
  async getProductModel(@Param('id') productId: string) {
    return this.imouService.getProductModel(productId);
  }

  @Post('products/:productId/devices/:deviceId/properties')
  @ApiBody({})
  async setDeviceProperties(
    @Param('productId') productId: string,
    @Param('deviceId') deviceId: string,
    @Body() properties: any,
  ) {
    return await this.imouService.setDeviceProperties(
      productId,
      deviceId,
      properties,
    );
  }

  @Get('products/:productId/devices/:deviceId/properties')
  async getDeviceProperties(
    @Param('productId') productId: string,
    @Param('deviceId') deviceId: string,
  ) {
    const res = await this.imouService.getDeviceProperties(productId, deviceId);
    return {
      ...res,
      deviceId,
      productId,
    };
  }

  @Get('products/:productId/devices/:deviceId/properties/:propertyId')
  async getDeviceProperty(
    @Param('productId') productId: string,
    @Param('deviceId') deviceId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return await this.imouService.getDeviceProperty(
      productId,
      deviceId,
      propertyId,
    );
  }
}
