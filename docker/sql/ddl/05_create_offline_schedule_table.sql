CREATE TABLE offline_schedule (
    offline_schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    day VARCHAR(255) NOT NULL,
    start_time INT NOT NULL,
    end_time INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    -- ON DELETE CASCADE를 넣으면 외래 키를 참조한 원본 테이블의 데이터가 삭제되면 ON DELETE CASCADE를 선언한 해당 테이블의 모든 참조 데이터가 삭제됨
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);
