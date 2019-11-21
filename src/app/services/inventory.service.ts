import { BodyMixComponent } from './../models/bodyMixComponent';
import { Injectable } from '@angular/core';
import { MixComponent } from '../models/mixComponent';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// interface paintInventoryMap {
//   name: string;
//   quantity: number;
//   consumptionPerDay: number;
//   consumptionPerMonth: number;
//   remainingTime: number;
// }

export class InventoryService {

  paintMaterialInventory = {};
  clayMaterialInventory = {};

  constructor() { }

  // checked: true
  // meterNumber: 10
  // meterWeight: 12
  // selectedEngobMix: { createdAt: "2019-11-15T14:53:23.076Z", _id: "5dcebbe3c32a884bb83eb285", code: "matwalls1", type: "walls", glize: "mat", … }
  // selectedPaintMix: { createdAt: "2019-11-15T14:53:23.076Z", _id: "5dcebbe3c32a884bb83eb285", code: "matwalls1", type: "walls", glize: "mat", … }
  // title: "Mat Walls"

  startInventory(options: any, isClay: boolean): any {
    for (const type in options) {
      if (options[type].checked) {
        if (!isClay) {
          // if paint warehouse
          for (const item of options[type]['selectedPaintMix'].components) {
            this.calculateMaterialConsumptionPaint(item, options, type, true);
          }

          for (const item of options[type]['selectedEngobMix'].components) {
            this.calculateMaterialConsumptionPaint(item, options, type, false);
          }
        } else {
          // if clay warehouse
          for (const item of options[type]['selectedBodyMix'].components) {
            this.calculateMaterialConsumptionBody(item, options, type);
          }
        }
      }
    }    
    console.log('clayMaterialInventory ', this.clayMaterialInventory);
    console.log('paintMaterialInventory ', this.paintMaterialInventory);
    
    // consumptionPerDay: 533400
    // consumptionPerMonth: 16002000
    // name: "material1"
    // quantity: 24150
    // remainingTime: 1.0794042232277528
    const data = isClay ? this.clayMaterialInventory : this.paintMaterialInventory;
    const dataSource = [];

    for(const matID in data) {
      const obj = {
        _id: matID,
        consumptionPerDay: data[matID].consumptionPerDay,
        consumptionPerMonth: data[matID].consumptionPerMonth,
        name: data[matID].name,
        quantity: data[matID].quantity,
        remainingTime: data[matID].remainingTime
      };
      dataSource.push(obj);
    }

    console.log('dataSource ', dataSource);
    return dataSource;
  }


  calculateMaterialConsumptionPaint(item, options, type, isPaint): void {
    const component: MixComponent = item;
    const meterWeight = isPaint ? options[type].meterPaintWeight : options[type].meterEngobWeight;
    const materialWeightInMeter = meterWeight * component.quantity;
    const consumptionPerDay = options[type].meterNumber * materialWeightInMeter;
    const consumptionPerMonth = consumptionPerDay * 30;
    const remainingTime = component.material.quantity / consumptionPerDay;
    console.log('paintOptions.meterNumber ', options[type].meterNumber);

    if (this.paintMaterialInventory[component.material._id]) {
      // if material is exist in the map => update its data
      this.paintMaterialInventory[component.material._id] = {
        ...this.paintMaterialInventory[component.material._id],
        consumptionPerDay: this.paintMaterialInventory[component.material._id].consumptionPerDay + consumptionPerDay,
        consumptionPerMonth: this.paintMaterialInventory[component.material._id].consumptionPerMonth + consumptionPerMonth,
        remainingTime: this.paintMaterialInventory[component.material._id].remainingTime + remainingTime
      };

    } else {
      // if material does not exist in map yet => create new object
      this.paintMaterialInventory[component.material._id] = {
        name: component.material.name,
        quantity: component.material.quantity,
        consumptionPerDay: consumptionPerDay,
        consumptionPerMonth: consumptionPerMonth,
        remainingTime: remainingTime
      };
    }
  }

  calculateMaterialConsumptionBody(item, options, type): void {
    const component: BodyMixComponent = item;
    const meterWeight = options[type].meterWeight;
    const materialWeightInMeter = meterWeight * component.quantity;
    const consumptionPerDay = options[type].meterNumber * materialWeightInMeter;
    const consumptionPerMonth = consumptionPerDay * 30;
    const remainingTime = component.material.quantity / consumptionPerDay;


    if (this.clayMaterialInventory[component.material._id]) {
      // if material is exist in the map => update its data
      this.clayMaterialInventory[component.material._id] = {
        ...this.clayMaterialInventory[component.material._id],
        consumptionPerDay: this.clayMaterialInventory[component.material._id].consumptionPerDay + consumptionPerDay,
        consumptionPerMonth: this.clayMaterialInventory[component.material._id].consumptionPerMonth + consumptionPerMonth,
        remainingTime: this.clayMaterialInventory[component.material._id].remainingTime + remainingTime
      };

    } else {
      // if material does not exist in map yet => create new object
      this.clayMaterialInventory[component.material._id] = {
        name: component.material.name,
        quantity: component.material.quantity,
        consumptionPerDay: consumptionPerDay,
        consumptionPerMonth: consumptionPerMonth,
        remainingTime: remainingTime
      };
    }
  }
}
