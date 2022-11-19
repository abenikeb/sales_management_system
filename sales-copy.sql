--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-09-26 14:21:07
begin;
set transaction read write;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- CREATE SCHEMA public;


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

-- COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 25521)
-- Name: chat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE chat (
    id bigint NOT NULL,
    "from" integer NOT NULL,
    "to" integer NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 231 (class 1259 OID 25520)
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 231
-- Name: chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE chat_id_seq OWNED BY chat.id;


--
-- TOC entry 234 (class 1259 OID 25592)
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE customers (
    id bigint NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    category_id integer NOT NULL,
    email character varying,
    tel character varying NOT NULL,
    business_licenses_no character varying,
    plate_no character varying,
    type_id integer,
    territory character varying,
    city character varying,
    lat numeric(8,6),
    lng numeric(8,6),
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    approved_by integer
);


--
-- TOC entry 233 (class 1259 OID 25591)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 233
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- TOC entry 230 (class 1259 OID 25510)
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE notifications (
    id bigint NOT NULL,
    message character varying NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    type character varying NOT NULL,
    receiver_id integer,
    status integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    header character varying,
    link_url character varying,
    _receiver_id integer[]
);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN notifications.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN notifications.status IS '1 or 2';


--
-- TOC entry 229 (class 1259 OID 25509)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE notifications_id_seq OWNED BY notifications.id;


--
-- TOC entry 226 (class 1259 OID 25494)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE order_items (
    id bigint NOT NULL,
    order_id integer,
    product_id integer,
    promotion__ boolean,
    quantity integer DEFAULT 1,
    promotion numeric DEFAULT 0
);


--
-- TOC entry 225 (class 1259 OID 25493)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE order_items_id_seq OWNED BY order_items.id;


--
-- TOC entry 222 (class 1259 OID 25476)
-- Name: order_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE order_status (
    id bigint NOT NULL,
    name character varying NOT NULL,
    _desc text,
    created_at timestamp without time zone,
    modified_at timestamp without time zone
);


--
-- TOC entry 221 (class 1259 OID 25475)
-- Name: order_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE order_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 221
-- Name: order_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE order_status_id_seq OWNED BY order_status.id;


--
-- TOC entry 224 (class 1259 OID 25485)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE orders (
    id bigint NOT NULL,
    net_price numeric(10,2) NOT NULL,
    add_tax numeric(10,2),
    excise_tax numeric(10,2),
    gross_price numeric(10,2),
    remarks text,
    customer_id integer NOT NULL,
    status integer,
    approved_by character varying,
    payment_via character varying,
    created_at timestamp without time zone,
    modified_at timestamp without time zone,
    orderid integer DEFAULT 1 NOT NULL,
    total_promotion numeric(15,2)
);


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN orders.orderid; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN orders.orderid IS 'order id given';


--
-- TOC entry 223 (class 1259 OID 25484)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE orders_id_seq OWNED BY orders.id;


--
-- TOC entry 214 (class 1259 OID 25440)
-- Name: payment_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE payment_type (
    id bigint NOT NULL,
    name character varying,
    _desc character varying
);


--
-- TOC entry 213 (class 1259 OID 25439)
-- Name: payment_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE payment_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 213
-- Name: payment_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE payment_type_id_seq OWNED BY payment_type.id;


--
-- TOC entry 236 (class 1259 OID 25603)
-- Name: product_inventories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE product_inventories (
    id bigint NOT NULL,
    product_id integer,
    quantity integer,
    out_of_stock integer,
    in_stock integer,
    running_low character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN product_inventories.running_low; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product_inventories.running_low IS 'less than 10';


--
-- TOC entry 235 (class 1259 OID 25602)
-- Name: product_inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_inventories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 235
-- Name: product_inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_inventories_id_seq OWNED BY product_inventories.id;


--
-- TOC entry 238 (class 1259 OID 25614)
-- Name: product_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE product_prices (
    id bigint NOT NULL,
    product_id integer,
    user_categories_id integer,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 237 (class 1259 OID 25613)
-- Name: product_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_prices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_prices_id_seq OWNED BY product_prices.id;


--
-- TOC entry 220 (class 1259 OID 25469)
-- Name: product_promotion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE product_promotion (
    id bigint NOT NULL,
    product_id integer,
    user_categories_id integer,
    amount_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone,
    modified_at timestamp without time zone
);


--
-- TOC entry 219 (class 1259 OID 25468)
-- Name: product_promotion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_promotion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 219
-- Name: product_promotion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_promotion_id_seq OWNED BY product_promotion.id;


--
-- TOC entry 218 (class 1259 OID 25458)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE products (
    id bigint NOT NULL,
    product_sku numeric(3,1) NOT NULL,
    _desc text,
    product_images text[],
    created_by integer,
    created_at date DEFAULT now(),
    modified_at date DEFAULT now()
);


--
-- TOC entry 217 (class 1259 OID 25457)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE products_id_seq OWNED BY products.id;


--
-- TOC entry 228 (class 1259 OID 25502)
-- Name: report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE report (
    id bigint NOT NULL,
    customer_id integer,
    product_id integer,
    user_categories_id integer,
    quantity integer,
    amount numeric(10,2),
    created_at timestamp without time zone DEFAULT now(),
    promotion numeric DEFAULT 0
);


--
-- TOC entry 227 (class 1259 OID 25501)
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 227
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE report_id_seq OWNED BY report.id;


--
-- TOC entry 216 (class 1259 OID 25449)
-- Name: user_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_categories (
    id bigint NOT NULL,
    name character varying NOT NULL,
    _desc text,
    created_at timestamp without time zone,
    modified_at timestamp without time zone
);


--
-- TOC entry 215 (class 1259 OID 25448)
-- Name: user_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 215
-- Name: user_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_categories_id_seq OWNED BY user_categories.id;


--
-- TOC entry 212 (class 1259 OID 25429)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id bigint NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    user_name character varying,
    verified boolean,
    email character varying,
    tel character varying NOT NULL,
    password text,
    forgot_password text,
    salt text,
    otp character varying,
    otp_expiry timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    user_group integer
);


--
-- TOC entry 210 (class 1259 OID 25420)
-- Name: users_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users_group (
    id bigint NOT NULL,
    name character varying,
    _desc character varying
);


--
-- TOC entry 209 (class 1259 OID 25419)
-- Name: users_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_group_id_seq OWNED BY users_group.id;


--
-- TOC entry 211 (class 1259 OID 25428)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 3257 (class 2604 OID 25524)
-- Name: chat id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat ALTER COLUMN id SET DEFAULT nextval('chat_id_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 25595)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- TOC entry 3253 (class 2604 OID 25513)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 25497)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_items ALTER COLUMN id SET DEFAULT nextval('order_items_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 25479)
-- Name: order_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_status ALTER COLUMN id SET DEFAULT nextval('order_status_id_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 25488)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq'::regclass);


--
-- TOC entry 3238 (class 2604 OID 25443)
-- Name: payment_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY payment_type ALTER COLUMN id SET DEFAULT nextval('payment_type_id_seq'::regclass);


--
-- TOC entry 3263 (class 2604 OID 25606)
-- Name: product_inventories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_inventories ALTER COLUMN id SET DEFAULT nextval('product_inventories_id_seq'::regclass);


--
-- TOC entry 3266 (class 2604 OID 25617)
-- Name: product_prices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_prices ALTER COLUMN id SET DEFAULT nextval('product_prices_id_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 25472)
-- Name: product_promotion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_promotion ALTER COLUMN id SET DEFAULT nextval('product_promotion_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 25461)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 25505)
-- Name: report id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY report ALTER COLUMN id SET DEFAULT nextval('report_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 25452)
-- Name: user_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_categories ALTER COLUMN id SET DEFAULT nextval('user_categories_id_seq'::regclass);


--
-- TOC entry 3235 (class 2604 OID 25432)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 25423)
-- Name: users_group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users_group ALTER COLUMN id SET DEFAULT nextval('users_group_id_seq'::regclass);


--
-- TOC entry 3498 (class 0 OID 25521)
-- Dependencies: 232
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: -
--

COPY chat (id, "from", "to", message, created_at, modified_at) FROM stdin;
\.


--
-- TOC entry 3500 (class 0 OID 25592)
-- Dependencies: 234
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY customers (id, first_name, last_name, category_id, email, tel, business_licenses_no, plate_no, type_id, territory, city, lat, lng, created_at, modified_at, approved_by) FROM stdin;
6	Benezer	Haile	2	abenifek@example.com	0917947865	1234567	AA2345	2	Kore Ayer Tena	Addis Ababa	0.000000	0.000000	2022-05-26 01:11:44.837	2022-05-26 01:11:44.837	2
8	Benjamni	Kebede	2	abenikeb79@gmail.com	0913228892	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-08 12:14:55.168	2022-09-08 12:14:55.168	2
9	Biruk	Kebede	2	abenikeb79@gmail.com	091322889	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-08 12:38:07.584	2022-09-08 12:38:07.583	2
10	Misganw	Kebede	4	abenikeb79@gmail.com	0916277377	Zeraf Technologies	1223456	1	Gerji	Addis Ababa	0.000000	0.000000	2022-09-08 12:39:02.16	2022-09-08 12:39:02.16	2
11	Selam	Kebede	2	abenikeb79@gmail.com	0913234434	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-08 21:09:01.346	2022-09-08 21:09:01.346	2
4	Ebeizer@	Kemisso	2	abenezerk@zeraftech.com	0913947865	1234567	AA2345	2	Kore Ayer Tena	Addis Ababa	0.000000	0.000000	2022-05-25 08:38:29.41	2022-05-25 08:38:29.41	2
14	Abena	Kebede	2	abenikeb79@gmail.com	0913164545	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-12 16:02:54.324	2022-09-12 16:02:54.323	2
15	Kebede	Kemisso	4	abenikeb79@gmail.com	0911539258	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-12 16:10:54.589	2022-09-12 16:10:54.589	2
16	Abenezer	Kebede	2	abenikeb79@gmail.com	0916477477	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-12 16:17:45.633	2022-09-12 16:17:45.633	2
17	Abenezer	Kebede	2	abenikeb79@gmail.com	091322878	Zeraf Technologies	1234567	1	Gerji	Addis Ababa	0.000000	0.000000	2022-09-12 23:43:23.181	2022-09-12 23:43:23.18	2
19	Abenezerkkkkkk	Kebede	2	abenikeb79@gmail.com	kk	Zeraf Technologies	1234567	1	Gerji	Addis Ababa	0.000000	0.000000	2022-09-13 00:03:40.94	2022-09-13 00:03:40.94	2
13	Mihretu peter	Petros	1	abenikeb79@gmail.com	0910497908	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-10 12:30:53.79	2022-09-10 12:30:53.79	2
18	Abenezer kebede kemisso	Kebede	3	abenikeb79@gmail.com	56232565623	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-12 23:47:37.133	2022-09-12 23:47:37.133	2
12	Belaynesh De	Adan	3	abenikeb79@gmail.com	0934477477	Zeraf Technologies	1234567	2	Gerji	Addis Ababa	0.000000	0.000000	2022-09-10 11:26:02.149	2022-09-10 11:26:02.148	2
\.


--
-- TOC entry 3496 (class 0 OID 25510)
-- Dependencies: 230
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY notifications (id, message, "isRead", type, receiver_id, status, created_at, modified_at, header, link_url, _receiver_id) FROM stdin;
9	Customer Ebenizer Kebede receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-05-28 13:08:38.485	2022-05-28 13:08:38.485	A new order has been created.!	api/users/orders/?id=72	{2,3}
10	Customer Ebenizer Kebede receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-05-28 14:04:20.543	2022-05-28 14:04:20.543	A new order has been created.!	api/users/orders/?id=76	{2,3}
11	Customer Ebeizer@ Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-21 11:42:41.832	2022-09-21 11:42:41.833	A new order has been created.!	api/users/orders/?id=77	{2,3}
12	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:00:10.452	2022-09-23 19:00:10.452	A new order has been created.!	api/users/orders/?id=78	{2,3}
13	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:02:14.85	2022-09-23 19:02:14.85	A new order has been created.!	api/users/orders/?id=79	{2,3}
14	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:06:41.113	2022-09-23 19:06:41.113	A new order has been created.!	api/users/orders/?id=80	{2,3}
15	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:07:53.565	2022-09-23 19:07:53.565	A new order has been created.!	api/users/orders/?id=81	{2,3}
16	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:08:46.757	2022-09-23 19:08:46.757	A new order has been created.!	api/users/orders/?id=82	{2,3}
17	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:10:51.914	2022-09-23 19:10:51.914	A new order has been created.!	api/users/orders/?id=83	{2,3}
18	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:11:17.299	2022-09-23 19:11:17.299	A new order has been created.!	api/users/orders/?id=84	{2,3}
19	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:11:41.909	2022-09-23 19:11:41.909	A new order has been created.!	api/users/orders/?id=85	{2,3}
20	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:12:32.722	2022-09-23 19:12:32.722	A new order has been created.!	api/users/orders/?id=86	{2,3}
21	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:14:14.515	2022-09-23 19:14:14.515	A new order has been created.!	api/users/orders/?id=87	{2,3}
22	Customer Kebede Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:14:58.745	2022-09-23 19:14:58.745	A new order has been created.!	api/users/orders/?id=88	{2,3}
23	Customer Ebeizer@ Kemisso receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:19:43.842	2022-09-23 19:19:43.842	A new order has been created.!	api/users/orders/?id=89	{2,3}
24	Customer Benjamni Kebede receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:21:44.948	2022-09-23 19:21:44.948	A new order has been created.!	api/users/orders/?id=90	{2,3}
25	Customer Benjamni Kebede receives a sales order, which is approved by sales officer abeni. Please review and authorize the order.	f	1	\N	1	2022-09-23 19:23:22.936	2022-09-23 19:23:22.936	A new order has been created.!	api/users/orders/?id=91	{2,3}
\.


--
-- TOC entry 3492 (class 0 OID 25494)
-- Dependencies: 226
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY order_items (id, order_id, product_id, promotion__, quantity, promotion) FROM stdin;
134	77	2	\N	2	0
135	77	1	\N	9	99
136	77	3	\N	5	10
137	89	2	\N	2	0
138	89	1	\N	5	99
139	89	3	\N	3	10
140	90	2	\N	1	0
141	90	3	\N	0	0
142	90	1	\N	2	0
143	91	3	\N	1	0
\.


--
-- TOC entry 3488 (class 0 OID 25476)
-- Dependencies: 222
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: -
--

COPY order_status (id, name, _desc, created_at, modified_at) FROM stdin;
1	Pending	the status has pending waiting for confirmed	\N	\N
2	checked	\N	\N	\N
3	approved	\N	\N	\N
4	canelled	\N	\N	\N
\.


--
-- TOC entry 3490 (class 0 OID 25485)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3480 (class 0 OID 25440)
-- Dependencies: 214
-- Data for Name: payment_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY payment_type (id, name, _desc) FROM stdin;
1	CASH	
2	CREDIT	
\.


--
-- TOC entry 3502 (class 0 OID 25603)
-- Dependencies: 236
-- Data for Name: product_inventories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY product_inventories (id, product_id, quantity, out_of_stock, in_stock, running_low, created_at, modified_at) FROM stdin;
\.


--
-- TOC entry 3504 (class 0 OID 25614)
-- Dependencies: 238
-- Data for Name: product_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY product_prices (id, product_id, user_categories_id, price, created_at, modified_at) FROM stdin;
2	2	1	99.90	2022-05-18 00:14:46.537393	2022-05-18 00:14:46.537393
7	3	4	199.96	2022-05-27 17:29:31.865	2022-05-27 17:29:31.865
1	3	2	50.00	2022-05-16 15:00:34.868	2022-05-16 15:00:34.868
3	1	2	199.99	2022-05-18 00:15:15.298653	2022-05-18 00:15:15.298653
6	2	2	978.00	2022-05-27 17:28:41.081	2022-05-27 17:28:41.081
\.


--
-- TOC entry 3486 (class 0 OID 25469)
-- Dependencies: 220
-- Data for Name: product_promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY product_promotion (id, product_id, user_categories_id, amount_price, created_at, modified_at) FROM stdin;
10	4	4	199.90	2022-05-27 17:46:04.762	2022-05-27 17:46:04.762
14	2	3	20.90	2022-05-28 11:39:09.415	2022-05-28 11:39:09.415
11	2	2	19.90	2022-05-28 09:37:37.803	2022-05-28 09:37:37.803
13	1	2	919.90	2022-05-28 09:39:11.863	2022-05-28 09:39:11.863
2	3	2	1150.00	2022-05-16 15:08:52.198	2022-05-16 15:08:52.198
\.


--
-- TOC entry 3484 (class 0 OID 25458)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY products (id, product_sku, _desc, product_images, created_by, created_at, modified_at) FROM stdin;
2	2.0	2 litter bottle	\N	2	2022-05-17	2022-05-17
4	5.0	5 litter bottel	\N	\N	2022-05-25	2022-05-25
5	7.0	7 litter bottel	\N	\N	2022-05-25	2022-05-25
3	1.0	1 litter pack	{}	2	2022-05-16	2022-05-16
8	0.3	Sample SKU value desc about the litter water	{photo_2022-04-27_23-16-00.jpg,photo_2022-05-12_19-01-46.jpg}	2	2022-05-27	2022-05-27
1	3.0	This is sample product_sku	{}	2	2022-05-16	2022-05-27
\.


--
-- TOC entry 3494 (class 0 OID 25502)
-- Dependencies: 228
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY report (id, customer_id, product_id, user_categories_id, quantity, amount, created_at, promotion) FROM stdin;
\.


--
-- TOC entry 3482 (class 0 OID 25449)
-- Dependencies: 216
-- Data for Name: user_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY user_categories (id, name, _desc, created_at, modified_at) FROM stdin;
2	UPC	up country sells 	\N	\N
3	AA Agent	Addis Ababa Agent	\N	\N
4	K.A	Key Account	\N	\N
6	Abenezer	I am here about two wekends	2022-09-20 11:45:30.431	2022-09-20 11:45:30.431
7	Abenezer Kebede	I am here about two wekends	2022-09-20 11:49:11.219	2022-09-20 11:49:11.219
1	AA Agentss	has addis ababa agents	\N	2022-09-20 12:17:49.267
8	UPC 1245	UPC 1234	2022-09-20 12:18:38.073	2022-09-20 12:18:53.217
\.


--
-- TOC entry 3478 (class 0 OID 25429)
-- Dependencies: 212
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY users (id, first_name, last_name, user_name, verified, email, tel, password, forgot_password, salt, otp, otp_expiry, created_at, modified_at, user_group) FROM stdin;
2	Ebenizer	Kebede	abeni	f	abenezerk@zeraftech.com	0913228892	$2b$10$TWv3HpnJkOVAKZm.BObgnulLG0sXaI.LKvxwc4oG0s5PZsSD4RuHi	\N	$2b$10$TWv3HpnJkOVAKZm.BObgnu	749942	2022-05-15 19:17:04.233	2022-05-15 18:47:04.233	2022-05-15 18:47:04.233	1
3			abeni	f		0916477477	$2b$10$Snozvn8fX7x89RDngG58ved5nbj3CXvNfowSdwmfdZpIxs7.qJnAa	\N	$2b$10$Snozvn8fX7x89RDngG58ve	744919	2022-05-28 14:02:59.933	2022-05-28 13:32:59.933	2022-05-28 13:32:59.933	2
\.


--
-- TOC entry 3476 (class 0 OID 25420)
-- Dependencies: 210
-- Data for Name: users_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY users_group (id, name, _desc) FROM stdin;
1	ADMIN	he/she access the whole previlage
2	STORE_MANAGER	he/she access the store/inventory function
3	SALE_MANAGER	he/she access the sales dept
\.


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 231
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('chat_id_seq', 1, false);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 233
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('customers_id_seq', 19, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('notifications_id_seq', 25, true);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('order_items_id_seq', 143, true);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 221
-- Name: order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('order_status_id_seq', 1, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 223
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('orders_id_seq', 91, true);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 213
-- Name: payment_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('payment_type_id_seq', 2, true);


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 235
-- Name: product_inventories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_inventories_id_seq', 1, false);


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_prices_id_seq', 7, true);


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 219
-- Name: product_promotion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_promotion_id_seq', 14, true);


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('products_id_seq', 8, true);


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 227
-- Name: report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('report_id_seq', 24, true);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 215
-- Name: user_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_categories_id_seq', 8, true);


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_group_id_seq', 4, true);


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 211
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_id_seq', 3, true);


--
-- TOC entry 3302 (class 2606 OID 25530)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 25601)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 25519)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 25500)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3285 (class 2606 OID 25483)
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 25492)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 25447)
-- Name: payment_type payment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY payment_type
    ADD CONSTRAINT payment_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 25612)
-- Name: product_inventories product_inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_inventories
    ADD CONSTRAINT product_inventories_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 25621)
-- Name: product_prices product_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_prices
    ADD CONSTRAINT product_prices_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 25474)
-- Name: product_promotion product_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_promotion
    ADD CONSTRAINT product_promotion_pkey PRIMARY KEY (id);


--
-- TOC entry 3278 (class 2606 OID 25467)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 25508)
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- TOC entry 3276 (class 2606 OID 25456)
-- Name: user_categories user_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_categories
    ADD CONSTRAINT user_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 25427)
-- Name: users_group users_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users_group
    ADD CONSTRAINT users_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 25438)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3299 (class 1259 OID 25535)
-- Name: chat_from_to_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_from_to_idx ON chat USING btree ("from", "to");


--
-- TOC entry 3300 (class 1259 OID 25626)
-- Name: chat_from_to_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_from_to_idx1 ON chat USING btree ("from", "to");


--
-- TOC entry 3303 (class 1259 OID 25622)
-- Name: customers_category_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX customers_category_id_idx ON customers USING btree (category_id);


--
-- TOC entry 3297 (class 1259 OID 25778)
-- Name: notifications_receiver_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_receiver_id_idx ON notifications USING btree (receiver_id);


--
-- TOC entry 3298 (class 1259 OID 25779)
-- Name: notifications_receiver_id_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_receiver_id_idx1 ON notifications USING btree (receiver_id);


--
-- TOC entry 3286 (class 1259 OID 25533)
-- Name: orders_id_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_id_customer_id_idx ON orders USING btree (id, customer_id);


--
-- TOC entry 3287 (class 1259 OID 25624)
-- Name: orders_id_customer_id_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_id_customer_id_idx1 ON orders USING btree (id, customer_id);


--
-- TOC entry 3288 (class 1259 OID 25735)
-- Name: orders_orderid_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX orders_orderid_idx ON orders USING btree (orderid);


--
-- TOC entry 3279 (class 1259 OID 25719)
-- Name: products_product_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_product_sku_idx ON products USING btree (product_sku);


--
-- TOC entry 3280 (class 1259 OID 25720)
-- Name: products_product_sku_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_product_sku_idx1 ON products USING btree (product_sku);


--
-- TOC entry 3281 (class 1259 OID 25718)
-- Name: sku_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sku_id ON products USING btree (product_sku);


--
-- TOC entry 3327 (class 2606 OID 25581)
-- Name: chat chat_from_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_from_fkey FOREIGN KEY ("from") REFERENCES users(id);


--
-- TOC entry 3329 (class 2606 OID 25707)
-- Name: chat chat_from_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_from_fkey1 FOREIGN KEY ("from") REFERENCES users(id);


--
-- TOC entry 3328 (class 2606 OID 25586)
-- Name: chat chat_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_to_fkey FOREIGN KEY ("to") REFERENCES users(id);


--
-- TOC entry 3330 (class 2606 OID 25712)
-- Name: chat chat_to_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_to_fkey1 FOREIGN KEY ("to") REFERENCES users(id);


--
-- TOC entry 3332 (class 2606 OID 25632)
-- Name: customers customers_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_category_id_fkey FOREIGN KEY (category_id) REFERENCES user_categories(id);


--
-- TOC entry 3331 (class 2606 OID 25627)
-- Name: customers customers_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_type_id_fkey FOREIGN KEY (type_id) REFERENCES payment_type(id);


--
-- TOC entry 3321 (class 2606 OID 25757)
-- Name: order_items order_items_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3319 (class 2606 OID 25571)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3320 (class 2606 OID 25697)
-- Name: order_items order_items_product_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_product_id_fkey1 FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3317 (class 2606 OID 25682)
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);


--
-- TOC entry 3316 (class 2606 OID 25561)
-- Name: orders orders_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_status_fkey FOREIGN KEY (status) REFERENCES order_status(id);


--
-- TOC entry 3318 (class 2606 OID 25687)
-- Name: orders orders_status_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_status_fkey1 FOREIGN KEY (status) REFERENCES order_status(id);


--
-- TOC entry 3333 (class 2606 OID 25642)
-- Name: product_inventories product_inventories_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_inventories
    ADD CONSTRAINT product_inventories_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3334 (class 2606 OID 25647)
-- Name: product_prices product_prices_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_prices
    ADD CONSTRAINT product_prices_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3335 (class 2606 OID 25652)
-- Name: product_prices product_prices_user_categories_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_prices
    ADD CONSTRAINT product_prices_user_categories_id_fkey FOREIGN KEY (user_categories_id) REFERENCES user_categories(id);


--
-- TOC entry 3314 (class 2606 OID 25541)
-- Name: product_promotion product_promotion_user_categories_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_promotion
    ADD CONSTRAINT product_promotion_user_categories_id_fkey FOREIGN KEY (user_categories_id) REFERENCES user_categories(id);


--
-- TOC entry 3315 (class 2606 OID 25657)
-- Name: product_promotion product_promotion_user_categories_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_promotion
    ADD CONSTRAINT product_promotion_user_categories_id_fkey1 FOREIGN KEY (user_categories_id) REFERENCES user_categories(id);


--
-- TOC entry 3312 (class 2606 OID 25536)
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);


--
-- TOC entry 3313 (class 2606 OID 25637)
-- Name: products products_created_by_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_created_by_fkey1 FOREIGN KEY (created_by) REFERENCES users(id);


--
-- TOC entry 3324 (class 2606 OID 25662)
-- Name: report report_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);


--
-- TOC entry 3322 (class 2606 OID 25546)
-- Name: report report_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3325 (class 2606 OID 25667)
-- Name: report report_product_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_product_id_fkey1 FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 3323 (class 2606 OID 25551)
-- Name: report report_user_categories_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_user_categories_id_fkey FOREIGN KEY (user_categories_id) REFERENCES user_categories(id);


--
-- TOC entry 3326 (class 2606 OID 25672)
-- Name: report report_user_categories_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY report
    ADD CONSTRAINT report_user_categories_id_fkey1 FOREIGN KEY (user_categories_id) REFERENCES user_categories(id);


--
-- TOC entry 3310 (class 2606 OID 25556)
-- Name: users users_user_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_group_fkey FOREIGN KEY (user_group) REFERENCES users_group(id);


--
-- TOC entry 3311 (class 2606 OID 25677)
-- Name: users users_user_group_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_group_fkey1 FOREIGN KEY (user_group) REFERENCES public.users_group(id);


-- Completed on 2022-09-26 14:21:07

--
-- PostgreSQL database dump complete
--

