// offer Section
import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { OrderInputs, UserPayload } from "../dto";
import {
  CreateOrderItem,
  CreateOrderType,
  CreateReportItem,
  Customer,
  OrderNotification,
  Product,
  ProductPrice,
  User,
} from "../model";

// export const ApplyOffer = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const offerId = req.params.id;
//   const user = req.user;

//   if (user) {
//     let appliedOffer = await Offer.findById(offerId);
//     if (appliedOffer) {
//       if (appliedOffer.promoType == "USER") {
//       } else {
//         if (appliedOffer.isActive) {
//           return res.json({
//             message: "offer is Valid",
//             appliedOffer: appliedOffer,
//           });
//         }
//       }
//     }
//   }
// };

/* ---------  Assign Order for Delivery ------------*/
// const AssignDeliveryBoy = async (orderID: string, vandorID: string) => {
//   // find the vandor
//   const vandor = await Vandor.findById(vandorID);
//   if (!vandor) return;

//   let areaCode = vandor.pincode;
//   let vandorLat = vandor.lat;
//   let vandorLng = vandor.lng;

//   // find avaliable delivery Boy
//   const avaliableDelivery = await DeliveryUser.find({
//     pinCode: areaCode,
//     isAvalaible: true,
//     verified: true,
//   });

//   //cheak the nearst delivey boy and Assign
//   if (!avaliableDelivery) {
//     console.log(`Delivery person ${avaliableDelivery[0]}`);
//     return;
//   }

//   //update the delivery ID
//   const currentOrder = await Order.findById(orderID);
//   if (!currentOrder) return;

//   currentOrder.deliveryID = avaliableDelivery[0].id;
//   await currentOrder.save();
//   console.log(currentOrder);
//   // push notification using firebase
// };

//payment section

// export const CratePayment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.body;
//   const { amount, paymentMode, offerId } = req.body;

//   if (!user) return res.status(400).send("Access Denied!");

//   let payableAmount = Number(amount);

//   if (!offerId) payableAmount = Number(amount);
//   const valuableOffer = await Offer.findById(offerId);
//   if (valuableOffer) {
//     payableAmount = payableAmount - valuableOffer.offerAmount;
//   }

//   /*
//     perform payment gatewat | create api call

//     get success / failre response

//     crate record on transaction
//   */

//   const createTransaction = await Transaction.create({
//     customer: user.id,
//     vandorId: "",
//     orderId: "",
//     orderValue: payableAmount, // amount
//     offerUsed: offerId, // offerId if Used
//     status: "OPEN",
//     paymentMode: paymentMode,
//     paymentResponse: "Cash on Delivery",
//   });

//   //return transaction Id
//   return res.json(createTransaction);
// };

// const validateTransaction = async (trnxId: string) => {
//   const currentTransaction = await Transaction.findById(trnxId);

//   if (!currentTransaction) return { status: false, currentTransaction };

//   if (!(currentTransaction.status.toLocaleLowerCase() !== "faield"))
//     return { status: true, currentTransaction };
// };

//order Section

export const CreateOrder = async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  const { items, customer_id, remarks, user_categories_id } = <OrderInputs>(
    req.body
  );

  let profile = await User.findById({ id: user.id });
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });

  let orderID = `${Math.floor(Math.random() * 89999) + 1000}`;
  let productItems = [] as Array<any>;
  let cartItems = [] as Array<any>;
  let netAmount = 0.0;

  //calculate order amount
  const products = _.map(items, (item) => item.product_id);
  for (let id = 0; id < products.length; id++) {
    productItems.push(
      await (
        await Product.findById({ id: products[id] })
      ).rows[0]
    );
  }

  if (productItems) {
    productItems.map((product) => {
      items.map(async ({ product_id, quantity, promotion }) => {
        if (product?.id == product_id) {
          netAmount += product?.price * quantity;
          //promotion
          cartItems.push({
            product,
            quantity,
            promotion,
            customer_id,
            user_categories_id,
          });
        }
      });
    });
  }

  //create order with item description
  if (!cartItems) return false;
  // create order
  const currentOrder = new CreateOrderType({
    netPrice: netAmount,
    orderId: orderID,
    customer_id: customer_id,
    approved_by: profile.rows[0].id,
    status: 1,
    remarks: remarks,
    payment_via: "",
    modified_at: new Date(),
  } as any);

  const orderResult = await currentOrder.create();

  if (!orderResult) return false;

  const resultCartItems = _.map(
    cartItems,
    async ({ product, quantity, promotion }) => {
      const orderItem = new CreateOrderItem({
        order_id: orderResult.rows[0].id,
        product_id: product.id,
        promotion: promotion,
        quantity: quantity,
      });
      await orderItem.create();
    }
  );

  if (!resultCartItems) return false;

  // push notifications
  const notification = new OrderNotification({
    header: "New order has been created!",
    message: `The order is created and approved by ${orderResult.rows[0].approved_by}`,
    type: 1,
    receiver_id: 2,
    status: 1,
    link_url: `api/users/orders/?id=${orderResult.rows[0].id}`,
  } as OrderNotification);
  await notification.create();

  // profile.cart = [] as Array<any>;
  // profile.orders.push(currentOrder);

  // if (!currentTransaction) return;
  // currentTransaction.orderId = orderID;
  // currentTransaction.vandorId = vendorId;
  // currentTransaction.status = "CONFIRMED";

  // await currentTransaction.save();

  // await AssignDeliveryBoy(currentOrder.id, vendorId);
  // finally update orders to user account
  return res.status(200).json({ orderResult: orderResult.rows[0] });
};

export const approveOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let profile = await User.findById({ id: user.id });
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });

  const { orderId, status } = req.body;

  if (status == 2) {
    const result = await CreateOrderType.save({ id: orderId, status });
    if (!result.rows[0]) return false;

    // push notifications to sales oficer
    const notification = new OrderNotification({
      header: "The order status changed!",
      message: `The order is creaed and approved by`,
      type: 1,
      receiver_id: 2,
      status: 1,
      link_url: `api/users/orders/?id=${result.rows[0].id}`,
    } as OrderNotification);
    await notification.create();
  } else if (status == 3) {
    const result = await CreateOrderType.save({ id: orderId, status });
    if (!result.rows[0]) return false;

    const orderItems = await CreateOrderItem.findByOrderId({
      id: orderId,
    });

    // generate report
    _.map(
      orderItems.rows,
      async ({ customer_id, product_id, quantity, promotion }) => {
        const reportItem = new CreateReportItem({
          customer_id,
          user_categories_id: await (
            await Customer.findUsersCategory({
              customerId: Number(customer_id),
            })
          ).rows[0].category_id,
          product_id,
          promotion,
          quantity,
        } as CreateReportItem);
        await reportItem.create();
      }
    );

    // push notification after generating a report to admin/super admin
    const notification = new OrderNotification({
      header: "The status of your order has been updated!",
      message: `The order has been updated in the sales report.`,
      type: 1,
      receiver_id: 2,
      status: 1,
      link_url: `api/users/orders/?=${result.rows[0].id}`,
    } as OrderNotification);
    await notification.create();
  }
};

// export const GetOrders = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let user = req.user;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let profile = await User.findById(user.id).populate("orders");
//   if (!profile) return;

//   res.json(profile);
// };

// export const GetOrderByID = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// export const AddCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let user = req.user;
//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   let profile = await User.findById(user.id).populate("cart.grocery");
//   if (!profile) return;

//   let { product_id, quantity } = <CartItem>req.body;

//   let product = await Product.findById(product_id);
//   if (!product) return;

//   let cartItems = profile.cart;

//   /*
//    *finding if there is cart item in the profile
//    *if is length above zero ...find it index of product
//    *if is quantity > 0 update the product ans its quantity with the incoming else reove the product
//    *esle add as the new product
//    */

//   if (cartItems.length > 0) {
//     const existCartItem = cartItems.filter(
//       (item: any) => item.product._id.toString() === product_id
//     );
//     if (existCartItem.length > 0) {
//       let index = cartItems.indexOf(existCartItem[0]);

//       if (quantity > 0) {
//         cartItems[index] = { product, quantity };
//       } else {
//         cartItems.splice(index, 1);
//       }
//       // return res.json(index)
//     } else {
//       // add new item
//       cartItems.push({ product, quantity });
//     }
//   } else {
//     // add new item
//     cartItems.push({ product, quantity });
//   }
//   if (!cartItems) return res.status(400).json("Invalid Input");

//   profile.cart = cartItems;
//   await profile.save();
//   return res.json(profile);
// };

// export const DeleteCart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = <UserPayload>req.user;

//   if (!user)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   const profile = await User.findById(user.id).populate("cart.grocery");
//   if (!profile) return;

//   profile.cart = [] as any;
//   await profile.save();
//   res.json(profile);
// };

/*
 * Helper functions
 */
const price = async (id: any) => {
  const product_price = await ProductPrice.findById({ id });
  const price = product_price.rows[0]?.price;
  if (!price) return false;
  return price;
};
