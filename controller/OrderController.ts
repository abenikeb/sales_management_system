// offer Section
import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { OrderInputs, OrderType, UserPayload } from "../dto";
import {
  CreateOrderItem,
  CreateOrderType,
  CreateReportItem,
  Customer,
  OrderNotification,
  Product,
  ProductPrice,
  User,
  UserCategory,
} from "../model";

export const INDEX_1 = 1;
export const INDEX_2 = 2;
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

/*
 * CREATE ORDER SECTION
 */

export const CreateOrder = async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  if (!user)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  let profile = await User.findById({ id: user.id });
  if (!profile) return res.status(400).json({ message: "Invalid profile!" });

  const { items, customer_id, remarks } = <OrderInputs>req.body;

  const customer = await Customer.findById({ id: customer_id });
  if (!customer.rows[0])
    return res.status(400).json({ message: "Invalid Customer." });

  const result = await Customer.findUsersCategory({
    customerId: customer_id,
  });
  const user_categories_id = result.rows[0].category_id;

  //Random number generate as orderID assign for order
  let orderID = `${Math.floor(Math.random() * 89999) + 1000}`;
  let productItems = [] as Array<any>;
  let netAmount = 0.0;
  let productCollection = [] as Array<any>;
  let totalPromotion = 0.0;

  /*
   * find the product info from incoming items collection array
   * this is because orders amount calculated with / on the backend
   */

  const products = _.map(items, (item) => item.product_id);

  console.log("products", products);
  for (let id in products) {
    const result = await Product.findWithPriceAndPromotionById({
      id: products[id],
      user_categories_id: user_categories_id,
    });
    console.log("result", result.rows);
    productItems.push(result.rows[0]);
  }

  console.log("productItems", productItems);

  if (!productItems) return null;

  productItems.map((product) => {
    return items.map(({ product_id, qty, qty_promotion }) => {
      if (product && product.id == product_id) {
        netAmount += product.price * qty;
        totalPromotion += product.amount_price * qty_promotion;

        productCollection.push({
          product,
          qty,
          qty_promotion,
          customer_id,
          user_categories_id,
        });
      }
    });
  });

  console.log("netAmount", netAmount);

  // create order
  const order = new CreateOrderType({
    netPrice: netAmount,
    totalPromotion,
    orderId: orderID,
    customer_id: customer_id,
    approved_by: profile.rows[0].user_name,
    status: 1, // status assigned 1 always when created
    remarks: remarks,
    payment_via: "",
  } as OrderType);

  const orderResult = await order.create();

  if (!orderResult)
    res.status(400).json({ message: "The Order was unable to be created." });

  const resultOrderItemCollection = _.map(
    productCollection,
    async ({ product, qty, qty_promotion }) => {
      const orderItem = new CreateOrderItem({
        order_id: orderResult.rows[0].id,
        product_id: product.id,
        qty_promotion,
        qty,
      });
      await orderItem.create();
    }
  );

  if (!resultOrderItemCollection)
    res
      .status(400)
      .json({ error: "The Order items was unable to be created." });

  // push notifications to [admin, fince & other parties] after crateing an order.

  const users = await User.findIndex({ _index1: INDEX_1, _index2: INDEX_2 });
  const notification = new OrderNotification({
    header: "A new order has been created.!",
    message: `Customer ${customer.rows[0].first_name} ${customer.rows[0].last_name} receives a sales order, which is approved by sales officer ${profile.rows[0].user_name}. Please review and authorize the order.`,
    type: 1,
    receiver_id: users.rows.map((user: any) => {
      return user.id;
    }),
    status: 1,
    link_url: `api/users/orders/?id=${orderResult.rows[0].id}`,
  } as OrderNotification);

  await notification.create();

  return res.status(200).json({ orderResult: orderResult.rows[0] });
};

/*
 * APPROVE ORDER SECTION
 */

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
      receiver_id: [2],
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
      receiver_id: [2],
      status: 1,
      link_url: `api/users/orders/?=${result.rows[0].id}`,
    } as OrderNotification);
    await notification.create();
  }
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orders = await CreateOrderType.findByCustomerAndStatus();
  if (!orders.rows) return res.json({ message: "No Orders Found!" });

  return res.json(orders.rows);
};

/*
 * Helper functions
 */
const price = async (id: any) => {
  const product = await ProductPrice.findById({ id });
  const price = product.rows[0]?.price;
  !price ? false : price;
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

//   let productCollection = profile.cart;

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
