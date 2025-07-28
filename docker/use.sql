use hsu_auto_scheduler;

SELECT
      c.course_id,
      c.course_name,
      GROUP_CONCAT(DISTINCT mc.completion_type) AS completion_types,
      GROUP_CONCAT(DISTINCT mc.grade) AS grades
    FROM course c
    LEFT JOIN major_course mc ON c.course_id = mc.course_id
    GROUP BY c.course_id, c.course_name