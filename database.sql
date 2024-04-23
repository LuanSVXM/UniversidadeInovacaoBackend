DROP TABLE IF EXISTS students_courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS employees_permissions;
DROP TABLE IF EXISTS employees;


create table employees(
    id varchar(255) unique not null,
    name varchar(255) not null,
    password varchar(100) not null,
    cpf varchar(14) unique not null,
    fired timestamp  null,
    CONSTRAINT employee_pk PRIMARY KEY (id)
);


create table employees_permissions(
    id varchar(255) unique not null,
    employee_id varchar(255) not null,
    view_studant boolean default false,
    edit_studant boolean default false,
    delete_studant boolean default false,
    view_classes boolean default false,
    edit_classes boolean default false,
    delete_classes boolean default false,
    manager_employess boolean default false,
    CONSTRAINT employee_permission_pk PRIMARY KEY (id),
    CONSTRAINT employee_fk FOREIGN KEY (employee_id) REFERENCES employees(id) ON UPDATE CASCADE
);

create table courses (
    id varchar(255) unique not null,
    name varchar(255) not null unique,
    CONSTRAINT course_pk PRIMARY KEY (id)
);


create table classes (
    id varchar(255) unique not null,
    name varchar(255) not null,
    year int4 not null,
    course_id varchar(255) null,
    CONSTRAINT classe_pk PRIMARY KEY (id),
    CONSTRAINT course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON UPDATE CASCADE
);


create table students(
    id varchar(255) unique not null,
    name varchar(255) not null,
    email varchar(255) not null,
    cpf varchar(14) unique not null,
    registration_number int4 unique not null,
    inactive timestamp null,
    CONSTRAINT student_pk PRIMARY KEY (id)
);


create table students_courses(
    id serial4 NOT NULL,
    student_id varchar(255) not null,
    classe_id varchar(255) not null,
    CONSTRAINT student_course_pk PRIMARY KEY (id),
    CONSTRAINT student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT classe_fk FOREIGN KEY (classe_id) REFERENCES classes(id) ON UPDATE CASCADE ON DELETE CASCADE
);



