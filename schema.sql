CREATE DATABASE journal_app;
USE journal_app;
 
CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) DEFAULT NULL,
    user_password VARCHAR(255) DEFAULT NULL,
    user_role VARCHAR(255) DEFAULT NULL,
    token VARCHAR(255) DEFAULT NULL
)

INSERT INTO users (user_name,user_password,user_role)
VALUES
('student','student@123','student'),
('teacher','teacher@123','teacher')

CREATE TABLE journals (
    journal_id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    attachment BLOB DEFAULT NULL,
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE journal_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    journal_id INT,
    student_id INT,
    FOREIGN KEY (journal_id) REFERENCES journals(journal_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE journal_publish(
    id INT PRIMARY KEY AUTO_INCREMENT,
    journal_id INT,
    published_at DATETIME,
    FOREIGN KEY (journal_id) REFERENCES journals(journal_id) ON DELETE CASCADE
)