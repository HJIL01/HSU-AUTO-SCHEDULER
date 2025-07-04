--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: semester; Type: TABLE; Schema: public; Owner: dba1
--

CREATE TABLE public.semester (
    semester_id character varying NOT NULL,
    year integer NOT NULL,
    term integer NOT NULL,
    CONSTRAINT semester_term_check CHECK ((term = ANY (ARRAY[1, 2])))
);


ALTER TABLE public.semester OWNER TO dba1;

--
-- Data for Name: semester; Type: TABLE DATA; Schema: public; Owner: dba1
--

COPY public.semester (semester_id, year, term) FROM stdin;
2025-1	2025	1
\.


--
-- Name: semester semester_pkey; Type: CONSTRAINT; Schema: public; Owner: dba1
--

ALTER TABLE ONLY public.semester
    ADD CONSTRAINT semester_pkey PRIMARY KEY (semester_id);


--
-- PostgreSQL database dump complete
--

