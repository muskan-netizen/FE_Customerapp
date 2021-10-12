import { BluetoothEscposPrinter, BluetoothManager } from "@brooons/react-native-bluetooth-escpos-printer";
import RNFetchBlob from "rn-fetch-blob-v2";
import { appData, language } from "../../../App";
import actions from "../../redux/actions";
const fs = RNFetchBlob.fs;

export let arr = []
export let canEnablePrinter = true

/**@function : Get Details of order for print bills */
const _getOrderDetails = async (_data) => {
  console.log('check app data >>>>', _data)
  return new Promise((resolve, reject) => {
    let data = {};
    data['order_id'] = '408';

    actions
      .getOrderDetailForBilling(data, {
        code: appData?.appData.profile?.code,
        currency: 1,
        language: language ? language?.primary_language?.id : 148,
      })
      .then((res) => {
        if (res?.data) {
          resolve(res?.data)
        }
      })
      .catch((err) => reject(err));
  })
};

/** @function : Queuing the jobs for printing in sequence */
export const StartPrinting = (_data) => {
  console.log('check start printing >>>>', _data)
  // arr.push({"item_count":3,"payment_option_title":"Cash On Delivery","total_discount":"0.00","address":{"address":"5, Madhya Marg, 28B, Sector 28B, Chandigarh, 160028, India","user_id":1,"id":77},"order_number":"02437024","address_id":77,"payment_option_id":1,"total_delivery_fee":"0.00","user_id":1,"total_amount":13,"id":391,"loyalty_amount_saved":"2.75","payable_amount":"10.25","taxable_amount":"0.00","vendors":[{"vendor":{"name":"La Fresca de Italia","id":2,"auto_accept_order":0},"vendor_id":2,"id":402,"order_id":391,"products":[{"addon":[],"product_id":71,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":71,"id":85,"sku":"LA113","title":null}],"id":450,"product_name":" Buckhorn Burger","order_id":391},{"addon":[],"product_id":72,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":72,"id":86,"sku":"LA114","title":null}],"id":451,"product_name":"Ham Sandwich","order_id":391},{"addon":[],"product_id":73,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":73,"id":87,"sku":"LA115","title":null}],"id":452,"product_name":"Quesadilla","order_id":391}]}],"user":{"timezone":"Asia\/Kolkata","name":"Pankaj Pundir","id":1}})

  arr.push(_data)

  if (canEnablePrinter) {
    console.log('check start printing >>>> 1')
    initPrinter()
  }
}

/** @function : Start Printing Loop for all queued jobs */
export const initPrinter = () => {
  console.log('check start printing >>>> 2', arr[0])
  canEnablePrinter = false

  _getOrderDetails(arr[0]).then(res => {
    console.log('check _getOrderDetails response >>>', JSON.stringify(res))
    printReciept(res).then(() => {
      console.log('check start printing >>>> 3')
      arr.shift()
      setTimeout(() => {
        if (arr.length > 0) {
          initPrinter()
        } else {
          canEnablePrinter = true
        }
      }, 2000);
    })
  }).catch(err => {
    console.log('check catch block >>>', err)
  })
}

/** @function : Get Image and convert into Base64 for print on bill */
function getBase64Image(img) {
  let imagePath = null;
  return new Promise(resolve => {
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", img)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile("base64");
      })
      .then(base64Data => {
        // here's base64 encoded image
        console.log('checking base 64 image ', base64Data);
        // remove the file from storage
        resolve({ url: imagePath, base64String: base64Data })
        // return fs.unlink(imagePath);
      });
  })

}

const base64Logo = "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"

export const printReciept = async (data) => {

  console.log('check notifications length >>>> 8', data)
  return new Promise((resolve, reject) => {
    //   const detail = {
    //     Vendor: 'La Fresca de Italia',
    //     order_number: '#0697030279',
    //     address: {address:"5, Madhya Marg, 28B, Sector 28B, Chandigarh, 160028, India","user_id":1,"id":77},
    //     Items: [
    //       { name: 'Pizza', qty: 2, amt: 400, add_ons: [{ title: 'cheese' }, { title: 'capsicum' }] },
    //       { name: 'Rolls', qty: 5, amt: 900 },
    //       { name: 'UCB shirt', qty: 1, amt: 1300, variant: 'black' },
    //     ],
    //     item_count: 7,
    //     total_amount: 1300,
    //     total_delivery_fee: 10.00,
    //     total_discount: 0.00,
    //     payable_amount: 1300,
    //     loyalty_amount_saved: 2.65,

    //   }

    const detail = data


    BluetoothManager.checkBluetoothEnabled().then(async (enabled) => {
      console.log('check start printing >>>> 4')
      const isConnected = await BluetoothManager.getConnectedDeviceAddress()
      console.log('check start printing >>>> 5', isConnected, '>>>>>>>', enabled)
      if (enabled && isConnected) {
        console.log('check start printing >>>> 6')
        try {
          await BluetoothEscposPrinter.printerInit();
          // await BluetoothEscposPrinter.printerLeftSpace(0);

          const base64Data = await getBase64Image(`${detail.vendors[0].vendor.logo.image_fit}200/200${detail.vendors[0].vendor.logo.image_path}`)
          console.log('checking return data >>>>', base64Data)

          await BluetoothEscposPrinter.printPic(base64Data.base64String, { width: 200, left: 180 });

          await fs.unlink(base64Data.url);
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
          await BluetoothEscposPrinter.printText(`${detail.vendors[0].vendor.name}\r\n\r\n\r\n`, {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 1.5,
            heigthtimes: 1.5,
            fonttype: 1
          });

          await BluetoothEscposPrinter.printText("Order details\r\n\r\n", {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: 1
          });

          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

          await BluetoothEscposPrinter.printText(`Order Number: ${detail.order_number}\r\nDelivery Address:\r\n${detail.address.address}\r\n----------------------------------------------\r\n`, {});

          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
          /** Create Column **/
          let columnWidths = [11, 12, 12, 11];
          await BluetoothEscposPrinter.printColumn(columnWidths,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Item", 'Quantity', 'Unit price', 'Amount'], {});

          /** Add Items **/
          await detail.vendors[0].products.forEach(async (el) => {
              const title = el.pvariant.title && el.pvariant.title !== null ? `${el.product_name}(${el.pvariant.title})` : `${el.product_name}`
            // const title = `${el.product_name}`
            BluetoothEscposPrinter.printColumn(columnWidths,
              [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
              [title, JSON.stringify(el.quantity), JSON.stringify(el.price), JSON.stringify(el.quantity*el.price)], {});

            /** Add ons If available **/
            if (el.addon.length > 0) {
              let arr = el.addon.map(el => el.option.title)
              arr = '(' + arr.join(',') + ')'
              BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                [arr, '', '', ''], {});
            }

          });

          await BluetoothEscposPrinter.printText("\r\n----------------------------------------------\r\n", {});

          await BluetoothEscposPrinter.printColumn(columnWidths,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Total", JSON.stringify(detail.item_count), " ", JSON.stringify(detail.total_amount) + '\r\n'], {});

          await BluetoothEscposPrinter.printColumn([15, 30],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Delivery Fee", detail.total_delivery_fee + '\r\n'], {});

          await BluetoothEscposPrinter.printColumn([15, 30],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Discount", -detail.total_discount + '\r\n'], {});

          await BluetoothEscposPrinter.printColumn([15, 30],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Loyalty", -detail.loyalty_amount_saved + '\r\n'], {});

          await BluetoothEscposPrinter.printColumn([15, 30],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Paid amount", detail.payable_amount + '\r\n'], {});

          await BluetoothEscposPrinter.printText("----------------------------------------------\r\n\n                Welcome next time\r\n\r\n\r\n\r\n\n", {});

          await BluetoothEscposPrinter.cutOnePoint();

          console.log('check notifications length >>>> 9')
          setTimeout(() => {
            resolve(true)
          }, 1000);

        } catch (e) {
          alert(e.message || "ERROR");
          console.log('check notifications length >>>> 12', e)
        }
      }

    }, (err) => {
      console.log(err)
      console.log('check notifications length >>>> 11', err)
    });
  }).catch(err => console.log('check error in primise>>', err))

}
