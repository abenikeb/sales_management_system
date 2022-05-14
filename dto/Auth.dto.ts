import { VendorPayLoad } from "./Vendor.dto";
import { UserPayload } from "./User.dto";

export type AuthPayLoad = UserPayload | VendorPayLoad;
