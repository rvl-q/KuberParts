--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0 (Debian 14.0-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    content character varying(140)
);


ALTER TABLE public.todos OWNER TO postgres;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_id_seq OWNER TO postgres;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (id, content) FROM stdin;
1	Exercise 3.03: Project v1.4
2	Exercise 3.04: Project v1.41
3	Exercise 3.05: Project v1.42
4	test gke
5	new todo
6	Read https://en.wikipedia.org/wiki/Poecilocharax_rhizophilus
7	Read https://en.wikipedia.org/wiki/Russian_Caucasus_Forces_(before_1865)
8	Read https://en.wikipedia.org/wiki/Vardit_Ravitsky
9	Read https://en.wikipedia.org/wiki/Jamie_Reidy
10	Read https://en.wikipedia.org/wiki/Irina_Vorobieva
11	Read https://en.wikipedia.org/wiki/John_Traicos
12	Read https://en.wikipedia.org/wiki/Ivchenko_AI-24
13	Read https://en.wikipedia.org/wiki/University_High_School_(Tolleson)
14	Read https://en.wikipedia.org/wiki/Stakes_Winner
15	Read https://en.wikipedia.org/wiki/Macaroni_Factory,_Novosibirsk
16	Read https://en.wikipedia.org/wiki/Jamie_Davis_(musician)
17	Read https://en.wikipedia.org/wiki/Punicacortein_A
18	Read https://en.wikipedia.org/wiki/Wouter_Crabeth_I
19	POST todo
20	Read https://en.wikipedia.org/wiki/Bersteland
\.


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_id_seq', 20, true);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

