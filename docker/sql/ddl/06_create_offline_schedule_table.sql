create table offline_schedule (
    offline_schedule_id serial primary key,
    course_id varchar not null references course(course_id),
    day varchar not null,
    start_time int not null,
    end_time int not null,
    location varchar not null
);