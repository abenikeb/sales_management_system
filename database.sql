INSERT INTO users_group (name,_desc) VALUES('ADMIN','he/she access the whole previlage');
INSERT INTO users_group (name,_desc) VALUES('STORE_MANAGER','he/she access the store/inventory function');
INSERT INTO users_group (name,_desc) VALUES('SALE_MANAGER','he/she access the sales dept');

CREATE TABLE "users_group" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar,
  "_desc" varchar
);

CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "user_name" varchar,
  "verified" boolean,
  "email" varchar,
  "tel" varchar NOT NULL,
  "password" text,
  "forgot_password" text,
  "salt" text,
  "otp" varchar,
  "otp_expiry" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now()),
  "user_group" int
);



CREATE TABLE "payment_type" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar,
  "_desc" varchar
);

INSERT INTO payment_type (name,_desc) VALUES('CASH','');
INSERT INTO payment_type (name,_desc) VALUES('CREDIT','');

CREATE TABLE "user_categories" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "_desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

INSERT INTO user_categories(name, _desc) VALUES('AA Agent', 'has addis ababa agents');

CREATE TABLE "customers" (
  "id" BIGSERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "category_id" int NOT NULL,
  "email" varchar,
  "tel" varchar NOT NULL,
  "business_licenses_no" varchar,
  "plate_no" varchar,
  "type_id" int,
  "territory" varchar,
  "city" varchar,
  "lat" numeric(8, 6),
  "lng" numeric(8, 6),
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

ALTER TABLE customers
  ADD approved_by int;

CREATE TABLE "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_sku" int NOT NULL,
  "_desc" text,
  "product_images" text[],
  "created_by" int,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

ALTER TABLE products 
    ALTER COLUMN product_sku TYPE numeric(3,1);

CREATE TABLE "product_inventories" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_id" int,
  "quantity" int,
  "out_of_stock" int,
  "in_stock" int,
  "running_low" varchar,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

CREATE TABLE "product_prices" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_id" int,
  "user_categories_id" int,
  "price" numeric(10, 2) NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

CREATE TABLE "product_promotion" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_id" int,
  "user_categories_id" int,
  "amount_price" numeric(10, 2) NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

DELETE FROM product_promotion
  WHERE id = 3
  RETURNING *;

ALTER TABLE product_promotion ADD CONSTRAINT uniqu_product_id UNIQUE(product_id);

CREATE TABLE "order_status" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "_desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

INSERT INTO order_status (name,_desc) VALUES('Pending','the status has pending waiting for confirmed');

CREATE TABLE "orders" (
  "id" BIGSERIAL PRIMARY KEY,
  "net_price" numeric(10, 2) NOT NULL,
  "add_tax" numeric(10, 2),
  "excise_tax" numeric(10, 2),
  "gross_price" numeric(10, 2),
  "remarks" text,
  "customer_id" int NOT NULL,
  "status" int,
  "approved_by" varchar,
  "payment_via" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

ALTER TABLE orders
  ADD orderId int;

CREATE TABLE "order_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "is_promotion" boolean,
  "quantity" int DEFAULT 1
);

CREATE TABLE "report" (
  "id" BIGSERIAL PRIMARY KEY,
  "customer_id" int,
  "product_id" int,
  "user_categories_id" int, 
  "quantity" int,
  "amount" numeric(10,2),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "notifications" (
  "id" BIGSERIAL PRIMARY KEY,
  "message" varchar NOT NULL,
  "isRead" boolean,
  "type" varchar NOT NULL,
  "receiver_id" int NOT NULL,
  "status" int,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

CREATE TABLE "chat" (
  "id" BIGSERIAL PRIMARY KEY,
  "from" int NOT NULL,
  "to" int NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "modified_at" timestamp DEFAULT (now())
);

CREATE INDEX ON "customers" ("category_id");

CREATE INDEX "sku_id" ON "products" ("product_sku");

CREATE UNIQUE INDEX ON "products" ("product_sku");

CREATE INDEX ON "orders" ("id", "customer_id");

CREATE INDEX ON "notifications" ("receiver_id");

CREATE INDEX ON "chat" ("from", "to");

COMMENT ON COLUMN "product_inventories"."running_low" IS 'less than 10';

COMMENT ON COLUMN "notifications"."status" IS '1 or 2';

ALTER TABLE "customers" ADD FOREIGN KEY ("type_id") REFERENCES "payment_type" ("id");

ALTER TABLE "customers" ADD FOREIGN KEY ("category_id") REFERENCES "user_categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "product_inventories" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_prices" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_prices" ADD FOREIGN KEY ("user_categories_id") REFERENCES "user_categories" ("id");

ALTER TABLE "product_promotion" ADD FOREIGN KEY ("user_categories_id") REFERENCES "user_categories" ("id");

ALTER TABLE "report" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "report" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "report" ADD FOREIGN KEY ("user_categories_id") REFERENCES "user_categories" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("user_group") REFERENCES "users_group" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("status") REFERENCES "order_status" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("from") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("to") REFERENCES "users" ("id");
