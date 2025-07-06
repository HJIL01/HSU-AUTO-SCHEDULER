create table course (
    course_id varchar primary key,
    course_code varchar not null,
    course_name varchar not null,
    completion_type varchar not null,
    delivery_method varchar not null,
    credit int not null,
    day_or_night day_or_night_enum not null,
    class_section varchar not null,
    grade int not null,
    grade_limit varchar null,
    online_min int default 0,
    plan_code varchar null
);