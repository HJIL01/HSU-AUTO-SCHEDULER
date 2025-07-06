--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Debian 16.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

-- DDL 내의 sql 파일들 실행
\i sql/ddl/01_create_semester_table.sql
\i sql/ddl/02_create_major_table.sql
\i sql/ddl/03_create_enum_types.sql
\i sql/ddl/04_create_course_table.sql
\i sql/ddl/05_create_professor_table.sql
\i sql/ddl/06_create_offline_schedule_table.sql
\i sql/ddl/07_create_course_offering_table.sql

-- DNL 내의 sql 파일들 실행