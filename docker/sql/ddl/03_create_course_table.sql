CREATE TABLE course (
    course_id VARCHAR(255) PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    completion_type VARCHAR(255) NOT NULL,
    delivery_method VARCHAR(255) NOT NULL,
    credit INT NOT NULL,
    day_or_night ENUM('day', 'night', 'both') NOT NULL,
    class_section VARCHAR(255) NOT NULL,
    grade INT NOT NULL,
    grade_limit VARCHAR(255),
    online_min INT DEFAULT 0,
    plan_code VARCHAR(255)
);
