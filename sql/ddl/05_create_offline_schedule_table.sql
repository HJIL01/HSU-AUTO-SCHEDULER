CREATE TABLE offline_schedule (
    offline_schedule_id VARCHAR(255) NOT NULL PRIMARY KEY,
    day VARCHAR(255) NOT NULL,
    start_time INT NOT NULL,
    end_time INT NOT NULL,
    place VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE(course_id, day, start_time, end_time)
);
