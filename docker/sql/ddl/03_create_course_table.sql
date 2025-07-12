CREATE TABLE course (
    course_id VARCHAR(255) PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    professor_name VARCHAR(255) NOT NULL,
    completion_type VARCHAR(255) NOT NULL,
    delivery_method VARCHAR(255) NOT NULL,
    credit INT NOT NULL,
    day_or_night VARCHAR(255) NOT NULL CHECK (day_or_night IN ('day', 'night', 'both')),
    class_section VARCHAR(255) NOT NULL,
    grade INT NOT NULL,
    grade_limit VARCHAR(255),
    online_min DECIMAL(2,1) DEFAULT 0,
    plan_code VARCHAR(255),
    semester_id VARCHAR(255) NOT NULL,
    major_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
    FOREIGN KEY (major_id) REFERENCES major(major_id)
);